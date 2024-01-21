import EntityTypes from '../../Globals/entityTypes.js'
import { TileSpriteSheet, TileFrames } from '../../Globals/tileSpriteSheetLoaderData.js'

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
  }

  didCollideWith (otherEntity) {
    if (otherEntity.entityType === EntityTypes.Character) {
      this.gameManager.setActiveExit(this)
    }
  }
}