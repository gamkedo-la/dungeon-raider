import FontLabel from "./fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import InputEventKeys from "../Keys/inputEventKeys.js"

export default class HorizontalMenu {
  constructor (scene, config) {
    this.config = config
    this.scene = scene
    this.inputManager = config.inputManager
    this.gameManager = config.gameManager

    this.x = config.x
    this.y = config.y
    this.title = null
    this.titleY = this.y - UIAttributes.getFontSizeNumber(UIAttributes.UIFontSize) / 2
    this.optionsY = this.y + UIAttributes.getFontSizeNumber(UIAttributes.UIFontSize) / 2
    this.options = config.options
    this.activeOption = config.initialOption
    this.optionLabels = []
    this.totalWidth = 0

    this.menuSelectionCoolingDown = false

    this.build()
  }

  build () {
    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    this.buildTitle()
    this.buildOptions()
  }

  buildTitle () {
    this.title = new FontLabel(this.scene, {
      x: this.x,
      y: this.titleY,
      title: this.config.title,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: this.config.titleColor,
      align: UIAttributes.CenterAlign,
    })
  }

  buildOptions () {
    let activeLabels = 0
    this.options.forEach((option, index) => {
      const label = new FontLabel(this.scene, {
        x: this.x,
        y: this.optionsY,
        title: option,
        fontFamily: UIAttributes.UIFontFamily,
        fontSize: UIAttributes.UIFontSize,
        color: index === this.activeOption ? this.config.activeColor : this.config.inactiveColor,
        align: UIAttributes.CenterAlign,
        activeCallback: () => {
          this.optionLabels.push(label)
          this.totalWidth += (label.width + this.config.spacing)
          activeLabels++

          if (activeLabels === this.options.length) {
            let currentLabelX = this.x - this.totalWidth / 2
            for (let i = 0; i < this.optionLabels.length; i++) {
              const labelToMove = this.optionLabels[i]
              labelToMove.setPosition(currentLabelX + label.width / 2, labelToMove.y)
              currentLabelX += labelToMove.width + this.config.spacing

              this.setAlphas(labelToMove, i)
            }
          }
        }
      })
    })
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  processInput (event) {
    const oldActiveOption = this.activeOption
    if (event.left?.isDown) {
      if (this.menuSelectionCoolingDown) return
      this.activeOption--
      if (this.activeOption < 0) {
        this.activeOption = 0
      }
      if (this.activeOption !== oldActiveOption) this.updateActiveOption()

      this.menuSelectionCoolingDown = true
      this.scene.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menuSelectionCoolingDown = false
      })
    }

    if (event.right?.isDown) {
      if (this.menuSelectionCoolingDown) return
      this.activeOption++
      if (this.activeOption >= this.options.length) {
        this.activeOption = this.options.length - 1
      }
      if (this.activeOption !== oldActiveOption) this.updateActiveOption()

      this.menuSelectionCoolingDown = true
      this.scene.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
        this.menuSelectionCoolingDown = false
      })
    }
  }

  setAlphas (label, i) {
    const partialAlpha = 0.25
    if (i < this.activeOption - 1) {
      label.setAlpha(0.0, 0.0, 0.0, 0.0)
    } else if (i === this.activeOption - 1) {
      label.setAlpha(partialAlpha, 1.0, partialAlpha, 1.0)
    } else if (i === this.activeOption + 1) {
      label.setAlpha(1.0, partialAlpha, 1.0, partialAlpha)
    } else if (i > this.activeOption + 1) {
      label.setAlpha(0.0, 0.0, 0.0, 0.0)
    } else if (i === this.activeOption) {
      label.setAlpha(1.0, 1.0, 1.0, 1.0)
    }
  }

  getAlphas (label, i) {
    const partialAlpha = 0.25
    if (i < this.activeOption - 1) {
      return [0.0, 0.0, 0.0, 0.0]
    } else if (i === this.activeOption - 1) {
      return [partialAlpha, 1.0, partialAlpha, 1.0]
    } else if (i === this.activeOption + 1) {
      return [1.0, partialAlpha, 1.0, partialAlpha]
    } else if (i > this.activeOption + 1) {
      return [0.0, 0.0, 0.0, 0.0]
    } else if (i === this.activeOption) {
      return [1.0, 1.0, 1.0, 1.0]
    }
  }

  updateActiveOption () {
    this.optionLabels.forEach(label => {
      label.updateColor(this.config.inactiveColor)
    })

    const activeLabel = this.optionLabels[this.activeOption]
    activeLabel.updateColor(this.config.activeColor)

    const activeDelta = this.x - activeLabel.x
    this.optionLabels.forEach((label, i) => {
      // label.setPosition(label.x + activeDelta, label.y)
      // this.setAlphas(label, i)
      this.playUpdateActiveTimeline(label, activeDelta, ...this.getAlphas(label, i))
    })
  }

  playUpdateActiveTimeline (optionLabel, deltaX, alphaTopLeft, alphaTopRight, alphaBottomLeft, alphaBottomRight) {
    this.scene.tweens.add({
      targets: optionLabel.text,
      x: {
        value: (target, targetKey, value, targetIndex, totalTargets, tween) => {
        return (target.x + deltaX)
        },
        ease: Phaser.Math.Easing.Sine.InOut(100),
        duration: 50,
      },
      alphaTopLeft: {
        value: alphaTopLeft,
        ease: Phaser.Math.Easing.Sine.InOut(100),
        duration: 50,
      },
      alphaTopRight: {
        value: alphaTopRight,
        ease: Phaser.Math.Easing.Sine.InOut(100),
        duration: 50,
      },
      alphaBottomLeft: {
        value: alphaBottomLeft,
        ease: Phaser.Math.Easing.Sine.InOut(100),
        duration: 50,
      },
      alphaBottomRight: {
        value: alphaBottomRight,
        ease: Phaser.Math.Easing.Sine.InOut(100),
        duration: 50,
      },
      onComplete: (tween, targets, param) => {
        optionLabel.setAlpha(alphaTopLeft, alphaTopRight, alphaBottomLeft, alphaBottomRight)
        optionLabel.setPosition(optionLabel.x + deltaX, optionLabel.y)
      }
   })
  }
}