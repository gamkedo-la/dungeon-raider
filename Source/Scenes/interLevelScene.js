import SceneKeys from "../Keys/sceneKeys.js"
import AudioKeys, { WelcomeMusicBody } from "../Keys/audioKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import UIAttributes from "../Globals/uiAttributes.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import { InterLevelCharacterPane, MissingPlayerShadow } from "../Keys/imageKeys.js"
import FontLabel from "../UIElements/fontLabel.js"
import HorizontalMenu from "../UIElements/horizontalMenu.js"
import Debug from "../Globals/debug.js"
import { getWeaponByName } from "../Globals/weaponAttributes.js"

class InterLevel extends Phaser.Scene {
  constructor () {
    super(SceneKeys.InterLevel)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.music = null
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
        Done: null,
        Primary: null,
        Secondary: null,
        Arrows: null,
        Armor: null
      },
      [Player2Keys.Player]: {
        ActiveMenu: 'Done',
        CoolingDown: false,
        Done: null,
        Primary: null,
        Secondary: null,
        Arrows: null,
        Armor: null
      },
      [Player3Keys.Player]: {
        ActiveMenu: 'Done',
        CoolingDown: false,
        Done: null,
        Primary: null,
        Secondary: null,
        Arrows: null,
        Armor: null
      },
      [Player4Keys.Player]: {
        ActiveMenu: 'Done',
        CoolingDown: false,
        Done: null,
        Primary: null,
        Secondary: null,
        Arrows: null,
        Armor: null
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

    let allSounds = this.sound.getAll()

    this.music = allSounds.find(sound => sound.key === WelcomeMusicBody && sound.isPaused)
    if (this.music) {
      this.music.resume()
    } else {
      allSounds = this.sound.getAll()
      this.music = allSounds.find(sound => sound.key === WelcomeMusicBody)
      this.music.play({ loop: AudioKeys[WelcomeMusicBody].loop, volume: AudioKeys[WelcomeMusicBody].volume })
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
    const frameData = this.buildFrameForPlayer(Player1Keys.Player, 0, 0, 'Player 1', UIAttributes.Player1Color)
    const player1Frame = frameData.frame
    player1Frame.setPosition(player1Frame.width / 2, this.game.canvas.height / 2)
    frameData.label.x += player1Frame.x
    if (frameData.typeAndClass) frameData.typeAndClass.x += player1Frame.x
    const player1Menus = this.buildPlayerMenu(Player1Keys.Player, player1Frame, UIAttributes.Player1Color)
    this.menus[Player1Keys.Player].Primary = player1Menus.Primary
    if (player1Menus.Arrows) {
      this.menus[Player1Keys.Player].Arrows = player1Menus.Arrows
      delete this.menus[Player1Keys.Player].Secondary
    } else {
      delete this.menus[Player1Keys.Player].Arrows
      this.menus[Player1Keys.Player].Secondary = player1Menus.Secondary
    }
    this.menus[Player1Keys.Player].Armor = player1Menus.Armor
    this.menus[Player1Keys.Player].Done = player1Menus.Done

    const player2Frame = this.buildFrameForPlayer(Player2Keys.Player, player1Frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 2', UIAttributes.Player2Color, this.characterCount < 2)
    const player2Menus = this.buildPlayerMenu(Player2Keys.Player, player2Frame.frame, UIAttributes.Player2Color)
    this.menus[Player2Keys.Player].Primary = player2Menus.Primary
    if (player2Menus.Arrows) {
      this.menus[Player2Keys.Player].Arrows = player2Menus.Arrows
      delete this.menus[Player2Keys.Player].Secondary
    } else {
      delete this.menus[Player2Keys.Player].Arrows
      this.menus[Player2Keys.Player].Secondary = player2Menus.Secondary
    }
    this.menus[Player2Keys.Player].Armor = player2Menus.Armor
    this.menus[Player2Keys.Player].Done = player2Menus.Done  

    const player3Frame = this.buildFrameForPlayer(Player3Keys.Player, player2Frame.frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 3', UIAttributes.Player3Color, this.characterCount < 3)
    const player3Menus = this.buildPlayerMenu(Player3Keys.Player, player3Frame.frame, UIAttributes.Player3Color)
    this.menus[Player3Keys.Player].Primary = player3Menus.Primary
    if (player3Menus.Arrows) {
      this.menus[Player3Keys.Player].Arrows = player3Menus.Arrows
      delete this.menus[Player3Keys.Player].Secondary
    } else {
      delete this.menus[Player3Keys.Player].Arrows
      this.menus[Player3Keys.Player].Secondary = player3Menus.Secondary
    }
    this.menus[Player3Keys.Player].Armor = player3Menus.Armor
    this.menus[Player3Keys.Player].Done = player3Menus.Done  

    const player4Frame = this.buildFrameForPlayer(Player4Keys.Player, player3Frame.frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 4', UIAttributes.Player4Color, this.characterCount < 4)
    const player4Menus = this.buildPlayerMenu(Player4Keys.Player, player4Frame.frame, UIAttributes.Player4Color)
    this.menus[Player4Keys.Player].Primary = player4Menus.Primary
    if (this.menus[Player4Keys.Player].Arrows) {
      this.menus[Player4Keys.Player].Arrows = player4Menus.Arrows
      delete this.menus[Player4Keys.Player].Secondary
    } else {
      delete this.menus[Player4Keys.Player].Arrows
      this.menus[Player4Keys.Player].Secondary = player4Menus.Secondary
    }
    this.menus[Player4Keys.Player].Armor = player4Menus.Armor
    this.menus[Player4Keys.Player].Done = player4Menus.Done  
  }

  buildFrameForPlayer (player, x, y, title, color, missing = false) {
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

    const race = this.gameManager.getCharacterRaceForPlayer(player)
    const characterClass =  this.gameManager.getCharacterClassForPlayer(player)
    let typeAndClass = null
    if (race && characterClass) {
      typeAndClass = new FontLabel(this, {
        x: frame.x,
        y: playerLabelY + UIAttributes.getFontSizeNumber(UIAttributes.CharacterHeaderSize) + 10,
        title: `${race} ${characterClass}`,
        fontFamily: UIAttributes.UIFontFamily,
        fontSize: UIAttributes.CharacterHeaderSize,
        color,
        align: UIAttributes.CenterAlign,
      })
    }

    if (missing) {
      const shadow = this.add.image(frame.x, frame.y, MissingPlayerShadow)
      shadow.depth = 100
    }

    return { frame, label, typeAndClass }
  }

  buildPlayerMenu (player, frame, color) {
    const characterAttributes = this.gameManager.getCharacterAttributesForPlayer(player)

    const doneMenu = this.buildDoneMenu(frame.x, frame.y, color)

    let deltaY = 30
    const primaryEquipment = characterAttributes?.availableEquipment.map(equipment => equipment.name) || []
    if (characterAttributes?.secondary.name !== 'None' && characterAttributes?.secondary.name !== 'Fists') primaryEquipment.splice(primaryEquipment.indexOf(characterAttributes?.secondary.name), 1)
    const primaryMenu = this.buildCharacterMenu(frame.x, frame.y + deltaY, color, 'Primary', primaryEquipment, primaryEquipment.indexOf(characterAttributes?.primary.name))

    let arrowMenu = null
    let secondaryMenu = null
    if (characterAttributes?.availableArrows)  {
      // This is an archer because they have arrows
      const arrowOptions = []
      characterAttributes.availableArrows.forEach(arrow => {
        arrowOptions.push(`${arrow.name} (${arrow.quantity})`)
      })
      deltaY += 60
      arrowMenu = this.buildCharacterMenu(frame.x, frame.y + deltaY, color, 'Arrows', arrowOptions)
    } else {
      // Archers have arrows, but do not have a secondary weapon
      const secondaryEquipment = characterAttributes?.availableEquipment.map(equipment => equipment.name) || []
      if (characterAttributes?.primary.name !== 'None' && characterAttributes?.primary.name !== 'Fists') secondaryEquipment.splice(secondaryEquipment.indexOf(characterAttributes?.primary.name), 1)
      if (secondaryEquipment) {
        deltaY += 60
        secondaryMenu = this.buildCharacterMenu(frame.x, frame.y + deltaY, color, 'Secondary', secondaryEquipment, secondaryEquipment.indexOf(characterAttributes?.secondary.name))
      }
    }

    deltaY += 60
    const armorMenu = this.buildCharacterMenu(frame.x, frame.y + deltaY, color, 'Armor', characterAttributes?.availableArmor.map(armor => armor.name) || [])

    return { Done: doneMenu, Primary: primaryMenu, Secondary: secondaryMenu, Arrows: arrowMenu, Armor: armorMenu }
  }

  buildCharacterMenu (x, y, color, title, options, initialOption = 0) {
    const menu = new HorizontalMenu(this, {
      gameManager: this.gameManager,
      title,
      titleColor: color,
      x,
      y,
      options,
      initialOption,
      activeColor: UIAttributes.UIColorDark,
      inactiveColor: UIAttributes.UIInactiveColor,
      spacing: 20,
      isActive: false
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
      activeColor: UIAttributes.UIColorDark,
      inactiveColor: UIAttributes.UIInactiveColor,
      spacing: 20,
      isActive: true
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
      if (this.menus[player].ActiveMenu === 'Primary') {
        // Need to update the options available in the Secondary menu
        const characterAttributes = this.gameManager.getCharacterAttributesForPlayer(player)
        const primaryActiveOption = this.menus[player].Primary.getSelectedOption()
        characterAttributes.primary = getWeaponByName(primaryActiveOption)
        const secondaryActiveOption = this.menus[player].Secondary.getSelectedOption()
        const secondaryEquipment = characterAttributes?.availableEquipment.map(equipment => equipment.name) || []
        if (primaryActiveOption !== 'None' && primaryActiveOption !== 'Fists') secondaryEquipment.splice(secondaryEquipment.indexOf(primaryActiveOption), 1)
        this.menus[player].Secondary.updateAvailableOptions(secondaryEquipment, secondaryEquipment.indexOf(secondaryActiveOption))
      } else if (this.menus[player].ActiveMenu === 'Secondary') {
        // Need to update the options available in the Primary menu
        const characterAttributes = this.gameManager.getCharacterAttributesForPlayer(player)
        const primaryActiveOption = this.menus[player].Primary.getSelectedOption()
        const secondaryActiveOption = this.menus[player].Secondary.getSelectedOption()
        characterAttributes.secondary = getWeaponByName(secondaryActiveOption)
        const primaryEquipment = characterAttributes?.availableEquipment.map(equipment => equipment.name) || []
        if (secondaryActiveOption.name !== 'None' && secondaryActiveOption !== 'Fists') primaryEquipment.splice(primaryEquipment.indexOf(secondaryActiveOption), 1)
        this.menus[player].Primary.updateAvailableOptions(primaryEquipment, primaryEquipment.indexOf(primaryActiveOption))
      }

      this.menus[player].CoolingDown = true
      this.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menus[player].CoolingDown = false
      })
    }

    if (event.right?.isDown) {
      if (this.menus[player].CoolingDown) return

      this.getActiveMenuForPlayer(player).moveRight()
      if (this.menus[player].ActiveMenu === 'Primary') {
        // Need to update the options available in the Secondary menu
        const characterAttributes = this.gameManager.getCharacterAttributesForPlayer(player)
        const primaryActiveOption = this.menus[player].Primary.getSelectedOption()
        characterAttributes.primary = getWeaponByName(primaryActiveOption)
        const secondaryActiveOption = this.menus[player].Secondary.getSelectedOption()
        const secondaryEquipment = characterAttributes?.availableEquipment.map(equipment => equipment.name) || []
        if (primaryActiveOption !== 'None' && primaryActiveOption !== 'Fists') secondaryEquipment.splice(secondaryEquipment.indexOf(primaryActiveOption), 1)
        this.menus[player].Secondary.updateAvailableOptions(secondaryEquipment, secondaryEquipment.indexOf(secondaryActiveOption))
      } else if (this.menus[player].ActiveMenu === 'Secondary') {
        // Need to update the options available in the Primary menu
        const characterAttributes = this.gameManager.getCharacterAttributesForPlayer(player)
        const primaryActiveOption = this.menus[player].Primary.getSelectedOption()
        const secondaryActiveOption = this.menus[player].Secondary.getSelectedOption()
        characterAttributes.secondary = getWeaponByName(secondaryActiveOption)
        const primaryEquipment = characterAttributes?.availableEquipment.map(equipment => equipment.name) || []
        if (secondaryActiveOption !== 'None' && secondaryActiveOption !== 'Fists') primaryEquipment.splice(primaryEquipment.indexOf(secondaryActiveOption), 1)
        this.menus[player].Primary.updateAvailableOptions(primaryEquipment, primaryEquipment.indexOf(primaryActiveOption))
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

  playerIsDone (player) {
    this.donePlayers.add(player)
    if (this.donePlayers.size >= this.playerCount) {
      this.allPlayersAreDone()
    }
  }

  allPlayersAreDone () {
    this.gameManager.goToLevel(this.gameManager.getActiveExit().destinationLevelKey)
    this.music.pause()
    this.scene.remove(this.key)
  }

  getActiveMenuForPlayer (player) {
    return this.menus[player][this.menus[player].ActiveMenu]
  }
}

export default InterLevel