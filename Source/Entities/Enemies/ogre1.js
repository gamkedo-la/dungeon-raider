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
}

function getSpriteSheet () {
  return Ogre1SpriteSheet
}