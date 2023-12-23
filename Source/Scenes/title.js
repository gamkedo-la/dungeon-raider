import SceneKeys from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import Debug from "../Globals/debug.js"

class Title extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Title)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()

    this.menuTop = null // can't create this until the scene is initialized => in create()
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

    this.menuTop = 100 + (this.game.canvas.height / 2) - 2 * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize)

    this.buildMenu()

    //TODO: Build the Menu, including:
    // 1. Title
    // 2. Menu Options (1 Player Game, 2 Player Game, 3 Player Game, 4 Player Game, Credits)
    // 3. Some sort of audio & visual markers to indicate which option will be selected when Enter/Return/X is pressed
  }

  buildMenu () {
    this.buildMenuOption('1 Player Game', 1)
    this.buildMenuOption('2 Player Game', 2)
    this.buildMenuOption('3 Player Game', 3)
    this.buildMenuOption('4 Player Game', 4)
    this.buildMenuOption('Options', 5)
    this.buildMenuOption('Credits', 6)
  }

  buildMenuOption (optionName, optionNumber) {
    new FontLabel(this, {
      x: (this.game.canvas.width / 2),
      y: this.menuTop + (optionNumber - 1) * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize),
      title: optionName,
      align: UIAttributes.CenterAlign,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.TitleFontSize,
      color: UIAttributes.UIColor
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
    for (const eventKey in event) {
      if (event[eventKey].isDown) {
        if (Debug.SkipCharacterCreateScene) {
          this.gameManager.goToLevel(SceneKeys.Level1)
        } else {
          this.scene.start(SceneKeys.CharacterCreate)
        }
        this.scene.remove(SceneKeys.Title)
      }
    }
  }
}

export default Title