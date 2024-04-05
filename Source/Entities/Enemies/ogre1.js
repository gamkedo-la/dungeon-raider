import Enemy from './enemy.js'
import { Ogre1SpriteSheet } from '../../Globals/enemySpriteSheetLoaderData.js'
import EntityTypes, { EnemyOgre1Type } from '../../Globals/entityTypes.js'
import { Ogre1Animations } from '../../Keys/enemyAnimationKeys.js'
import { Water } from '../../Globals/collisionTiles.js'
import { OgreDied, OgreHurt, OgreSpawned } from '../../Keys/audioKeys.js'

export default class Ogre1 extends Enemy {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet()
    config.spriteSheet = spriteSheet
    config.entityType = EnemyOgre1Type
    super(scene, config)
    
    this.diedSound = OgreDied
    this.hurtSound = OgreHurt
    this.pathResetIndex = 2
    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
    this.sfx(OgreSpawned)
  }

  buildAnimations () {
    super.buildAnimations(Ogre1Animations)
  }

  didCollideWith (otherEntity) {
    // Do something special here like check if the other entity is a character weapon and if so, take damage
    super.didCollideWith(otherEntity)
    if (otherEntity.entityType === EntityTypes.Tile) {
      if (Water.includes(otherEntity.index)) return

      const thisTilePos = { x: Math.floor(this.x / 32), y: Math.floor(this.y / 32) }
      if (otherEntity.x < thisTilePos.x) {
        // hit a tile to the left, change target to be up
        this.targetPosition = this.getTilePositionInDirection('up')
      } else if (otherEntity.x > thisTilePos.x) {
        // hit a tile to the right, change target to be down
        this.targetPosition = this.getTilePositionInDirection('down')
      } else if (otherEntity.y < thisTilePos.y) {
        // hit a tile above, change target to be right
        this.targetPosition = this.getTilePositionInDirection('right')
      } else if (otherEntity.y > thisTilePos.y) {
        // hit a tile below, change target to be left
        this.targetPosition = this.getTilePositionInDirection('left')
      }
    }
  }
}

function getSpriteSheet () {
  return Ogre1SpriteSheet
}