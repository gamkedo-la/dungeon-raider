import Enemy from './enemy.js'
import { Skeleton1SpriteSheet } from '../../Globals/enemySpriteSheetLoaderData.js'
import entityTypes, { EnemySkeleton1Type } from '../../Globals/entityTypes.js'
import { Skeleton1Animations } from '../../Keys/enemyAnimationKeys.js'
import { Acid, Lava, Water } from '../../Globals/collisionTiles.js'

export default class Skeleton1 extends Enemy {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet()
    config.spriteSheet = spriteSheet
    config.entityType = EnemySkeleton1Type
    super(scene, config)

    this.pathResetIndex = 3
    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
  }

  buildAnimations () {
    super.buildAnimations(Skeleton1Animations)
  }

  didCollideWith (otherEntity) {
    // Do something special here like check if the other entity is a character weapon and if so, take damage
    super.didCollideWith(otherEntity)
    if (otherEntity.entityType === entityTypes.Tile) {
      if (Acid.includes(otherEntity.index) || Lava.includes(otherEntity.index)) {
        this.takeDamage(2)
      } else if (this.anims.currentAnim.key !== this.animations.idle.key) {
        this.anims.play(this.animations.idle, this)
        this.body.setVelocity(0)
        this.didCollideWithWall = true
      }
    }
  }
}

function getSpriteSheet () {
  return Skeleton1SpriteSheet
}