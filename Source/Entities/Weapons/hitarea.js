import AudioKeys, { AttackMiss, SwordClang } from "../../Keys/audioKeys.js"

export default class HitArea extends Phaser.GameObjects.Rectangle {
	constructor(scene, config) {
		const debugColor = 0xff0000
		const debugAlpha = 0.5
		super(scene, 0, 0, config.width, config.height, debugColor, debugAlpha)

		this.scene = scene
    this.entityType = config.entityType
		this.team = config.team
		this.damage = config.damage

		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)

		this.timeout = this.scene.time.delayedCall(config.speed, () => {
			this.scene.sound.play(AttackMiss, { loop: AudioKeys[AttackMiss].loop, volume: AudioKeys[AttackMiss].volume })
			this.destroy()
		})
	}

	update(time, delta) {
		if (!this.scene) return
	}

	didCollideWith(otherEntity) {
		if (this.team != otherEntity.team) {
			console.log('Dealt ', this.damage, ' damage')
			otherEntity.takeDamage(this.damage)
			this.scene.sound.play(SwordClang, { loop: AudioKeys[SwordClang].loop, volume: AudioKeys[SwordClang].volume })
			this.timeout.remove()
			this.destroy()
		}
	}
}