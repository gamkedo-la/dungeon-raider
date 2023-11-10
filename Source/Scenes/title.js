import { TitleKey, CharacterCreateKey } from "../Keys/sceneKeys.js"
import InputEventKeys from "../Keys/inputEventKeys.js"

class Title extends Phaser.Scene {
  constructor () {
    super(TitleKey)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
      console.log('Gamepad connected:', pad)
    })
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.inputManager = new InputManager(this, this.gameManager)

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    //TODO: Build the Menu, including:
    // 1. Title
    // 2. Menu Options (1 Player Game, 2 Player Game, 3 Player Game, 4 Player Game, Credits)
    // 3. Some sort of audio & visual markers to indicate which option will be selected when Enter/Return/X is pressed
  }

  update (time, delta) {

  }

  processInput (event) {
    // TODO: Process inputs (moving up/down on the menu, selecting an option, etc.)
    // TODO: Register with the Game Manager (this.gameManager.setPlayerCount()) how many players are playing
    // TODO: On selecting a 1-4 player game, transition to the Character Select scene
    this.scene.start(CharacterCreateKey)
    this.scene.remove(TitleKey)
  }
}

export default Title