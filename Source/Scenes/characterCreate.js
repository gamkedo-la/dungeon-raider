import { CharacterClasses, Races, getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/Characters/character.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from "../Keys/inputEventKeys.js"
import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import SceneKeys from "../Keys/sceneKeys.js"
import UIAttributes from "../Globals/uiAttributes.js"
import FontLabel from "../UIElements/fontLabel.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import { InterLevelCharacterPane, MissingPlayerShadow } from "../Keys/imageKeys.js"
import HorizontalMenu from "../UIElements/horizontalMenu.js"
import Debug from "../Globals/debug.js"

class CharacterCreate extends Phaser.Scene {
  constructor () {
    super(SceneKeys.CharacterCreate)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.playerCount = 1
    this.characterCount = 1
    this.donePlayers = new Set()
    this.allPayersAreReady = false
    this.player1Registered = false
    this.player2Registered = false
    this.player3Registered = false
    this.player4Registered = false
    this.allActivePlayersRegistered = false
    this.playerInputs = {
      [InputEventKeys.onWASD]: null,
      [InputEventKeys.onArrows]: null,
      [InputEventKeys.onGamepad1]: null,
      [InputEventKeys.onGamepad2]: null,
      [InputEventKeys.onGamepad3]: null,
      [InputEventKeys.onGamepad4]: null
    }
    this.menus = {
      [Player1Keys.Player]: {
        ActiveMenu: 'Race',
        CoolingDown: false,
        Race: null,
        Class: null,
        Done: null,
        NPC: null
      },
      [Player2Keys.Player]: {
        ActiveMenu: 'Race',
        CoolingDown: false,
        Race: null,
        Class: null,
        Done: null
      },
      [Player3Keys.Player]: {
        ActiveMenu: 'Race',
        CoolingDown: false,
        Race: null,
        Class: null,
        Done: null
      },
      [Player4Keys.Player]: {
        ActiveMenu: 'Race',
        CoolingDown: false,
        Race: null,
        Class: null,
        Done: null
      }
    }
    this.characterTitles = {
      [Player1Keys.Player]: null,
      [Player2Keys.Player]: null,
      [Player3Keys.Player]: null,
      [Player4Keys.Player]: null
    }
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    if (Debug.SkipTitleScene) {
      this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
        this.gameManager.addGamepad(pad)
      })
    }
    this.playerCount = this.gameManager.getPlayerCount()
    this.characterCount = this.gameManager.getCharacterCount()

    this.inputManager = new InputManager(this, this.gameManager)

    this.registerSceneForInputEvents()
    this.buildCharacterFrames()
  }

  registerSceneForInputEvents () {
    for (const inputEvent in InputEventKeys) {
      switch (inputEvent) {
        case InputEventKeys.onWASD:
          this.inputManager.registerForEvent(inputEvent, this.processWASD, this)
          break
        case InputEventKeys.onArrows:
          this.inputManager.registerForEvent(inputEvent, this.processArrows, this)
          break
        case InputEventKeys.onGamepad1:
          this.inputManager.registerForEvent(inputEvent, this.processGamepad1, this)
          break
        case InputEventKeys.onGamepad2:
          this.inputManager.registerForEvent(inputEvent, this.processGamepad2, this)
          break
        case InputEventKeys.onGamepad3:
          this.inputManager.registerForEvent(inputEvent, this.processGamepad3, this)
          break
        case InputEventKeys.onGamepad4:
          this.inputManager.registerForEvent(inputEvent, this.processGamepad4, this)
          break
        case InputEventKeys.onSelect:
        case InputEventKeys.onDebug:
        case InputEventKeys.onPause:
          break
        default:
          console.warn(`Unhandled input event: ${inputEvent}`)
          break
      }
    }
  }

  buildCharacterFrames () {
    const frameData = this.buildFrameForPlayer(0, 0, 'Player 1', UIAttributes.Player1Color)
    const player1Frame = frameData.frame
    const player1Label = frameData.label
    player1Frame.setPosition(player1Frame.width / 2, this.game.canvas.height / 2)
    player1Label.x += player1Frame.x
    this.buildPlayerMenu(Player1Keys.Player, player1Frame, player1Label.y, UIAttributes.Player1Color, 1, this.playerCount < 4)

    const player2Frame = this.buildFrameForPlayer(player1Frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 2', UIAttributes.Player2Color, this.characterCount < 2)
    this.buildPlayerMenu(Player2Keys.Player, player2Frame.frame, player2Frame.label.y, UIAttributes.Player2Color, 2)

    const player3Frame = this.buildFrameForPlayer(player2Frame.frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 3', UIAttributes.Player3Color, this.characterCount < 3)
    this.buildPlayerMenu(Player3Keys.Player, player3Frame.frame, player3Frame.label.y, UIAttributes.Player3Color, 3)

    const player4Frame = this.buildFrameForPlayer(player3Frame.frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 4', UIAttributes.Player4Color, this.characterCount < 4)
    this.buildPlayerMenu(Player4Keys.Player, player4Frame.frame, player4Frame.label.y, UIAttributes.Player4Color, 4)
  }

  buildFrameForPlayer (x, y, title, color, missing = false) {
    const frame = this.add.image(x, y, InterLevelCharacterPane)

    const playerLabelY = 30

    const label = new FontLabel(this, {
      x: frame.x,
      y: playerLabelY,
      title: title,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color,
      align: UIAttributes.CenterAlign,
    })

    if (missing) {
      const shadow = this.add.image(frame.x, frame.y, MissingPlayerShadow)
      shadow.depth = 100
    }

    return { frame, label }
  }

  buildPlayerMenu (player, frame, labelY, color, minPlayerCount, includeNPCMenu = false) {
    this.menus[player].Race = this.buildCharacterMenu(frame.x, frame.y, color, 'Character Type', Object.values(Races), 1, UIAttributes.UIColorDark, UIAttributes.UIInactiveColor, 20, true)
    this.menus[player].Class = this.buildCharacterMenu(frame.x, frame.y + 60, color, 'Character Class', Object.values(CharacterClasses))
    this.menus[player].Done = this.buildDoneMenu(frame.x, frame.y + 120, color)
    if (includeNPCMenu && this.playerCount < 4) {
      this.menus[player].NPC = this.buildNPCMenu(frame.x, frame.y + 150, color)
    } else {
      delete this.menus[player].NPC
    }

    if (this.playerCount >= minPlayerCount) {
      const activeRaceIndex = this.menus[player].Race.activeOption
      const activeClassIndex = this.menus[player].Class.activeOption
      this.characterTitles[player] = this.buildCharacterTitle(
        frame.x,
        labelY + UIAttributes.getFontSizeNumber(UIAttributes.CharacterHeaderSize) + 10,
        color,
        this.menus[player].Race.options[activeRaceIndex],
        this.menus[player].Class.options[activeClassIndex]
      )
    }
  }

  buildCharacterTitle (x, y, color, race, characterClass) {
    const title = new FontLabel(this, {
      x,
      y,
      title: `${race} ${characterClass}`,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color,
      align: UIAttributes.CenterAlign
    })

    return title
  }

  buildCharacterMenu (x, y, color, title, options = [], initialOption = 0, activeColor = UIAttributes.UIColorDark, inactiveColor = UIAttributes.UIInactiveColor, spacing = 20, isActive = false) {
    const menu = new HorizontalMenu(this, {
      gameManager: this.gameManager,
      title,
      titleColor: color,
      x,
      y,
      options,
      initialOption,
      activeColor,
      inactiveColor,
      spacing,
      isActive
    })

    return menu
  }

  buildDoneMenu (x, y, color) {
    const menu = new HorizontalMenu(this, {
      gameManager: this.gameManager,
      title: 'Done',
      titleColor: color,
      x: x,
      y: y,
      options: [],
      initialOption: 0,
      activeColor: UIAttributes.UIColorDark,
      inactiveColor: UIAttributes.UIInactiveColor,
      spacing: 20,
      isActive: false
    })

    return menu
  }

  buildNPCMenu (x, y, color) {
    let npcOptions = ['None']
      if (this.characterCount < 2) npcOptions.push('One NPC', 'Two NPCs', 'Three NPCs')
      else if (this.characterCount < 3) npcOptions.push('One NPC', 'Two NPCs')
      else if (this.characterCount < 4) npcOptions.push('One NPC')
    const menu = new HorizontalMenu(this, {
      gameManager: this.gameManager,
      title: 'NPC',
      titleColor: color,
      x: x,
      y: y,
      options: npcOptions,
      initialOption: 0,
      activeColor: UIAttributes.UIColorDark,
      inactiveColor: UIAttributes.UIInactiveColor,
      spacing: 30,
      isActive: false
    })

    return menu
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  registerInput (inputEvent) {
    if (this.allActivePlayersRegistered) return
    if (this.playerInputs[inputEvent]) return

    if (!this.player1Registered) {
      this.playerInputs[inputEvent] = Player1Keys.Player
      this.player1Registered = true
      if (this.playerCount === 1) this.allActivePlayersRegistered = true
      this.gameManager.setActivePlayer(Player1Keys.Player, this.getInputOptionForInputEvent(inputEvent), true)
    } else if (!this.player2Registered) {
      this.playerInputs[inputEvent] = Player2Keys.Player
      this.player2Registered = true
      if (this.playerCount === 2) this.allActivePlayersRegistered = true
      this.gameManager.setActivePlayer(Player2Keys.Player, this.getInputOptionForInputEvent(inputEvent), true)
    } else if (!this.player3Registered) {
      this.playerInputs[inputEvent] = Player3Keys.Player
      this.player3Registered = true
      if (this.playerCount === 3) this.allActivePlayersRegistered = true
      this.gameManager.setActivePlayer(Player3Keys.Player, this.getInputOptionForInputEvent(inputEvent), true)
    } else if (!this.player4Registered) {
      this.playerInputs[inputEvent] = Player4Keys.Player
      this.player4Registered = true
      if (this.playerCount === 4) this.allActivePlayersRegistered = true
      this.gameManager.setActivePlayer(Player4Keys.Player, this.getInputOptionForInputEvent(inputEvent), true)
    }
  }

  processWASD (event) {
    if (this.allPayersAreReady || !Object.values(event).some(input => input.isDown)) return

    this.registerInput(InputEventKeys.onWASD)
    this.processInputForPlayer(this.playerInputs[InputEventKeys.onWASD], event)
  }

  processArrows (event) {
    if (this.allPayersAreReady || !Object.values(event).some(input => input.isDown)) return

    this.registerInput(InputEventKeys.onArrows)
    this.processInputForPlayer(this.playerInputs[InputEventKeys.onArrows], event)
  }

  processGamepad1 (event) {
    if (this.allPayersAreReady || !Object.values(event).some(input => input.isDown)) return

    this.registerInput(InputEventKeys.onGamepad1)
    this.processInputForPlayer(this.playerInputs[InputEventKeys.onGamepad1], event)
  }

  processGamepad2 (event) {
    if (this.allPayersAreReady || !Object.values(event).some(input => input.isDown)) return

    this.registerInput(InputEventKeys.onGamepad2)
    this.processInputForPlayer(this.playerInputs[InputEventKeys.onGamepad2], event)
  }

  processGamepad3 (event) {
    if (this.allPayersAreReady || !Object.values(event).some(input => input.isDown)) return

    this.registerInput(InputEventKeys.onGamepad3)
    this.processInputForPlayer(this.playerInputs[InputEventKeys.onGamepad3], event)
  }

  processGamepad4 (event) {
    if (this.allPayersAreReady || !Object.values(event).some(input => input.isDown)) return

    this.registerInput(InputEventKeys.onGamepad4)
    this.processInputForPlayer(this.playerInputs[InputEventKeys.onGamepad4], event)
  }

  processInputForPlayer (player, event) {
    if (this.allPayersAreReady) return
    if (this.donePlayers.has(player)) return

    if (event.left?.isDown) {
      if (this.menus[player].CoolingDown) return

      this.getActiveMenuForPlayer(player).moveLeft()
      if (this.menus[player].ActiveMenu === 'Race' || this.menus[player].ActiveMenu === 'Class') {
        const activeRaceIndex = this.menus[player].Race.activeOption
        const activeClassIndex = this.menus[player].Class.activeOption
  
        this.characterTitles[player].updateTitle(
          `${this.menus[player].Race.options[activeRaceIndex]} ${this.menus[player].Class.options[activeClassIndex]}`
        )
      }

      this.menus[player].CoolingDown = true
      this.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menus[player].CoolingDown = false
      })
    }

    if (event.right?.isDown) {
      if (this.menus[player].CoolingDown) return

      this.getActiveMenuForPlayer(player).moveRight()
      if (this.menus[player].ActiveMenu === 'Race' || this.menus[player].ActiveMenu === 'Class') {
        const activeRaceIndex = this.menus[player].Race.activeOption
        const activeClassIndex = this.menus[player].Class.activeOption
  
        this.characterTitles[player].updateTitle(
          `${this.menus[player].Race.options[activeRaceIndex]} ${this.menus[player].Class.options[activeClassIndex]}`
        )
      }

      this.menus[player].CoolingDown = true
      this.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menus[player].CoolingDown = false
      })
    }

    if (event.down?.isDown) {
      if (this.menus[player].CoolingDown) return

      let menus = Object.keys(this.menus[player])
      menus = menus.filter(menu => menu !== 'ActiveMenu' && menu !== 'CoolingDown')
      const activeMenuIndex = menus.indexOf(this.menus[player].ActiveMenu)
      const nextMenuIndex = activeMenuIndex + 1
      if (nextMenuIndex < menus.length) {
        this.menus[player].ActiveMenu = menus[nextMenuIndex]
      } else {
        this.menus[player].ActiveMenu = menus[0]
      }

      menus.forEach(menu => {
        if (menu !== this.menus[player].ActiveMenu) {
          this.menus[player][menu].setActive(false)
        } else {
          this.menus[player][menu].setActive(true)
        } 
      })

      this.menus[player].CoolingDown = true
      this.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menus[player].CoolingDown = false
      })
    }

    if (event.up?.isDown) {
      if (this.menus[player].CoolingDown) return

      let menus = Object.keys(this.menus[player])
      menus = menus.filter(menu => menu !== 'ActiveMenu' && menu !== 'CoolingDown')
      const activeMenuIndex = menus.indexOf(this.menus[player].ActiveMenu)
      const previousMenuIndex = activeMenuIndex - 1
      if (previousMenuIndex >= 0) {
        this.menus[player].ActiveMenu = menus[previousMenuIndex]
      } else {
        this.menus[player].ActiveMenu = menus[menus.length - 1]
      }

      menus.forEach(menu => {
        if (menu !== this.menus[player].ActiveMenu) {
          this.menus[player][menu].setActive(false)
        } else {
          this.menus[player][menu].setActive(true)
        } 
      })

      this.menus[player].CoolingDown = true
      this.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menus[player].CoolingDown = false
      })
    }

    if (event.primary?.isDown || event.secondary?.isDown) {
      if (this.menus[player].CoolingDown) return
      if (this.getActiveMenuForPlayer(player) === this.menus[player].Done) {
        this.playerIsDone(player)
      }
    }
  }

  getInputOptionForInputEvent (inputEvent) {
    switch (inputEvent) {
      case InputEventKeys.onWASD:
        return InputOptionsKeys.WASD
      case InputEventKeys.onArrows:
        return InputOptionsKeys.Arrows
      case InputEventKeys.onGamepad1:
        return InputOptionsKeys.Gamepad1
      case InputEventKeys.onGamepad2:
        return InputOptionsKeys.Gamepad2
      case InputEventKeys.onGamepad3:
        return InputOptionsKeys.Gamepad3
      case InputEventKeys.onGamepad4:
        return InputOptionsKeys.Gamepad4
      default:
        return null
    }
  }

  playerIsDone (player) {
    this.donePlayers.add(player)
    if (this.donePlayers.size >= this.playerCount) {
      this.allPlayersAreDone()
    }
  }

  allPlayersAreDone () {
    this.allPayersAreReady = true
    this.updateCharacterCountForNPCs()
    this.buildCharacters()
    this.gameManager.goToLevel(Debug.LevelToLoad)
    this.scene.remove(SceneKeys.CharacterCreate)
  }

  updateCharacterCountForNPCs () {
    const npcMenu = this.menus[Player1Keys.Player].NPC
    switch (npcMenu.activeOption) {
      case 0: // "None"
        break
      case 1: // "One NPC"
        this.characterCount++
        break
      case 2: // "Two NPCs"
        this.characterCount += 2
        break
      case 3: // "Three NPCs"
        this.characterCount += 3
        break
      default: // "None" or Invalid Option
        break
    }

    this.gameManager.setCharacterCount(this.characterCount)
  }

  buildCharacters () {
    createPlayer1Character(this, this.gameManager, this.menus[Player1Keys.Player])
    if (this.characterCount > 1) createPlayer2Character(this, this.gameManager, this.menus[Player2Keys.Player])
    if (this.characterCount > 2) createPlayer3Character(this, this.gameManager, this.menus[Player3Keys.Player])
    if (this.characterCount > 3) createPlayer4Character(this, this.gameManager, this.menus[Player4Keys.Player])
  }

  getActiveMenuForPlayer (player) {
    return this.menus[player][this.menus[player].ActiveMenu]
  }
}

function createPlayer1Character (scene, gameManager, menus) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(menus.Race.getSelectedOption(), menus.Class.getSelectedOption())
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player1Keys.Player,
    race: menus.Race.getSelectedOption(),
    characterClass: menus.Class.getSelectedOption(),
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player1Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer2Character (scene, gameManager, menus) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(menus ? menus.Race.getSelectedOption() : Debug.Player2Race, menus ? menus.Class.getSelectedOption() : Debug.Player2Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player2Keys.Player,
    race: menus ? menus.Race.getSelectedOption() : Debug.Player2Race,
    characterClass: menus ? menus.Class.getSelectedOption() : Debug.Player2Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player2Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer3Character (scene, gameManager, menus) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(menus ? menus.Race.getSelectedOption() : Debug.Player3Race, menus ? menus.Class.getSelectedOption() : Debug.Player3Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player3Keys.Player,
    race: menus ? menus.Race.getSelectedOption() : Debug.Player3Race,
    characterClass: menus ? menus.Class.getSelectedOption() : Debug.Player3Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player3Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer4Character (scene, gameManager, menus) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(menus ? menus.Race.getSelectedOption() : Debug.Player4Race, menus ? menus.Class.getSelectedOption() : Debug.Player4Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player4Keys.Player,
    race: menus ? menus.Race.getSelectedOption() : Debug.Player4Race,
    characterClass: menus ? menus.Class.getSelectedOption() : Debug.Player4Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player4Keys.Player)
  }))

  newCharacter.serialize()
}

export default CharacterCreate