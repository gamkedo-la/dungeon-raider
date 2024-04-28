import SceneKeys from '../Keys/sceneKeys.js'
import Title from "./title.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import AudioKeys, { GameOverMusic } from "../Keys/audioKeys.js"

class GameOver extends Phaser.Scene {
  constructor () {
    super(SceneKeys.GameOver)
  }

  preload () {

  }

  create () {
    // TODO: Build Game Over Scene including the Menu:
    // 1. Game Over Title
    // 2. Menu Options (Continue, Restart, Quit, Credits)
    // Continue -> all Characters resurrected at half stats and launch straight into last level attempted
    // Restart -> All Characters resurrected at full stats and launch into Level 1
    // Quit -> Return to Title Screen (all Characters wiped)
    // Credits -> Display Credits (also wipe all Characters)

    // TODO: Temporary until this scene has been implemented
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.inputManager = new InputManager(this, this.gameManager)

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    if (!this.sound.sounds.find(sound => sound.key === GameOverMusic)?.isPlaying) {
      this.sound.play(GameOverMusic, { loop: AudioKeys[GameOverMusic].loop, volume: AudioKeys[GameOverMusic].volume })
    }

    new FontLabel(this, {
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 3,
      title: 'Game Over',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: '64px',
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    })

    new FontLabel(this, {
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2 + 150,
      title: 'Press Any Control Key (WASD or Arrows) to Continue',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.CharacterHeaderSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    })

    this.cameras.main.fadeIn(2000, 0,0,0)
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  processInput (event) {
    for (const eventKey in event) {
      if (event[eventKey].isDown) {
        this.scene.start(SceneKeys.Title)
        this.sound.sounds.find(sound => sound.key === GameOverMusic).stop()
        this.scene.stop(this.scene.key)
      }
    }
  }
}

export default GameOver