import EntityTypes from '../../Globals/entityTypes.js'
import { ArrowNames, getDistanceForRange } from '../../Globals/weaponAttributes.js'
import { ArrowNormalSingleImage, ArrowFireSingleImage, ArrowSilverSingleImage, ArrowMagicSingleImage } from '../../Keys/imageKeys.js'

export default class Projectile extends Phaser.GameObjects.Sprite {
	constructor(scene, config) {
		const spriteSheet = getSpritesheet(config.projectileType)
		const frame = 0
		super(scene, 0, 0, spriteSheet, frame)

		this.scene = scene
    this.entityType = EntityTypes.Hitbox
		this.team = config.team
		this.damage = config.damage
		this.projectileType = config.projectileType
		this.range = config.range
		this.distance = getDistanceForRange(this.range)

		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
	}

	update(time, delta) {
		if (!this.scene) return
		if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance) {
			this.destroy()
			return
		}
		
		this.updateFacingDirection()
	}

	updateFacingDirection() {
    const angle = Phaser.Math.Angle.Between(0, 0, this.body.velocity.x, this.body.velocity.y)
    this.angle = Phaser.Math.RadToDeg(angle)
	}

	didCollideWith(otherEntity) {
		if (otherEntity.entityType === EntityTypes.Tile) {
			this.destroy()
			return
		}

		if (this.team != otherEntity.team) {
			otherEntity.takeDamage(this.damage)
			this.destroy()
		}
	}

	shoot(x, y, direction, speed) {
		this.x = x + direction.x * 16
		this.y = y + direction.y * 16
		this.startX = this.x
		this.startY = this.y
		this.body.setVelocity(speed * direction.x, speed * direction.y)
		this.body.setCollideWorldBounds(true)
	}
}

function getSpritesheet (type) {
	switch (type) {
		case ArrowNames.NormalArrows:
			return ArrowNormalSingleImage
		case ArrowNames.FireArrows:
			return ArrowFireSingleImage
		case ArrowNames.SilverArrows:
			return ArrowSilverSingleImage
		case ArrowNames.MagicArrows:
			return ArrowMagicSingleImage
	}
}