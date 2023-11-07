import EntityTypes from '../Globals/entityTypes.js'

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const frame = 0
    super(scene, config.x, config.y, config.spriteSheet, frame) // actual position will be set by the Level Scene

    this.scene = scene
    this.spriteSheet = config.spriteSheet
    this.entityType = config.entityType
    this.attributes = config.attributes
    this.canAttack = true

    // this.buildAnimations()
  }

  buildAnimations () {
    const animationsProps = CharacterAnimations[`${this.race}${this.characterClass}`]
    for (const animationProps in animationsProps) {
      this.animations[animationProps] = this.scene.anims.get(`${this.player}-${animationsProps[animationProps].key}`)
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
}