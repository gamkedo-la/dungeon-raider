import SceneKeys from "../Keys/sceneKeys.js"
import Title from "./title.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"

class Options extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Options)
  }

  preload () {

  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.inputManager = new InputManager(this, this.gameManager)

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    new FontLabel(this, {
      x: this.game.canvas.width / 2,
      y: 10,
      title: 'Options',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.TitleFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    })

    new FontLabel(this, {
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2,
      title: 'Press Any Control Key (WASD or Arrows) to Return to Title Screen',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    })

    this.cameras.main.fadeIn(2000, 0,0,0);
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  processInput (event) {
    for (const eventKey in event) {
      if (event[eventKey].isDown) {
        this.scene.add(SceneKeys.Title, new Title(), true)
        this.scene.stop(this.scene.key)
      }
    }
  }
}

export default Options