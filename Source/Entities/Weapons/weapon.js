import { Arrows, isMelee, isRanged, usesArrows } from '../../Globals/weaponAttributes.js'
import Projectile from './projectile.js'

export default class Weapon {
	constructor(config) {
		this.name = config.name
		this.range = config.range
		this.damage = config.damage
		this.speed = config.speed
		this.coolingDown = false
	}

	attack (user) {
		if (this.coolingDown) return

		if (isRanged(this)) {
			this.rangedAttack(user)
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

	// meleeAttack(user) {
	// 	const scene = user.scene
	// 	const hitbox = scene.add.rectangle(0, 0, 32, 64, 0xffffff, 0.5)
	// 	scene.physics.add.existing(hitbox)
	// 	console.log('Melee Attack')
	// }
}