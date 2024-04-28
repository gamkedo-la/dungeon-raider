import SceneKeys from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import OptionMenu from "../UIElements/optionMenu.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import AudioKeys, { TitleMusic, AlertSound, MenuChanged } from "../Keys/audioKeys.js"
import { Races, CharacterClasses, getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/Characters/character.js"
import UIAttributes from "../Globals/uiAttributes.js"
import Debug from "../Globals/debug.js"

const selections = {
  OnePlayer: 1,
  TwoPlayer: 2,
  ThreePlayer: 3,
  FourPlayer: 4,
  Controls: 5,
  Credits: 6
}

class Title extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Title)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()

    this.alertSound = null
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

    this.optionMenu = new OptionMenu(this, {
        gameManager: this.gameManager,
        inputManager: this.inputManager,
        selections: selections,
				selected: selections.OnePlayer,
				onSelectCallback: this.onMenuSelectOption.bind(this)
    })

    this.buildMenu()
    this.alertSound = this.sound.add(AlertSound, { loop: AudioKeys[AlertSound].loop, volume: AudioKeys[AlertSound].volume })
    this.alertSound = this.sound.add(MenuChanged, { loop: AudioKeys[MenuChanged].loop, volume: AudioKeys[MenuChanged].volume })

    if (!this.sound.sounds.find(sound => sound.key === TitleMusic)?.isPlaying) {
      this.sound.play(TitleMusic, { loop: AudioKeys[TitleMusic].loop, volume: AudioKeys[TitleMusic].volume })
    }

    this.cameras.main.fadeIn(2000, 0,0,0)

    //TODO: Build the Menu, including:
    // 1. Title
    // 2. Menu Options (1 Player Game, 2 Player Game, 3 Player Game, 4 Player Game, Credits)
    // 3. Some sort of audio & visual markers to indicate which option will be selected when Enter/Return/X is pressed
  }

  buildMenu () {
    this.optionMenu.buildMenuOption('1 Player Game', 1, UIAttributes.Player1Color, true)
    this.optionMenu.buildMenuOption('2 Player Game', 2, UIAttributes.Player2Color)
    this.optionMenu.buildMenuOption('3 Player Game', 3, UIAttributes.Player3Color)
    this.optionMenu.buildMenuOption('4 Player Game', 4, UIAttributes.Player4Color)
    this.optionMenu.buildMenuOption('Controls', 5)
    this.optionMenu.buildMenuOption('Credits', 6)
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  onMenuSelectOption (option) {
		if (option === selections.Controls) {
			this.scene.start(SceneKeys.Options)
      this.scene.stop(SceneKeys.Title)
		} else if (option === selections.Credits) {
			this.scene.start(SceneKeys.Credits)
      this.scene.stop(SceneKeys.Title)
		} else {
			this.gameManager.setPlayerCount(option || selections.OnePlayer)
			this.gameManager.setCharacterCount(option || selections.OnePlayer)
			if (Debug.SkipCharacterCreateScene) {
				loadDebugDefaults(this, this.gameManager, option)
			} else {
				this.scene.start(SceneKeys.CharacterCreate)
			}
      this.sound.sounds.find(sound => sound.key === TitleMusic).stop()
			this.scene.stop(SceneKeys.Title)
		}
  }
}

function loadDebugDefaults (scene, gameManager, selected) {
	console.log(selected)
  createPlayer1Character(scene, gameManager)
  gameManager.setActivePlayer(Player1Keys.Player, Debug.Player1Input, true)        

  if (selected > selections.OnePlayer) {
    createPlayer2Character(scene, gameManager)
    gameManager.setActivePlayer(Player2Keys.Player, Debug.Player2Input, true)
  }

  if (selected > selections.TwoPlayer) {
    createPlayer3Character(scene, gameManager)
    gameManager.setActivePlayer(Player3Keys.Player, Debug.Player3Input, true)
  }

  if (selected > selections.ThreePlayer) {
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