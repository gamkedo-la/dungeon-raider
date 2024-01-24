import Enemy from './enemy.js'
import { Skeleton1SpriteSheet } from '../../Globals/enemySpriteSheetLoaderData.js'
import { EnemySkeleton1Type } from '../../Globals/entityTypes.js'
import { Skeleton1Animations } from '../../Keys/enemyAnimationKeys.js'

export default class Skeleton1 extends Enemy {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet()
    config.spriteSheet = spriteSheet
    config.entityType = EnemySkeleton1Type
    super(scene, config)

    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
  }

  buildAnimations () {
    super.buildAnimations(Skeleton1Animations)
  }

  didCollideWith (otherEntity) {
    // Do something special here like check if the other entity is a character weapon and if so, take damage
    super.didCollideWith(otherEntity)
  }
}

function getSpriteSheet () {
  return Skeleton1SpriteSheet
}