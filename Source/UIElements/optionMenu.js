import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import { GoldPieceImage } from "../Keys/imageKeys.js"
import AudioKeys, { AlertSound, MenuChanged } from "../Keys/audioKeys.js"

export default class OptionMenu {
	constructor(scene, config) {
		this.scene = scene
		this.game = scene.game
		this.inputManager = config.inputManager
		for (const inputEvent in InputEventKeys) {
			this.inputManager.registerForEvent(inputEvent, this.processInput, this)
		}

		this.selections = config.selections
		this.firstOption = Object.values(config.selections)[0]
		this.lastOption = Object.values(config.selections)[Object.values(config.selections).length - 1]
		this.onSelectCallback = config.onSelectCallback

		this.menuSelectionCoolingDown = false
		this.menuTop = config.top || 100 + (this.game.canvas.height / 2) - 2 * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize)
		this.activeMarker = null
		this.activeSelection = config.selected
		this.markerPositions = [{ x: 0, y: 0 }]
	}

	processInput(event) {
		if (event.up?.isDown) {
			if (this.menuSelectionCoolingDown) return

			this.scene.sound.play(MenuChanged, { loop: AudioKeys[MenuChanged].loop, volume: AudioKeys[MenuChanged].volume })

			this.activeSelection--
			if (this.activeSelection < this.firstOption) {
				this.activeSelection = this.lastOption
			}
			this.activeMarker.x = this.markerPositions[this.activeSelection].x - ((this.activeMarker.scaleX * (this.activeMarker.width / 2)) + 10)
			this.activeMarker.y = this.markerPositions[this.activeSelection].y
			this.menuSelectionCoolingDown = true
			this.scene.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
				this.menuSelectionCoolingDown = false
			})
		}

		if (event.down?.isDown) {
			if (this.menuSelectionCoolingDown) return

			this.scene.sound.play(MenuChanged, { loop: AudioKeys[MenuChanged].loop, volume: AudioKeys[MenuChanged].volume })

			this.activeSelection++
			if (this.activeSelection > this.lastOption) {
				this.activeSelection = this.firstOption
			}
			this.activeMarker.x = this.markerPositions[this.activeSelection].x - ((this.activeMarker.scaleX * (this.activeMarker.width / 2)) + 10)
			this.activeMarker.y = this.markerPositions[this.activeSelection].y
			this.menuSelectionCoolingDown = true
			this.scene.time.delayedCall(UIAttributes.MenuSelectionCooldown, () => {
				this.menuSelectionCoolingDown = false
			})
		}

		if (event.primary?.isDown || event.secondary?.isDown || event.select1?.isDown || event.select2?.isDown) {
			this.scene.sound.play(AlertSound, { loop: AudioKeys[AlertSound].loop, volume: AudioKeys[AlertSound].volume })
			this.onSelectCallback(this.activeSelection)
		}
	}

	buildMenuOption(optionName, optionNumber, color = UIAttributes.UIColor, active = false) {
		const label = new FontLabel(this.scene, {
			x: (this.game.canvas.width / 2),
			y: this.menuTop + (optionNumber - 1) * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize),
			title: optionName,
			align: UIAttributes.CenterAlign,
			fontFamily: UIAttributes.UIFontFamily,
			fontSize: UIAttributes.TitleFontSize,
			color,
			activeCallback: () => {
				if (active) {
					this.activeMarker = this.scene.add.image(
						(this.game.canvas.width / 2) - label.width / 2,
						this.menuTop + (optionNumber - 0.5) * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize),
						GoldPieceImage
					)

					const scale = 2.0
					this.activeMarker.setScale(scale)
					this.activeMarker.x -= ((scale * (this.activeMarker.width / 2)) + 10) // 10 is the padding between the marker and the text
				}

				this.markerPositions.push({
					x: (this.game.canvas.width / 2) - label.width / 2,
					y: this.menuTop + (optionNumber - 0.5) * UIAttributes.getFontSizeNumber(UIAttributes.TitleFontSize)
				})
			}
		})
	}
}