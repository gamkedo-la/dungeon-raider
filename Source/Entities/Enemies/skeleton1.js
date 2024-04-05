import Enemy from './enemy.js'
import { Skeleton1SpriteSheet } from '../../Globals/enemySpriteSheetLoaderData.js'
import entityTypes, { EnemySkeleton1Type } from '../../Globals/entityTypes.js'
import { Skeleton1Animations } from '../../Keys/enemyAnimationKeys.js'
import { Acid, Lava, Water } from '../../Globals/collisionTiles.js'
import { SkeletonDied, SkeletonHurt, SkeletonSpawned } from '../../Keys/audioKeys.js'

export default class Skeleton1 extends Enemy {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet()
    config.spriteSheet = spriteSheet
    config.entityType = EnemySkeleton1Type
    super(scene, config)
    this.diedSound = SkeletonDied
    this.hurtSound = SkeletonHurt
    this.diedSound = 
    this.pathResetIndex = 3
    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
    this.sfx(SkeletonSpawned)
  }

  buildAnimations () {
    super.buildAnimations(Skeleton1Animations)
  }

  didCollideWith (otherEntity) {
    // Do something special here like check if the other entity is a character weapon and if so, take damage
    super.didCollideWith(otherEntity)
    this.sfx()
    if (otherEntity.entityType === entityTypes.Tile) {
      if (Acid.includes(otherEntity.index) || Lava.includes(otherEntity.index)) {
        this.takeDamage(2)
      } else if (this.anims.currentAnim.key !== this.animations.idle.key) {
        this.anims.play(this.animations.idle, this)
        this.body.setVelocity(0)
        this.didCollideWithWall = true
        this.scene.time.delayedCall(5000, () => {
          this.didCollideWithWall = false
          this.targetPosition = null
          this.path = null
          this.currentPathIndex = 1
        })
      }
    }
  }
}

function getSpriteSheet () {
  return Skeleton1SpriteSheet
}