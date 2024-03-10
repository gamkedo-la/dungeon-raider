import Enemy from './enemy.js'
import { Demon1SpriteSheet } from '../../Globals/enemySpriteSheetLoaderData.js'
import { EnemyDemon1Type } from '../../Globals/entityTypes.js'
import { Demon1Animations } from '../../Keys/enemyAnimationKeys.js'

export default class Demon1 extends Enemy {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet()
    config.spriteSheet = spriteSheet
    config.entityType = EnemyDemon1Type
    super(scene, config)

    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
  }

  buildAnimations () {
    super.buildAnimations(Demon1Animations)
  }
}

function getSpriteSheet () {
  return Demon1SpriteSheet
}