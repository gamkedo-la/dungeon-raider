import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import InputEventKeys from "../Keys/inputEventKeys.js"
const KeyCodes = Phaser.Input.Keyboard.KeyCodes

export default class InputManager {
  constructor (scene, gameManager) {
    this.scene = scene
    this.gameManager = gameManager

    this.inputMethods = {
      [InputOptionsKeys.WASD]: this.scene.input.keyboard.addKeys({
        up: KeyCodes.W, down: KeyCodes.S, left: KeyCodes.A, right: KeyCodes.D, primary: KeyCodes.C, secondary: KeyCodes.V
      }),
      [InputOptionsKeys.Arrows]: {...this.scene.input.keyboard.createCursorKeys(), ...this.scene.input.keyboard.addKeys({ primary: KeyCodes.COMMA, secondary: KeyCodes.PERIOD })},
      [InputOptionsKeys.Gamepad1]: false,
      [InputOptionsKeys.Gamepad2]: false,
      [InputOptionsKeys.Gamepad3]: false,
      [InputOptionsKeys.Gamepad4]: false
    }

    this.eventEmitter = new Phaser.Events.EventEmitter()
  }

  registerForEvent (event, callback, context) {
    let success = false
    if (!event) {
      console.warn('InputManager.registerForEvent: event is required')
    } else if (!callback) {
      console.warn('InputManager.registerForEvent: callback is required')
    } else if (!context) {
      console.warn('InputManager.registerForEvent: context is required')
    } else if (!Object.keys(InputEventKeys).includes(event)) {
      console.warn(`InputManager.registerForEvent: ${event} is not a valid event`)
    } else {
      this.eventEmitter.on(event, callback, context)
      success = true
    }

    return success
  }

  update (time, delta) {
    if (this.inputMethods[InputOptionsKeys.Arrows]) {
      for (const control in this.inputMethods[InputOptionsKeys.Arrows]) {
        if (this.inputMethods[InputOptionsKeys.Arrows][control].isDown) {
          this.eventEmitter.emit(InputEventKeys.onArrows, this.inputMethods[InputOptionsKeys.Arrows])
          break
        }
      }
    }

    if (this.inputMethods[InputOptionsKeys.WASD]) {
      for (const control in this.inputMethods[InputOptionsKeys.WASD]) {
        if (this.inputMethods[InputOptionsKeys.WASD][control].isDown) {
          this.eventEmitter.emit(InputEventKeys.onWASD, this.inputMethods[InputOptionsKeys.WASD])
          break
        }
      }
    }

    // TODO: Continue on with gamepad inputs
  }
}