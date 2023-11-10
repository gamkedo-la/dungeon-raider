import EntityTypes from '../Globals/entityTypes.js'
import EnemyAnimations from '../Keys/enemyAnimationKeys.js'


export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const frame = 0
    super(scene, config.x, config.y, config.spriteSheet, frame) // actual position will be set by the Level Scene

    this.scene = scene
    this.spriteSheet = config.spriteSheet
    this.entityType = config.entityType
    this.attributes = config.attributes
    this.shouldBeDead = false
    this.isDead = false
    this.animations = {}
    this.canAttack = true

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)

    // Register for the 'update
    this.scene.events.on('update', this.update, this)
  }

  buildAnimations (animations) {
    for (const animsKey in animations) {
      this.animations[animsKey] = this.scene.anims.get(animations[animsKey].key)
    }
  }

  update (time, delta) {
    if (this.isDead) return

    if (this.shouldBeDead) {
      enemyDied(this)
      return
    }
  }

  didCollideWith (otherEntity) {
    // This function will be overridden by the subclasses
    if (otherEntity.entityType === EntityTypes.Character && this.canAttack) {
      this.canAttack = false
      otherEntity.takeDamage(this.attributes.damage)
      this.scene.time.delayedCall(this.attributes.attackCooldown, () => { this.canAttack = true })
    }
  }

  takeDamage (damage, otherEntity) {
    this.attributes.health -= damage
    if (this.attributes.health <= 0) {
      this.anims.play(this.animations.death, this)
      this.scene.enemyKilledBy(this, otherEntity)
    }
  }

  animationComplete (animation, frame, gameObject) {
    if (animation.key === this.animations.death.key) {
      this.shouldBeDead = true
    }
  }
}

function enemyDied (enemy) {
  enemy.isDead = true
  enemy.destroy()
}