import EntityTypes from '../../Globals/entityTypes.js'
import { DrawbridgeSpriteSheet } from '../../Globals/animatedObjectSpriteSheetLoaderData.js'
import { drawbridgeAnimations } from '../../Keys/animatedObjectsAnimationKeys.js'

export default class Drawbridge extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    super(scene, config.x, config.y, DrawbridgeSpriteSheet, config.status === 'open' ? 0 : 7)

    this.scene = scene
    this.config = config
    this.id = config.id
    this.entityType = EntityTypes.Drawbridge
    this.gameManager = config.gameManager
    this.name = config.name
    this.status = config.status
    this.scene.add.existing(this)

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)
    this.animations = {}
    this.buildAnimations()
  }

  buildAnimations () {
    const animationsProps = drawbridgeAnimations
    for (const animationProps in animationsProps) {
      this.animations[animationProps] = this.scene.anims.get(`${animationsProps[animationProps].key}`)
    }
  }

  animationComplete (animation) {
    if (animation.key === this.animations.open.key) {
      this.status = 'open'
      if (this.config.status === 'closed') {
        this.scene.time.delayedCall(this.config.delayTime || 1000, () => {
          this.anims.play(this.animations.close.key)
        })
        this.status = 'closing'
      }
    } else if (animation.key === this.animations.close.key) {
      this.status = 'closed'
      if (this.config.status === 'open') {
        this.scene.time.delayedCall(this.config.delayTime || 1000, () => {
          this.anims.play(this.animations.open.key)
        })
        this.status = 'opening'
      }
    }
  }

  triggered (otherEntity) {
    if (this.status === this.config.status) {
      if (this.status === 'open') {
        this.scene.time.delayedCall(this.config.delayTime || 1000, () => {
          this.anims.play(this.animations.close.key)
        })
        this.status = 'closing'
      } else if (this.status === 'closed') {
        this.scene.time.delayedCall(this.config.delayTime || 1000, () => {
          this.anims.play(this.animations.open.key)
        })
        this.status = 'opening'
      }
    }

    return this.status !== 'open'
  }

  didCollideWith (otherEntity) {
    if (this.status === this.config.status) {
      if (this.status === 'open') {
        this.anims.play(this.animations.close.key)
        this.status = 'closing'
      } else if (this.status === 'closed') {
        this.anims.play(this.animations.open.key)
        this.status = 'opening'
      }
    }
  }
}