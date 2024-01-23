import EntityTypes from '../../Globals/entityTypes.js'
import { ArrowNames } from '../../Globals/weaponAttributes.js'
import { ArrowNormalSingleImage } from '../../Keys/imageKeys.js'
import { ArrowFireSingleImage } from '../../Keys/imageKeys.js'
import { ArrowSilverSingleImage } from '../../Keys/imageKeys.js'
import { ArrowMagicSingleImage } from '../../Keys/imageKeys.js'

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

		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
	}

	update(time, delta) {
		if (!this.scene) return
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
		this.body.setVelocity(speed * direction.x, speed * direction.y)
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