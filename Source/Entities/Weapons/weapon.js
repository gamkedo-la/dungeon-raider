import { Arrows, isMelee, isRanged, usesArrows } from '../../Globals/weaponAttributes.js'
import Projectile from './projectile.js'
import HitArea from './hitarea.js'
import EntityTypes from '../../Globals/entityTypes.js'

export default class Weapon {
	constructor(config) {
		Object.assign(this, config)
		this.coolingDown = false
	}

	attack (user) {
		if (this.coolingDown) return

		if (isRanged(this)) {
			this.rangedAttack(user)
		} else if (isMelee(this)) {
			this.meleeAttack(user)
		}

		user.scene.time.delayedCall(this.speed, () => {
			this.coolingDown = false
		})
	}
	
	rangedAttack(user) {
		if (usesArrows(this)) {
			const scene = user.scene
			const collisionManager = user.scene.collisionManager
			const arrowData = Arrows[user.attributes.equippedArrowPrimary]

			if (user.attributes.getArrowQuantity(user.attributes) === 0) {
				return
			}

			const projectile = new Projectile(scene, {
				projectileType: arrowData.name,
				team: user.team,
				damage: arrowData.damage + this.damage + user.attributes.rangedDamage,
				range: this.range
			})
			scene.add.existing(projectile)
			collisionManager.addEntity(projectile, arrowData.radius)
			
			projectile.shoot(user.x, user.y, user.facing, arrowData.speed)
			user.attributes.useArrow(user.attributes)
		}
	}

	meleeAttack(user) {
		const scene = user.scene
		const collisionManager = user.scene.collisionManager

		const hitarea = new HitArea(scene, {
			entityType: this.entityType,
			width: this.size.x,
			height: this.size.y,
			team: user.team,
			damage: this.damage + user.attributes.meleeDamage,
			speed: this.speed
		})
		scene.add.existing(hitarea)
		collisionManager.addEntity(hitarea, this.size.x)

		const attackOffset = 32 + 4 // tile size + a small offset
		hitarea.x = user.x + user.facing.x * attackOffset
		hitarea.y = user.y + user.facing.y * attackOffset
		
    const angle = Phaser.Math.Angle.Between(0, 0, user.facing.x, user.facing.y)
    hitarea.angle = Phaser.Math.RadToDeg(angle)
	}
}