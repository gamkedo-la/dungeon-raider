import { CharacterClasses } from '../../Globals/characterAttributes.js'
import StoreItemTypes from '../../Globals/storeItemTypes.js'
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
    this.canPurchaseMultiple = getCanPurchaseMultiple(this.storeItemType)
    this.warriorCanPurchase = config.warriorCanPurchase
    this.archerCanPurchase = config.archerCanPurchase
    this.magiCanPurchase = config.magiCanPurchase
    this.clericCanPurchase = config.clericCanPurchase

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

  classCanPurchase (characterClass) {
    switch (characterClass) {
      case CharacterClasses.Warrior:
        return this.warriorCanPurchase
      case CharacterClasses.Archer:
        return this.archerCanPurchase
      case CharacterClasses.Magi:
        return this.magiCanPurchase
      case CharacterClasses.Cleric:
        return this.clericCanPurchase
      default:
        return false
    }
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

function getCanPurchaseMultiple (storeItemType) {
  switch (storeItemType) {
    // case StoreItemTypes.Potions.Health:
    // case StoreItemTypes.Potions.Mana:
    case StoreItemTypes.Weapons.ArrowFireMultiple:
    case StoreItemTypes.Weapons.ArrowFireSingle:
    case StoreItemTypes.Weapons.ArrowMagicMultiple:
    case StoreItemTypes.Weapons.ArrowMagicSingle:
    case StoreItemTypes.Weapons.ArrowNormalMultiple:
    case StoreItemTypes.Weapons.ArrowNormalSingle:
    case StoreItemTypes.Weapons.ArrowSilverMultiple:
    case StoreItemTypes.Weapons.ArrowSilverSingle:
    case StoreItemTypes.FoodLarge:
    case StoreItemTypes.FoodSmall:
    case StoreItemTypes.Key:
      return true
    default:
      return false
  }
}