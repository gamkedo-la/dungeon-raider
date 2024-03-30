import SceneKeys from "../Keys/sceneKeys.js"
import Title from "./title.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import OptionMenu from "../UIElements/optionMenu.js"
import AudioKeys, { AlertSound } from "../Keys/audioKeys.js"

const selections = {
  Back: 1
}

class Options extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Options)
    this.optionMenu = null
    this.alertSound = null
  }

  preload () {

  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.inputManager = new InputManager(this, this.gameManager)

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    this.alertSound = this.sound.add(AlertSound, { loop: AudioKeys[AlertSound].loop, volume: AudioKeys[AlertSound].volume })

    this.optionMenu = new OptionMenu(this, {
      gameManager: this.gameManager,
      inputManager: this.inputManager,
      selections: selections,
      selected: selections.Back,
      onSelectCallback: this.onMenuSelectOption.bind(this),
      top: this.game.canvas.height - 2 * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize)
    })

    this.optionMenu.buildMenuOption('Back', 1, UIAttributes.Player1Color, true)

    let y = this.game.canvas.height / 4

    new FontLabel(this, {
      x: this.game.canvas.width / 4,
      y: y,
      title: 'Keyboard Controls',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.TitleFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    })

    new FontLabel(this, {
      x: 3 * this.game.canvas.width / 4,
      y: y,
      title: 'Gampad Controls',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.TitleFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    })

    y += 90

    new FontLabel(this, {
      x: (this.game.canvas.width / 4) - 50,
      y: y,
      title: 'Move:',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.Player1Color,
      align: UIAttributes.RightAlign
    })

    new FontLabel(this, {
      x: (this.game.canvas.width / 4) - 50,
      y: y,
      title: ' WASD / Arrows',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.LeftAlign
    })

    new FontLabel(this, {
      x: (3 * this.game.canvas.width / 4) - 30,
      y: y,
      title: 'Move:',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.Player1Color,
      align: UIAttributes.RightAlign
    })

    new FontLabel(this, {
      x: (3 * this.game.canvas.width / 4) - 30,
      y: y,
      title: ' Left Stick',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.LeftAlign
    })

    y += 90

    new FontLabel(this, {
      x: (this.game.canvas.width / 4) - 50,
      y: y,
      title: 'Primary Action:',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.Player1Color,
      align: UIAttributes.RightAlign
    })

    new FontLabel(this, {
      x: (this.game.canvas.width / 4) - 50,
      y: y,
      title: ' C / Comma',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.LeftAlign
    })

    new FontLabel(this, {
      x: 3 * (this.game.canvas.width / 4) - 30,
      y: y,
      title: 'Primary Action:',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.Player1Color,
      align: UIAttributes.RightAlign
    })

    new FontLabel(this, {
      x: 3 * (this.game.canvas.width / 4) - 30,
      y: y,
      title: ' Bottom Button',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.LeftAlign
    })

    y += 90

    new FontLabel(this, {
      x: (this.game.canvas.width / 4) - 50,
      y: y,
      title: 'Secondary Action:',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.Player1Color,
      align: UIAttributes.RightAlign
    })

    new FontLabel(this, {
      x: (this.game.canvas.width / 4) - 50,
      y: y,
      title: ' V / Period',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.LeftAlign
    })

    new FontLabel(this, {
      x: 3 * (this.game.canvas.width / 4) - 30,
      y: y,
      title: 'Secondary Action:',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.Player1Color,
      align: UIAttributes.RightAlign
    })

    new FontLabel(this, {
      x: 3 * (this.game.canvas.width / 4) - 30,
      y: y,
      title: ' Left Button',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.LeftAlign
    })

    this.cameras.main.fadeIn(2000, 0,0,0);
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  processInput (event) {
    for (const eventKey in event) {
      if (event[eventKey].isDown) {
        this.scene.start(SceneKeys.Title)
        this.scene.stop(this.scene.key)
      }
    }
  }

  onMenuSelectOption (option) {
    // this.alertSound.play()
    this.scene.start(SceneKeys.Title)
    this.scene.stop(SceneKeys.Options)
  }
}

export default Options