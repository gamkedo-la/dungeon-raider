import SceneKeys from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import UIAttributes from "../Globals/uiAttributes.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import { InterLevelCharacterPane, MissingPlayerShadow } from "../Keys/imageKeys.js"
import FontLabel from "../UIElements/fontLabel.js"
import HorizontalMenu from "../UIElements/horizontalMenu.js"
import Debug from "../Globals/debug.js"

class InterLevel extends Phaser.Scene {
  constructor () {
    super(SceneKeys.InterLevel)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.characterCount = 1
    this.playerCount = 1
    this.donePlayers = new Set()
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
        ActiveMenu: 'Done',
        CoolingDown: false,
        Equipment: null,
        Armor: null,
        Done: null
      },
      [Player2Keys.Player]: {
        ActiveMenu: 'Done',
        CoolingDown: false,
        Equipment: null,
        Armor: null,
        Done: null
      },
      [Player3Keys.Player]: {
        ActiveMenu: 'Done',
        CoolingDown: false,
        Equipment: null,
        Armor: null,
        Done: null
      },
      [Player4Keys.Player]: {
        ActiveMenu: 'Done',
        CoolingDown: false,
        Equipment: null,
        Armor: null,
        Done: null
      }
    }
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    if (Debug.SkipTitleScene && Debug.SkipCharacterCreateScene) {
      this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
        this.gameManager.addGamepad(pad)
      })
    }
    this.inputManager = new InputManager(this, this.gameManager)
    this.playerCount = this.gameManager.getPlayerCount()
    this.characterCount = this.gameManager.getCharacterCount()

    const activePlayers = this.gameManager.getActivePlayers()
    for (const activePlayer of activePlayers) {
      const inputEvent = this.gameManager.getInputEventForPlayer(activePlayer)
      this.playerInputs[inputEvent] = activePlayer
    }

    this.registerSceneForInputEvents()
    this.buildCharacterFrames()

    for (const activePlayer of activePlayers) {
      const attributes = this.gameManager.getCharacterAttributesForPlayer(activePlayer)
      attributes.health = attributes.health + Math.ceil((attributes.maxHealth - attributes.health) / 2)
      attributes.magic = attributes.magic + Math.ceil((attributes.maxMagic - attributes.magic) / 2)
      this.gameManager.setCharacterAttributesForPlayer(activePlayer, attributes)
    }

    // TODO: Build the Inter-Level screen, including:
    // 5. An audio & visual indication of when/which Players have confirmed their readiness to continue
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
    const player1Menus = this.buildPlayerMenu(Player1Keys.Player, player1Frame, UIAttributes.Player1Color)
    this.menus[Player1Keys.Player].Equipment = player1Menus.Equipment
    if (player1Menus.Arrows) this.menus[Player1Keys.Player].Arrows = player1Menus.Arrows
    this.menus[Player1Keys.Player].Armor = player1Menus.Armor
    this.menus[Player1Keys.Player].Done = player1Menus.Done

    const player2Frame = this.buildFrameForPlayer(player1Frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 2', UIAttributes.Player2Color, this.characterCount < 2)
    const player2Menus = this.buildPlayerMenu(Player2Keys.Player, player2Frame.frame, UIAttributes.Player2Color)
    this.menus[Player2Keys.Player].Equipment = player2Menus.Equipment
    if (player2Menus.Arrows) this.menus[Player2Keys.Player].Arrows = player2Menus.Arrows
    this.menus[Player2Keys.Player].Armor = player2Menus.Armor
    this.menus[Player2Keys.Player].Done = player2Menus.Done  

    const player3Frame = this.buildFrameForPlayer(player2Frame.frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 3', UIAttributes.Player3Color, this.characterCount < 3)
    const player3Menus = this.buildPlayerMenu(Player3Keys.Player, player3Frame.frame, UIAttributes.Player3Color)
    this.menus[Player3Keys.Player].Equipment = player3Menus.Equipment
    if (player3Menus.Arrows) this.menus[Player3Keys.Player].Arrows = player3Menus.Arrows
    this.menus[Player3Keys.Player].Armor = player3Menus.Armor
    this.menus[Player3Keys.Player].Done = player3Menus.Done  

    const player4Frame = this.buildFrameForPlayer(player3Frame.frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 4', UIAttributes.Player4Color, this.characterCount < 4)
    const player4Menus = this.buildPlayerMenu(Player4Keys.Player, player4Frame.frame, UIAttributes.Player4Color)
    this.menus[Player4Keys.Player].Equipment = player4Menus.Equipment
    if (this.menus[Player4Keys.Player].Arrows) this.menus[Player4Keys.Player].Arrows = player4Menus.Arrows
    this.menus[Player4Keys.Player].Armor = player4Menus.Armor
    this.menus[Player4Keys.Player].Done = player4Menus.Done  
  }

  buildFrameForPlayer (x, y, title, color, missing = false) {
    const frame = this.add.image(x, y, InterLevelCharacterPane)

    const labelWidth = 40
    const playerLabelY = 30

    const label = new FontLabel(this, {
      x: frame.x - labelWidth,
      y: playerLabelY,
      title: title,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color
    })

    if (missing) {
      const shadow = this.add.image(frame.x, frame.y, MissingPlayerShadow)
      shadow.depth = 100
    }

    return { frame, label }
  }

  buildPlayerMenu (player, frame, color) {
    const characterAttributes = this.gameManager.getCharacterAttributesForPlayer(player)
    const equipmentMenu = this.buildCharacterMenu(frame.x, frame.y, color, 'Equipment', characterAttributes?.availableEquipment.map(equipment => equipment.name) || [], 0, true)
    let deltaY = 60
    let arrowMenu = null
    if (characterAttributes?.availableArrows)  {
      const arrowOptions = []
      characterAttributes.availableArrows.forEach(arrow => {
        arrowOptions.push(`${arrow.name} (${arrow.quantity})`)
      })
      arrowMenu = this.buildCharacterMenu(frame.x, frame.y + deltaY, color, 'Arrows', arrowOptions)
      deltaY += 60
    }
    const armorMenu = this.buildCharacterMenu(frame.x, frame.y + deltaY, color, 'Armor', characterAttributes?.availableArmor.map(armor => armor.name) || [])
    deltaY += 60
    const doneMenu = this.buildDoneMenu(frame.x, frame.y + deltaY, color)

    return { Equipment: equipmentMenu, Arrows: arrowMenu, Armor: armorMenu, Done: doneMenu }
  }

  buildCharacterMenu (x, y, color, title, options, initialOption = 0, initiallyActive = false) {
    const menu = new HorizontalMenu(this, {
      gameManager: this.gameManager,
      title,
      titleColor: color,
      x,
      y,
      options,
      initialOption,
      activeColor: UIAttributes.UIColor,
      inactiveColor: UIAttributes.UIInactiveColor,
      spacing: 20,
      isActive: initiallyActive
    })

    return menu
  }

  buildDoneMenu (x, y, color) {
    const menu = new HorizontalMenu(this, {
      gameManager: this.gameManager,
      title: 'Done',
      titleColor: color,
      x,
      y,
      options: [],
      initialOption: 0,
      activeColor: UIAttributes.UIColor,
      inactiveColor: UIAttributes.UIInactiveColor,
      spacing: 20,
      isActive: false
    })

    return menu
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  processWASD (event) {
    if (!Object.values(event).some(input => input.isDown)) return

    this.processInputForPlayer(this.playerInputs[InputEventKeys.onWASD], event)
  }

  processArrows (event) {
    if (!Object.values(event).some(input => input.isDown)) return

    this.processInputForPlayer(this.playerInputs[InputEventKeys.onArrows], event)
  }

  processGamepad1 (event) {
    if (!Object.values(event).some(input => input.isDown)) return

    this.processInputForPlayer(this.playerInputs[InputEventKeys.onGamepad1], event)
  }

  processGamepad2 (event) {
    if (!Object.values(event).some(input => input.isDown)) return

    this.processInputForPlayer(this.playerInputs[InputEventKeys.onGamepad2], event)
  }

  processGamepad3 (event) {
    if (!Object.values(event).some(input => input.isDown)) return

    this.processInputForPlayer(this.playerInputs[InputEventKeys.onGamepad3], event)
  }

  processGamepad4 (event) {
    if (!Object.values(event).some(input => input.isDown)) return

    this.processInputForPlayer(this.playerInputs[InputEventKeys.onGamepad4], event)
  }

  processInputForPlayer (player, event) {
    if (this.donePlayers.has(player)) return

    if (event.left?.isDown) {
      if (this.menus[player].CoolingDown) return

      this.getActiveMenuForPlayer(player).moveLeft()

      this.menus[player].CoolingDown = true
      this.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menus[player].CoolingDown = false
      })
    }

    if (event.right?.isDown) {
      if (this.menus[player].CoolingDown) return

      this.getActiveMenuForPlayer(player).moveRight()

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

  playerIsDone (player) {
    this.donePlayers.add(player)
    if (this.donePlayers.size >= this.playerCount) {
      this.allPlayersAreDone()
    }
  }

  allPlayersAreDone () {
    this.gameManager.goToLevel(this.gameManager.getActiveExit().destinationLevelKey)
    this.scene.remove(this.key)
  }

  getActiveMenuForPlayer (player) {
    return this.menus[player][this.menus[player].ActiveMenu]
  }
}

export default InterLevel