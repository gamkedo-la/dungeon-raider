import EntityTypes from '../Globals/entityTypes.js'
import { TileSpriteSheet, TileFrames } from '../Globals/tileSpriteSheetLoaderData.js'

export default class Exit extends Phaser.GameObjects.Sprite  {
  constructor (scene, config) {
    const frame = 0
    super(scene, config.x, config.y, TileSpriteSheet, TileFrames.Exit)

    this.scene = scene
    this.gameManager = config.gameManager
    this.spriteSheet = config.spriteSheet
    this.exitId = config.exitId
    this.name = config.name
    this.destinationLevelKey = config.destinationLevelKey
    this.entityType = EntityTypes.Exit
    this.attributes = config.attributes
    this.scene.add.existing(this)
    // this.shouldBeDead = false
    // this.isDead = false
    // this.animations = {}
    // this.canAttack = true

    // this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)

    // Register for the 'update
    // this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  didCollideWith (otherEntity) {
    if (otherEntity.entityType === EntityTypes.Character) {
      this.gameManager.setActiveExit(this)
    }
  }
}