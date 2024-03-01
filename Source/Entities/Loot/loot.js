import EntityTypes from '../../Globals/entityTypes.js'
import { WeaponNames } from '../../Globals/weaponAttributes.js'
import { ArmorNames } from '../../Globals/armorAttributes.js'

export default class Loot extends Phaser.GameObjects.Sprite {
  static Loot = {}
  constructor (scene, config) {
    super(scene, config.x, config.y, config.image)

    this.scene = scene
    this.id = config.id
    this.entityType = config.entityType
    this.name = getNameForEntityType(this.entityType)

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

function getNameForEntityType (entityType) {
  const LootTypes = EntityTypes.Loot
  switch (entityType) {
    case LootTypes.ArrowFireMultiple:
    case LootTypes.ArrowFireSingle:
      return WeaponNames.FireArrow
    case LootTypes.ArrowMagicMultiple:
    case LootTypes.ArrowMagicSingle:
      return WeaponNames.MagicArrow
    case LootTypes.ArrowNormalMultiple:
    case LootTypes.ArrowNormalSingle:
      return WeaponNames.NormalArrow
    case LootTypes.ArrowSilverMultiple:
    case LootTypes.ArrowSilverSingle:
      return WeaponNames.SilverArrow
    case LootTypes.Axe:
      return WeaponNames.Axe
    case LootTypes.BattleAxe:
      return WeaponNames.BattleAxe
    case LootTypes.ChainMail:
      return ArmorNames.ChainMail
    case LootTypes.Character:
      return 'Character'
    case LootTypes.FlangedMace:
      return WeaponNames.FlangedMace
    case LootTypes.FoodLarge:
    case LootTypes.FoodSmall:
      return 'Food'
    case LootTypes.GoldPiece:
    case LootTypes.GoldPile:
      return 'Gold'
    case LootTypes.HalfPlateMail:
      return ArmorNames.HalfPlateMail
    case LootTypes.Hammer:
      return WeaponNames.Hammer
    case LootTypes.HammerMagic:
      return WeaponNames.HammerMagic
    case LootTypes.Helmet:
      return ArmorNames.Helmet
    case LootTypes.Key:
      return 'Key'
    case LootTypes.LeatherArmor:
      return ArmorNames.LeatherArmor
    case LootTypes.LongBow:
      return WeaponNames.LongBow
    case LootTypes.LongSword:
      return WeaponNames.LongSword
    case LootTypes.Mace:
      return WeaponNames.Mace
    case LootTypes.PlateMail:
      return ArmorNames.PlateMail
    case LootTypes.RingMail:
      return ArmorNames.RingMail
    case LootTypes.Shield:
      return ArmorNames.Shield
    case LootTypes.ShortBow:
      return WeaponNames.ShortBow
    case LootTypes.ShortSword:
      return WeaponNames.ShortSword
    case LootTypes.Staff:
      return WeaponNames.Staff
    case LootTypes.WarHammerMagic:
      return WeaponNames.WarHammerMagic
    case LootTypes.WarHammer:
      return WeaponNames.WarHammer
  }
}