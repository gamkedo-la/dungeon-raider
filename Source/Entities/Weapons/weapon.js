import { isMelee, isRanged } from '../../Globals/weaponAttributes.js'

export default class Weapon {
	constructor(config) {
		this.name = config.name
		this.range = config.range
		this.damage = config.damage
		this.speed = config.speed
	}

	attack (user) {
		console.log('Attacked with ', this.name)
	}

	// meleeAttack(user) {
	// 	const scene = user.scene
	// 	const hitbox = scene.add.rectangle(0, 0, 32, 64, 0xffffff, 0.5)
	// 	scene.physics.add.existing(hitbox)
	// 	console.log('Melee Attack')
	// }
	
	// rangedAttack(user) {
	// 	const projectile = new Projectile(user.scene, { projectileType: 'arrowNormalSingle' })
	// 	user.scene.add.existing(projectile)
	// 	projectile.x = user.x + user.facing.x * 32.0
	// 	projectile.y = user.y + user.facing.y * 32.0
	// 	console.log('Ranged Attack')
	// }
}