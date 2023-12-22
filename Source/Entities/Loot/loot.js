import EntityTypes from '../../Globals/entityTypes.js'

export default class Loot extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    super(scene, config.x, config.y, config.image)

    this.scene = scene
    this.entityType = config.entityType

    this.loot = {} // override this in subclasses
  }

  didCollideWith (otherEntity) {
    // if (!this.scene) return

    // if (otherEntity.entityType === EntityTypes.Character) {
    //   otherEntity.collectedLoot(this.characterAttribute)
    //   this.destroy()
    // }
  }
}