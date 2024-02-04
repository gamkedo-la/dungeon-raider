import { CharacterClasses } from '../Globals/characterAttributes.js'
import EntityTypes from '../Globals/entityTypes.js'
import ArmorChainMail from '../Entities/Loot/armorChainMail.js'
// import ArmorHalfPlateMail from '../Entities/Loot/armorHalfPlateMail.js'
import ArmorHelmet from '../Entities/Loot/armorHelmet.js'
import ArmorLeather from '../Entities/Loot/armorLeather.js'
// import ArmorPlateMail from '../Entities/Loot/armorPlateMail.js'
import ArmorRingMail from '../Entities/Loot/armorRingMail.js'
import ArmorShield from '../Entities/Loot/armorShield.js'
import ArrowFireSingle from '../Entities/Loot/arrowFireSingle.js'
import ArrowFireMultiple from '../Entities/Loot/arrowFireMultiple.js'
import ArrowMagicSingle from '../Entities/Loot/arrowMagicSingle.js'
import ArrowMagicMultiple from '../Entities/Loot/arrowMagicMultiple.js'
import ArrowNormalSingle from '../Entities/Loot/arrowNormalSingle.js'
import ArrowNormalMultiple from '../Entities/Loot/arrowNormalMultiple.js'
import ArrowSilverSingle from '../Entities/Loot/arrowSilverSingle.js'
import ArrowSilverMultiple from '../Entities/Loot/arrowSilverMultiple.js'
import Axe from '../Entities/Loot/axe.js'
import BattleAxe from '../Entities/Loot/battleAxe.js'
import FlangedMace from '../Entities/Loot/flangedMace.js'
import FoodLarge from '../Entities/Loot/foodLarge.js'
import FoodSmall from '../Entities/Loot/foodSmall.js'
import GoldPile from '../Entities/Loot/goldPile.js'
import GoldPiece from '../Entities/Loot/goldPiece.js'
import Hammer from '../Entities/Loot/hammer.js'
import HammerMagic from '../Entities/Loot/hammerMagic.js'
import Key from '../Entities/Loot/key.js'
import LongBow from '../Entities/Loot/longBow.js'
import LongSword from '../Entities/Loot/longSword.js'
import Mace from '../Entities/Loot/mace.js'
import ShortBow from '../Entities/Loot/shortBow.js'
import ShortSword from '../Entities/Loot/shortSword.js'
import WarHammer from '../Entities/Loot/warHammer.js'
import WarHammerMagic from '../Entities/Loot/warHammerMagic.js'

let LootTypes = null

export default class LootManager {
  constructor (scene, mapManager, collisionManager, gameManager) {
    this.scene = scene
    this.mapManager = mapManager
    this.collisionManager = collisionManager
    this.gameManager = gameManager
    LootTypes = EntityTypes.Loot
    this.loot = []
    this.characterCount = this.gameManager.getCharacterCount()
    this.addInitialLoot()
  }

  addInitialLoot () {
    for (const loot of this.mapManager.loot) {
      if (loot.minPlayerCount && loot.minPlayerCount > this.characterCount) continue

      const config = {}
      Object.assign(config, loot)
      this.addLoot(loot.type, config)
    }
  }

  addLoot (entityType, config) {
    let loot = null
    const LootTypes = EntityTypes.Loot
    config.entityType = entityType
    const lootClass = this.getLootClassForType(entityType)
    if (lootClass) {
      loot = new lootClass(this.scene, config)
    }

    this.collisionManager.addEntity(loot, loot.radius)
    this.scene.add.existing(loot)
  }

  getLootClassForType (lootType) {
    switch (lootType) {
      case LootTypes.ArrowFireSingle: return ArrowFireSingle
      case LootTypes.ArrowFireMultiple: return ArrowFireMultiple
      case LootTypes.ArrowMagicSingle: return ArrowMagicSingle
      case LootTypes.ArrowMagicMultiple: return ArrowMagicMultiple
      case LootTypes.ArrowNormalSingle: return ArrowNormalSingle
      case LootTypes.ArrowNormalMultiple: return ArrowNormalMultiple
      case LootTypes.ArrowSilverSingle: return ArrowSilverSingle
      case LootTypes.ArrowSilverMultiple: return ArrowSilverMultiple
      case LootTypes.Axe: return Axe
      case LootTypes.BattleAxe: return BattleAxe
      case LootTypes.ChainMail: return ArmorChainMail
      case LootTypes.FlangedMace: return FlangedMace
      case LootTypes.FoodLarge: return FoodLarge
      case LootTypes.FoodSmall: return FoodSmall
      case LootTypes.GoldPile: return GoldPile
      case LootTypes.GoldPiece: return GoldPiece
      // case LootTypes.HalfPlateMail: return ArmorHalfPlateMail
      case LootTypes.Hammer: return Hammer
      case LootTypes.HammerMagic: return HammerMagic
      case LootTypes.Helmet: return ArmorHelmet
      case LootTypes.Key: return Key
      case LootTypes.LeatherArmor: return ArmorLeather
      case LootTypes.LongBow: return LongBow
      case LootTypes.LongSword: return LongSword
      case LootTypes.Mace: return Mace
      // case LootTypes.PlateMail: return ArmorPlateMail
      case LootTypes.RingMail: return ArmorRingMail
      case LootTypes.Shield: return ArmorShield
      case LootTypes.ShortBow: return ShortBow
      case LootTypes.ShortSword: return ShortSword
      case LootTypes.WarHammer: return WarHammer
      case LootTypes.WarHammerMagic: return WarHammerMagic
      // case LootTypes.Staff: return Staff
      // case LootTypes.Dagger: return Dagger
      // case LootTypes.ChainMail: return ChainMail
      // case LootTypes.LeatherArmor: return LeatherArmor
      // case LootTypes.RingMail: return RingMail
      // case LootTypes.PlateMail: return PlateMail
      // case LootTypes.HalfPlateMail: return HalfPlateMail
      // case LootTypes.Helmet: return Helmet
      // case LootTypes.Shield: return Shield
      default:
        console.warn(`Unknown loot type: ${lootType}`)
        break
    }
  }

  canPickUp (loot, characterClass) {
    switch (characterClass) {
      case CharacterClasses.Archer:
        return archerCanPickUp(loot)
      case CharacterClasses.Cleric:
        return clericCanPickUp(loot)
      case CharacterClasses.Warrior:
        return warriorCanPickUp(loot)
      case CharacterClasses.Magi:
        return magiCanPickUp(loot)
    }
  }

  shutdown () {
    for (const loot of this.loot) {
      loot.destroy()
    }
    this.loot = []
  }
}

function archerCanPickUp (loot) {
  switch (loot.entityType) {
    case LootTypes.ArrowFireSingle:
    case LootTypes.ArrowFireMultiple:
    case LootTypes.ArrowMagicSingle:
    case LootTypes.ArrowMagicMultiple:
    case LootTypes.ArrowNormalSingle:
    case LootTypes.ArrowNormalMultiple:
    case LootTypes.ArrowSilverSingle:
    case LootTypes.ArrowSilverMultiple:
    case LootTypes.FoodLarge:
    case LootTypes.FoodSmall:
    case LootTypes.GoldPiece:
    case LootTypes.GoldPile:
    case LootTypes.Key:
    case LootTypes.LeatherArmor:
    case LootTypes.LongBow:
    case LootTypes.ShortBow:
    case LootTypes.Character: // Any character can pick up a character's body
      return true
    default:
      return false
  }
}

function warriorCanPickUp (loot) {
  switch (loot.entityType) {
    case LootTypes.Axe:
    case LootTypes.BattleAxe:
    case LootTypes.ChainMail:
    case LootTypes.FlangedMace:
    case LootTypes.FoodLarge:
    case LootTypes.FoodSmall:
    case LootTypes.GoldPiece:
    case LootTypes.GoldPile:
    case LootTypes.HalfPlateMail:
    case LootTypes.Hammer:
    case LootTypes.HammerMagic:
    case LootTypes.Helmet:
    case LootTypes.Key:
    case LootTypes.LeatherArmor:
    case LootTypes.LongSword:
    case LootTypes.Mace:
    case LootTypes.PlateMail:
    case LootTypes.RingMail:
    case LootTypes.Shield:
    case LootTypes.ShortSword:
    case LootTypes.WarHammer:
    case LootTypes.WarHammerMagic:
    case LootTypes.Dagger:
    case LootTypes.Staff:
    case LootTypes.Shield:
    case LootTypes.Character: // Any character can pick up a character's body
      return true
    default:
      return false
  }
}

function magiCanPickUp (loot) {
  switch (loot.entityType) {
    case LootTypes.Dagger:
    case LootTypes.FoodLarge:
    case LootTypes.FoodSmall:
    case LootTypes.GoldPiece:
    case LootTypes.GoldPile:
    case LootTypes.Key:
    case LootTypes.Staff:
    case LootTypes.Wand:
    case LootTypes.Character: // Any character can pick up a character's body
      return true
    default:
      return false
  }
}

function clericCanPickUp (loot) {
  switch (loot.entityType) {
    case LootTypes.ChainMail:
    case LootTypes.FlangedMace:
    case LootTypes.FoodLarge:
    case LootTypes.FoodSmall:
    case LootTypes.GoldPiece:
    case LootTypes.GoldPile:
    case LootTypes.HalfPlateMail:
    case LootTypes.Hammer:
    case LootTypes.HammerMagic:
    case LootTypes.Helmet:
    case LootTypes.Key:
    case LootTypes.LeatherArmor:
    case LootTypes.Mace:
    case LootTypes.PlateMail:
    case LootTypes.RingMail:
    case LootTypes.Shield:
    case LootTypes.Staff:
    case LootTypes.Wand:
    case LootTypes.WarHammer:
    case LootTypes.WarHammerMagic:
    case LootTypes.Character: // Any character can pick up a character's body
      return true
    default:
      return false
  }
}