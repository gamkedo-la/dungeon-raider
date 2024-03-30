import SceneKeys from '../Keys/sceneKeys.js'
import Title from "./title.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import { CreditsFileKey } from "../Keys/fileKeys.js"
import AudioKeys, { AlertSound } from "../Keys/audioKeys.js"

class Credits extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Credits)

    this.creditsData = null
    this.fontLabels = []
    this.shouldScroll = false
    this.scrollSpeed = 0.5
    this.alertSound = null
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

    this.alertSound = this.sound.add(AlertSound, { loop: AudioKeys[AlertSound].loop, volume: AudioKeys[AlertSound].volume })

    this.buildCredits()

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
      y: this.game.canvas.height / 4,
      title: 'Press Enter (Return), Primary or Secondary action button to Return to Title Screen',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    }))

    this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, this.fadeInComplete, this)
    this.cameras.main.fadeIn(2000, 0, 0, 0)
  }

  buildCredits () {
    const colors = [UIAttributes.Player1Color, UIAttributes.Player2Color, UIAttributes.Player3Color, UIAttributes.Player4Color]
    let y = this.game.canvas.height / 2
    this.creditsData.forEach((credit, index) => {
      this.fontLabels.push(new FontLabel(this, {
        x: this.game.canvas.width / 2,
        y: y,
        title: credit.Contributor,
        fontFamily: UIAttributes.UIFontFamily,
        fontSize: UIAttributes.TitleFontSize,
        color: colors[index % colors.length],
        align: UIAttributes.CenterAlign
      }))
      y += 50
      credit.Contributions.forEach(contribution => {
        this.fontLabels.push(new FontLabel(this, {
          x: this.game.canvas.width / 2,
          y: y,
          title: contribution,
          fontFamily: UIAttributes.UIFontFamily,
          fontSize: UIAttributes.UIFontSize,
          color: UIAttributes.UIColor,
          align: UIAttributes.CenterAlign
        }))
        y += 20
      })
      y += 30
    })

    this.fontLabels.push(new FontLabel(this, {
      x: this.game.canvas.width / 2,
      y: y + this.game.canvas.height / 4,
      title: 'Press Enter (Return), Primary or Secondary action button to Return to Title Screen',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    }))
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
        // this.alertSound.play()
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