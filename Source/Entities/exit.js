import EntityTypes from '../Globals/entityTypes.js'
import { TileSpriteSheet, TileFrames } from '../Globals/tileSpriteSheetLoaderData.js'

export default class Exit extends Phaser.GameObjects.Sprite  {
  constructor (scene, config) {
    const frame = 0
    super(scene, config.x, config.y, TileSpriteSheet, TileFrames.Exit)

    this.scene = scene
    this.spriteSheet = config.spriteSheet
    this.entityType = EntityTypes.Exit
    this.attributes = config.attributes
    this.scene.physics.add.existing(this)
    this.scene.add.existing(this)
    // this.shouldBeDead = false
    // this.isDead = false
    // this.animations = {}
    // this.canAttack = true

    // this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)

    // Register for the 'update
    // this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }
}