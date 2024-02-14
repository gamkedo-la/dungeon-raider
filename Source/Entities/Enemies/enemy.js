import EntityTypes from '../../Globals/entityTypes.js'

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const frame = 0
    super(scene, config.x, config.y, config.spriteSheet, frame) // actual position will be set by the Level Scene

    this.id = config.id
    this.gameManager = config.gameManager
    this.scene = scene
    this.spriteSheet = config.spriteSheet
    this.entityType = config.entityType
    this.attributes = config.attributes
    this.shouldBeDead = false
    this.isDead = false
    this.animations = {}
    this.canMove = false
    this.canAttack = true
    this.depth = 8

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)

    // Register for the 'update' event
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  buildAnimations (animations) {
    for (const animsKey in animations) {
      this.animations[animsKey] = this.scene.anims.get(animations[animsKey].key)
    }
  }

  update (time, delta) {
    if (!this.scene || this.isDead) return

    if (this.shouldBeDead) {
      enemyDied(this)
      return
    }

    this.lastPosition = { x: this.x, y: this.y }
    this.pursueCharacters()
  }

  levelDidStart() {
    this.canMove = true
  }

  pursueCharacters () {
    if (!this.canMove) return
    const { closestCharacter, distance } = this.scene.getClosestCharacter(this)

    if (closestCharacter === null) {
      this.anims.play(this.animations.idle, this)
      this.body.setVelocity(0,0)
    } else if (distance <= this.attributes.range) {
      this.anims.play(this.animations.primary, this)
    } else {
      this.anims.play(this.animations.walk, this)
      this.scene.physics.moveToObject(this, closestCharacter, this.attributes.speed)
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
      this.shouldBeDead = true // temporary
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
  enemy.gameManager.destroyObject(enemy.scene.levelKey, enemy.id)
  enemy.destroy()
}