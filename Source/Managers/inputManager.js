import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import InputEventKeys from "../Keys/inputEventKeys.js"
const KeyCodes = Phaser.Input.Keyboard.KeyCodes

export default class InputManager {
  constructor (scene, gameManager) {
    this.scene = scene
    this.gameManager = gameManager
    this.debugCooldownClear = true
    this.pauseCooldownClear = true
    this.selectCooldownClear = true

    this.inputMethods = {
      [InputOptionsKeys.WASD]: this.scene.input.keyboard.addKeys({
        up: KeyCodes.W, down: KeyCodes.S, left: KeyCodes.A, right: KeyCodes.D, primary: KeyCodes.C, secondary: KeyCodes.V
      }),
      [InputOptionsKeys.Arrows]: {...this.scene.input.keyboard.createCursorKeys(), ...this.scene.input.keyboard.addKeys({ primary: KeyCodes.COMMA, secondary: KeyCodes.PERIOD })},
      [InputOptionsKeys.Gamepad1]: { up: { isDown: false }, down: { isDown: false }, left: { isDown:  false }, right: { isDown: false }, primary: { isDown: false }, secondary: { isDown: false } },
      [InputOptionsKeys.Gamepad2]: { up: { isDown: false }, down: { isDown: false }, left: { isDown:  false }, right: { isDown: false }, primary: { isDown: false }, secondary: { isDown: false } },
      [InputOptionsKeys.Gamepad3]: { up: { isDown: false }, down: { isDown: false }, left: { isDown:  false }, right: { isDown: false }, primary: { isDown: false }, secondary: { isDown: false } },
      [InputOptionsKeys.Gamepad4]: { up: { isDown: false }, down: { isDown: false }, left: { isDown:  false }, right: { isDown: false }, primary: { isDown: false }, secondary: { isDown: false } },

      // Non-game control inputs
      [InputOptionsKeys.Pause]: this.scene.input.keyboard.addKey(KeyCodes.ESC),
      [InputOptionsKeys.Debug]: this.scene.input.keyboard.addKey(KeyCodes.F1),
      [InputOptionsKeys.Select]: this.scene.input.keyboard.addKeys({ select1: KeyCodes.ENTER, select2: KeyCodes.SPACE })
    }

    this.scene.input.gamepad.on(Phaser.Input.Gamepad.Events.BUTTON_DOWN, (pad, button, value) => {
      this.gamepadDownEvent(pad, button.index, value, button)
    })
    this.scene.input.gamepad.on(Phaser.Input.Gamepad.Events.BUTTON_UP, (pad, button, value) => {
      this.gamepadUpEvent(pad, button.index, value, button)
    })

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

  unregisterForEvent (event, callback, context) {
    let success = false
    if (!event) {
      console.warn('InputManager.unregisterForEvent: event is required')
    } else if (!callback) {
      console.warn('InputManager.unregisterForEvent: callback is required')
    } else if (!context) {
      console.warn('InputManager.unregisterForEvent: context is required')
    } else if (!Object.keys(InputEventKeys).includes(event)) {
      console.warn(`InputManager.unregisterForEvent: ${event} is not a valid event`)
    } else {
      this.eventEmitter.off(event, callback, context)
      success = true
    }

    return success
  }

  gamepadDownEvent (pad, index, value, button) {
    const label = this.gameManager.getGamepadLabelForPad(pad)
    switch (index) {
      case 0:
        this.inputMethods[label].primary.isDown = true
        break
      case 2:
        this.inputMethods[label].secondary.isDown = true
        break
      case 12:
        this.inputMethods[label].up.isDown = true
        break
      case 13:
        this.inputMethods[label].down.isDown = true
        break
      case 14:
        this.inputMethods[label].left.isDown = true
        break
      case 15:
        this.inputMethods[label].right.isDown = true
        break
    }
  }

  gamepadUpEvent (pad, index, value, button) {
    const label = this.gameManager.getGamepadLabelForPad(pad)
    switch (index) {
      case 0:
        this.inputMethods[label].primary.isDown = false
        break
      case 2:
        this.inputMethods[label].secondary.isDown = false
        break
      case 12:
        this.inputMethods[label].up.isDown = false
        break
      case 13:
        this.inputMethods[label].down.isDown = false
        break
      case 14:
        this.inputMethods[label].left.isDown = false
        break
      case 15:
        this.inputMethods[label].right.isDown = false
        break
    }
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

    if (this.inputMethods[InputOptionsKeys.Gamepad1]) {
      for (const control in this.inputMethods[InputOptionsKeys.Gamepad1]) {
        if (this.inputMethods[InputOptionsKeys.Gamepad1][control].isDown) {
          this.eventEmitter.emit(InputEventKeys.onGamepad1, this.inputMethods[InputOptionsKeys.Gamepad1])
          break
        }
      }
    }

    if (this.inputMethods[InputOptionsKeys.Gamepad2]) {
      for (const control in this.inputMethods[InputOptionsKeys.Gamepad2]) {
        if (this.inputMethods[InputOptionsKeys.Gamepad2][control].isDown) {
          this.eventEmitter.emit(InputEventKeys.onGamepad2, this.inputMethods[InputOptionsKeys.Gamepad2])
          break
        }
      }
    }

    if (this.inputMethods[InputOptionsKeys.Gamepad3]) {
      for (const control in this.inputMethods[InputOptionsKeys.Gamepad3]) {
        if (this.inputMethods[InputOptionsKeys.Gamepad3][control].isDown) {
          this.eventEmitter.emit(InputEventKeys.onGamepad3, this.inputMethods[InputOptionsKeys.Gamepad3])
          break
        }
      }
    }

    if (this.inputMethods[InputOptionsKeys.Gamepad4]) {
      for (const control in this.inputMethods[InputOptionsKeys.Gamepad4]) {
        if (this.inputMethods[InputOptionsKeys.Gamepad4][control].isDown) {
          this.eventEmitter.emit(InputEventKeys.onGamepad4, this.inputMethods[InputOptionsKeys.Gamepad4])
          break
        }
      }
    }

    // Non-game control inputs
    if (this.inputMethods[InputOptionsKeys.Pause].isDown) {
      if (this.pauseCooldownClear) {
        this.eventEmitter.emit(InputEventKeys.onPause, this.inputMethods[InputOptionsKeys.Pause])
        this.pauseCooldownClear = false
        this.scene.time.delayedCall(100, () => { this.pauseCooldownClear = true }, [], this)
      }
    }

    if (this.inputMethods[InputOptionsKeys.Debug].isDown) {
      if (this.debugCooldownClear) {
        this.eventEmitter.emit(InputEventKeys.onDebug, this.inputMethods[InputOptionsKeys.Debug])
        this.debugCooldownClear = false
        this.scene.time.delayedCall(100, () => { this.debugCooldownClear = true }, [], this)
      }
    }

    if (this.inputMethods[InputOptionsKeys.Select].select1.isDown || this.inputMethods[InputOptionsKeys.Select].select2.isDown) {
      if (this.selectCooldownClear) {
        this.eventEmitter.emit(InputEventKeys.onSelect, this.inputMethods[InputOptionsKeys.Select])
        this.selectCooldownClear = false
        this.scene.time.delayedCall(100, () => { this.selectCooldownClear = true }, [], this)
      }
    }
  }
}