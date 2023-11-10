import Enemy from './enemy.js'
import { Ogre1SpriteSheet } from '../Globals/enemySpriteSheetLoaderData.js'
import { Ogre1Type } from '../Globals/entityTypes.js'
import { Ogre1Animations } from '../Keys/enemyAnimationKeys.js'

export default class Ogre1 extends Enemy {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet()
    config.spriteSheet = spriteSheet
    config.entityType = Ogre1Type
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
  }
}

function getSpriteSheet () {
  return Ogre1SpriteSheet
}