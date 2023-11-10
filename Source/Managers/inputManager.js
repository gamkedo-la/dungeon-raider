import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import InputEventKeys from "../Keys/inputEventKeys.js"
const KeyCodes = Phaser.Input.Keyboard.KeyCodes

export default class InputManager {
  constructor (scene, gameManager) {
    this.scene = scene
    this.gameManager = gameManager
    this.debugCooldownClear = true
    this.pauseCooldownClear = true

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
    }

    this.pads = []

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

  addGamepad (pad) {
    this.pads.push(pad)
    pad.on(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_DOWN, (index, value, button) => {
      switch (index) {
        case 0:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].primary.isDown = true
          break
        case 2:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].secondary.isDown = true
          break
        case 12:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].up.isDown = true
          break
        case 13:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].down.isDown = true
          break
        case 14:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].left.isDown = true
          break
        case 15:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].right.isDown = true
          break
      }
    })

    pad.on(Phaser.Input.Gamepad.Events.GAMEPAD_BUTTON_UP, (index, value, button) => {
      switch (index) {
        case 0:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].primary.isDown = false
          break
        case 2:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].secondary.isDown = false
          break
        case 12:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].up.isDown = false
          break
        case 13:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].down.isDown = false
          break
        case 14:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].left.isDown = false
          break
        case 15:
          this.inputMethods[InputOptionsKeys[`Gamepad${pad.index + 1}`]].right.isDown = false
          break
      }
    })

    this.gameManager.setInputForNextPlayer(InputOptionsKeys[`Gamepad${this.pads.length}`])
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
    this.eventEmitter.emit(InputEventKeys.onGamepad1, this.inputMethods[InputOptionsKeys.Gamepad1])
    this.eventEmitter.emit(InputEventKeys.onGamepad2, this.inputMethods[InputOptionsKeys.Gamepad2])
    this.eventEmitter.emit(InputEventKeys.onGamepad3, this.inputMethods[InputOptionsKeys.Gamepad3])
    this.eventEmitter.emit(InputEventKeys.onGamepad4, this.inputMethods[InputOptionsKeys.Gamepad4])

    // Non-game control inputs
    if (this.inputMethods[InputOptionsKeys.Pause].isDown) {
      if (this.pauseCooldownClear) {
        this.eventEmitter.emit(InputEventKeys.onPause)
        this.pauseCooldownClear = false
        this.scene.time.delayedCall(100, () => { this.pauseCooldownClear = true }, [], this)
      }
    }

    if (this.inputMethods[InputOptionsKeys.Debug].isDown) {
      if (this.debugCooldownClear) {
        this.eventEmitter.emit(InputEventKeys.onDebug)
        this.debugCooldownClear = false
        this.scene.time.delayedCall(100, () => { this.debugCooldownClear = true }, [], this)
      }
    }
  }
}