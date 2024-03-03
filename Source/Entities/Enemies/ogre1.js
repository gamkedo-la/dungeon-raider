import Enemy from './enemy.js'
import EntityTypes from '../../Globals/entityTypes.js'
import { Ogre1SpriteSheet } from '../../Globals/enemySpriteSheetLoaderData.js'
import { EnemyOgre1Type } from '../../Globals/entityTypes.js'
import { Ogre1Animations } from '../../Keys/enemyAnimationKeys.js'

export default class Ogre1 extends Enemy {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet()
    config.spriteSheet = spriteSheet
    config.entityType = EnemyOgre1Type
    super(scene, config)

    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
  }

  buildAnimations () {
    super.buildAnimations(Ogre1Animations)
  }

  didCollideWith (otherEntity) {
    // Do something special here like check if the other entity is a character weapon and if so, take damage
    super.didCollideWith(otherEntity)
    if (otherEntity.entityType === EntityTypes.Tile && this.anims.currentAnim.key !== this.animations.idle.key && this.anims.currentAnim.key !== this.animations.death.key && this.anims.currentAnim.key !== this.animations.dead.key) {
      this.anims.play(this.animations.idle, this)
    }
  }
}

function getSpriteSheet () {
  return Ogre1SpriteSheet
}