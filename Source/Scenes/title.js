import SceneKeys from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import AudioKeys, { TitleMusic } from "../Keys/audioKeys.js"
import { Races, CharacterClasses, getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/Characters/character.js"
import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import { GoldSinglePieceImage } from "../Keys/imageKeys.js"
import Debug from "../Globals/debug.js"

const selections = {
  OnePlayer: 1,
  TwoPlayer: 2,
  ThreePlayer: 3,
  FourPlayer: 4,
  Options: 5,
  Credits: 6
}

class Title extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Title)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()

    this.menuSelectionCoolingDown = false
    this.menuTop = null // can't create this until the scene is initialized => in create()
    this.activeMarker = null // can't create this until the scene is initialized => in create()
    this.activeSelection = selections.OnePlayer
    this.markerPositions = [{ x: 0, y: 0 }] // will never use position 0, but it makes the math easier
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
      this.gameManager.addGamepad(pad)
    })
    this.inputManager = new InputManager(this, this.gameManager)

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    this.menuTop = 100 + (this.game.canvas.height / 2) - 2 * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize)
    this.activeMarker = null
    this.activeSelection = selections.OnePlayer

    this.buildMenu()

    this.sound.play(TitleMusic, { loop: AudioKeys[TitleMusic].loop, volume: AudioKeys[TitleMusic].volume })

    //TODO: Build the Menu, including:
    // 1. Title
    // 2. Menu Options (1 Player Game, 2 Player Game, 3 Player Game, 4 Player Game, Credits)
    // 3. Some sort of audio & visual markers to indicate which option will be selected when Enter/Return/X is pressed
  }

  buildMenu () {
    this.buildMenuOption('1 Player Game', 1, UIAttributes.Player1Color, true)
    this.buildMenuOption('2 Player Game', 2, UIAttributes.Player2Color)
    this.buildMenuOption('3 Player Game', 3, UIAttributes.Player3Color)
    this.buildMenuOption('4 Player Game', 4, UIAttributes.Player4Color)
    this.buildMenuOption('Options', 5)
    this.buildMenuOption('Credits', 6)
  }

  buildMenuOption (optionName, optionNumber, color = UIAttributes.UIColor, active = false) {
    const label = new FontLabel(this, {
      x: (this.game.canvas.width / 2),
      y: this.menuTop + (optionNumber - 1) * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize),
      title: optionName,
      align: UIAttributes.CenterAlign,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.TitleFontSize,
      color,
      activeCallback: () => {
        if (active) {
          this.activeMarker = this.add.image(
            (this.game.canvas.width / 2) - label.width / 2,
            this.menuTop + (optionNumber - 0.5) * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize),
            GoldSinglePieceImage
          )
    
          const scale = 2.0
          this.activeMarker.setScale(scale)
          this.activeMarker.x -= ((scale * (this.activeMarker.width / 2)) + 10) // 10 is the padding between the marker and the text
        }

        this.markerPositions.push({
          x: (this.game.canvas.width / 2) - label.width / 2,
          y: this.menuTop + (optionNumber - 0.5) * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize)
        })
      }
    })
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  processInput (event) {
    // TODO: Process inputs (moving up/down on the menu, selecting an option, etc.)
    // TODO: Register with the Game Manager (this.gameManager.setPlayerCount()) how many players are playing
    // TODO: On selecting a 1-4 player game, transition to the Character Select scene
    // this.scene.start(SceneKeys.CharacterCreate)
 
    if (event.up?.isDown) {
      if (this.menuSelectionCoolingDown) return

      this.activeSelection--
      if (this.activeSelection < selections.OnePlayer) {
        this.activeSelection = selections.Credits
      }
      this.activeMarker.x = this.markerPositions[this.activeSelection].x - ((this.activeMarker.scaleX * (this.activeMarker.width / 2)) + 10)
      this.activeMarker.y = this.markerPositions[this.activeSelection].y
      this.menuSelectionCoolingDown = true
      this.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menuSelectionCoolingDown = false
      })
    }
  
    if (event.down?.isDown) {
      if (this.menuSelectionCoolingDown) return

      this.activeSelection++
      if (this.activeSelection > selections.Credits) {
        this.activeSelection = selections.OnePlayer
      }
      this.activeMarker.x = this.markerPositions[this.activeSelection].x - ((this.activeMarker.scaleX * (this.activeMarker.width / 2)) + 10)
      this.activeMarker.y = this.markerPositions[this.activeSelection].y
      this.menuSelectionCoolingDown = true
      this.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menuSelectionCoolingDown = false
      })
    } 
    
    if (event.primary?.isDown || event.secondary?.isDown || event.select1?.isDown || event.select2?.isDown) {
      if (this.activeSelection === selections.Options) {
        this.scene.start(SceneKeys.Options)
        this.scene.remove(SceneKeys.Title)
      } else if (this.activeSelection === selections.Credits) {
        this.scene.start(SceneKeys.Credits)
        this.scene.remove(SceneKeys.Title)
      } else {
        this.gameManager.setPlayerCount(this.activeSelection || selections.OnePlayer)
        this.gameManager.setCharacterCount(this.activeSelection || selections.OnePlayer)
        if (Debug.SkipCharacterCreateScene) {
          loadDebugDefaults(this, this.gameManager)
        } else {
          this.scene.start(SceneKeys.CharacterCreate)
        }
        this.scene.remove(SceneKeys.Title)
      }
    }
  }
}

function loadDebugDefaults (scene, gameManager) {
  createPlayer1Character(scene, gameManager)
  gameManager.setActivePlayer(Player1Keys.Player, Debug.Player1Input, true)        

  if (scene.activeSelection > selections.OnePlayer) {
    createPlayer2Character(scene, gameManager)
    gameManager.setActivePlayer(Player2Keys.Player, Debug.Player2Input, true)
  }

  if (scene.activeSelection > selections.TwoPlayer) {
    createPlayer3Character(scene, gameManager)
    gameManager.setActivePlayer(Player3Keys.Player, Debug.Player3Input, true)
  }

  if (scene.activeSelection > selections.ThreePlayer) {
    createPlayer4Character(scene, gameManager)
    gameManager.setActivePlayer(Player4Keys.Player, Debug.Player4Input, true)
  }

  gameManager.goToLevel(Debug.LevelToLoad)
}

function createPlayer1Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Debug.Player1Race, Debug.Player1Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player1Keys.Player,
    race: Debug.Player1Race,
    characterClass: Debug.Player1Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player1Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer2Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Debug.Player2Race, Debug.Player2Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player2Keys.Player,
    race: Debug.Player2Race,
    characterClass: Debug.Player2Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player2Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer3Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Debug.Player3Race, Debug.Player3Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player3Keys.Player,
    race: Debug.Player3Race,
    characterClass: Debug.Player3Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player3Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer4Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Debug.Player4Race, Debug.Player4Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player4Keys.Player,
    race: Debug.Player4Race,
    characterClass: Debug.Player4Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player4Keys.Player)
  }))

  newCharacter.serialize()
}

export default Title