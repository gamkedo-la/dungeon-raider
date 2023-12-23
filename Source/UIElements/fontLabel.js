import UIAttributes from "../Globals/uiAttributes.js"

export default class FontLabel {
  constructor (scene, config) {
    this.scene = scene
    this.x = config.x
    this.y = config.y
    this.title = config.title

    this.titleConfig = {
      fontFamily: config.fontFamily,
      fontSize: config.fontSize,
      color: config.color,
      align: config.align || UIAttributes.LeftAlign,
      vertAlign: config.vertAlign  || UIAttributes.TopAlign,
    }

    if (config.strokeColor) {
      this.titleConfig.stroke = config.strokeColor
      this.titleConfig.strokeThickness = config.strokeThickness
    }

    this.text = null

    this.webFont = window.WebFont.load({
      custom: {
        families: [config.fontFamily]
      },
      active: () => {
        this.text = this.scene.add.text(this.x, this.y, this.title, this.titleConfig)
        let originX = 0.0
        let originY = 0.0
        if (this.titleConfig.align === UIAttributes.CenterAlign) {
          originX = 0.5
        } else if (this.titleConfig.align === UIAttributes.RightAlign) {
          originX = 1.0
        }

        if (this.titleConfig.vertAlign === UIAttributes.MiddleAlign) {
          originY = 0.5
        } else if (this.titleConfig.vertAlign === UIAttributes.BottomAlign) {
          originY = 1.0
        }

        this.text.setOrigin(originX, originY)
      }
    })
  }

  updateTitle (newTitle) {
    if (!this.text) return
    this.text.setText(newTitle)
  }

  updateColor (newColor) {
    if (!this.text) return
    this.text.setColor(newColor)
  }
}