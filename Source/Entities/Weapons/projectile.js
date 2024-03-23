import EntityTypes from '../../Globals/entityTypes.js'
import { ArrowNames, getDistanceForRange } from '../../Globals/weaponAttributes.js'
import { ArrowNormalSingleImage, ArrowFireSingleImage, ArrowSilverSingleImage, ArrowMagicSingleImage } from '../../Keys/imageKeys.js'
import AudioKeys, { ArrowHit } from "../../Keys/audioKeys.js"

export default class Projectile extends Phaser.GameObjects.Sprite {
	constructor(scene, config) {
		const spriteSheet = getSpritesheet(config.projectileType)
		const frame = 0
		super(scene, config.x, config.y, spriteSheet, frame)

		this.scene = scene
		this.depth = 10
		this.projectileType = config.projectileType
		this.entityType = getEntityType(config.projectileType)
		this.team = config.team
		this.damage = config.damage
		this.range = config.range
		this.distance = getDistanceForRange(this.range)
		this.direction = new Phaser.Math.Vector2(0.0, 0.0)

		this.dropShadow = this.scene.add.sprite(this.x, this.y, spriteSheet, frame)
		this.dropShadow.depth = this.depth - 1
		this.dropShadow.setTint(Phaser.Display.Color.GetColor(0, 0, 0))
		this.dropShadow.setAlpha(0.5)

		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
	}

	update(time, delta) {
		if (!this.scene) return
		if (Phaser.Math.Distance.Between(this.startX, this.startY, this.x, this.y) >= this.distance) {
			this.shutdown()
			return
		}

		this.dropShadow.x = this.x + 4
		this.dropShadow.y = this.y + 4
	}

	updateFacingDirection() {
		const angle = Phaser.Math.Angle.Between(0, 0, this.body.velocity.x, this.body.velocity.y)
		this.angle = Phaser.Math.RadToDeg(angle)
		this.dropShadow.angle = this.angle
	}

	didCollideWith(otherEntity) {
		if (!this.scene || this.team === otherEntity.team) return

		if (otherEntity.entityType !== EntityTypes.Tile) otherEntity.takeDamage(this.damage)

		this.scene.sound.play(ArrowHit, { loop: AudioKeys[ArrowHit].loop, volume: AudioKeys[ArrowHit].volume })
		this.shutdown()
}

	shoot(x, y, direction, speed) {
		this.direction = direction
		this.startX = this.x
		this.startY = this.y
		this.body.setVelocity(speed * direction.x, speed * direction.y)
		this.updateFacingDirection()
	}

	shutdown() {
		this.dropShadow.destroy()
		this.destroy()
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

function getEntityType (projectileType) {
	switch (projectileType) {
		case ArrowNames.NormalArrows:
			return EntityTypes.Weapons.ArrowNormalSingle
		case ArrowNames.FireArrows:
			return EntityTypes.Weapons.ArrowFireSingle
		case ArrowNames.SilverArrows:
			return EntityTypes.Weapons.ArrowSilverSingle
		case ArrowNames.MagicArrows:
			return EntityTypes.Weapons.ArrowMagicSingle
	}
}