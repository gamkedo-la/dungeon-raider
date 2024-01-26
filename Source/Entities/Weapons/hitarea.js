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

		this.scene.time.delayedCall(config.speed, () => {
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
			this.destroy()
		}
	}
}