import SceneKeys from '../Keys/sceneKeys.js'
import Title from "./title.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import { CreditsFileKey } from "../Keys/fileKeys.js"

class Credits extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Credits)

    this.creditsData = null
    this.fontLabels = []
    this.shouldScroll = false
    this.scrollSpeed = 1
  }

  preload () {
    this.load.json(CreditsFileKey, "../../Public/Credits/credits.json")
  }

  create () {
    // creditsData is an Array of Objects:
    // Each Object has a "Contributor" property with a String value (the name of the contributor)
    // Each Object also a "Contributions" property which is an Array of Strings (the contributions of the contributor)
    this.creditsData = this.cache.json.get(CreditsFileKey)

    this.gameManager = this.game.registry.get(GameManagerKey)
    this.inputManager = new InputManager(this, this.gameManager)

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    this.fontLabels.push(new FontLabel(this, {
      x: this.game.canvas.width / 2,
      y: 10,
      title: 'Credits',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.TitleFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    }))

    this.fontLabels.push(new FontLabel(this, {
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2,
      title: 'Press Any Control Key (WASD or Arrows) to Return to Title Screen',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    }))

    this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, this.fadeInComplete, this)
    this.cameras.main.fadeIn(2000, 0, 0, 0)
  }

  fadeInComplete () {
    this.shouldScroll = true
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
    if (this.shouldScroll) {
      this.scrollCredits(delta)
    }

    // TODO: Update the vertical position of the credits text so that it scrolls up the screen
    // TODO: Allow the user to accelerate, reverse, and pause the credits text
    // TODO: Allow the user to return to the Title Screen
  }

  processInput (event) {
    for (const eventKey in event) {
      if (!event[eventKey].isDown) continue

      if (eventKey === 'up') {
        this.scrollSpeed = 1
      } else if (eventKey === 'down') {
        this.scrollSpeed = -1
      } else if (eventKey === 'primary' || eventKey === 'secondary' || eventKey === 'left' || eventKey === 'right') {
        this.scrollSpeed = 0
      } else if (eventKey === 'select1' || eventKey === 'select2') {
        this.scene.start(SceneKeys.Title)
        this.scene.stop(this.scene.key)
      } else {
        this.scrollSpeed = 0.5
      }
    }
  }

  scrollCredits (delta) {
    if (this.scrollSpeed === 0) return

    this.fontLabels.forEach(label => {
      label.setPosition(label.x, label.y - (this.game.canvas.height * (delta / (this.scrollSpeed * 1000))))
    })
  }
}

export default Credits