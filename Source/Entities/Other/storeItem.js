import EntityTypes from '../../Globals/entityTypes.js'
import FontLabel from '../../UIElements/fontLabel.js'
import UIAttributes from '../../Globals/uiAttributes.js'

export default class StoreItem extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    super(scene, config.x, config.y - 16, config.image)

    this.scene = scene
    this.entityType = EntityTypes.StoreItem
    this.storeItemType = config.storeItemType
    this.gameManager = config.gameManager
    this.name = config.name
    this.price = config.price
    this.text = new FontLabel(this.scene, {
      x: this.x,
      y: this.y + 32,
      title: `${this.price}`,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.InGameFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign,
      vertAlign: UIAttributes.MiddleAlign
    })

    this.scene.add.existing(this)
  }

  didCollideWith (otherEntity) {
    if (otherEntity.entityType === EntityTypes.Character) {
      // TODO: Allow Player to buy this item from the store
    }
  }

  destroy () {
    this.text.destroy()
    super.destroy()
  }
}