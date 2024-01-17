import EntityTypes from '../Globals/entityTypes.js'
import FoodLarge from '../Entities/Loot/foodLarge.js'
import FoodSmall from '../Entities/Loot/foodSmall.js'
import GoldPiece from '../Entities/Loot/goldPiece.js'
import GoldPile from '../Entities/Loot/goldPile.js'
import ArrowFireSingle from '../Entities/Loot/arrowFireSingle.js'
import ArrowFireMultiple from '../Entities/Loot/arrowFireMultiple.js'
import ArrowMagicSingle from '../Entities/Loot/arrowMagicSingle.js'
import ArrowMagicMultiple from '../Entities/Loot/arrowMagicMultiple.js'
import ArrowNormalSingle from '../Entities/Loot/arrowNormalSingle.js'
import ArrowNormalMultiple from '../Entities/Loot/arrowNormalMultiple.js'
import ArrowSilverSingle from '../Entities/Loot/arrowSilverSingle.js'
import ArrowSilverMultiple from '../Entities/Loot/arrowSilverMultiple.js'
import ShortSword from '../Entities/Loot/shortSword.js'
import Key from '../Entities/Loot/key.js'
import { CharacterClasses } from '../Globals/characterAttributes.js'

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

    switch (entityType) {
      case LootTypes.FoodLarge:
        loot = new FoodLarge(this.scene, config)
        break   
      case LootTypes.FoodSmall:
        loot = new FoodSmall(this.scene, config)
        break   
      case LootTypes.GoldPile:
        loot = new GoldPile(this.scene, config)
        break   
      case LootTypes.GoldPiece:
        loot = new GoldPiece(this.scene, config)
        break
      case LootTypes.ArrowFireSingle:
        loot = new ArrowFireSingle(this.scene, config)
        break
      case LootTypes.ArrowFireMultiple:
        loot = new ArrowFireMultiple(this.scene, config)
        break
      case LootTypes.ArrowMagicSingle:
        loot = new ArrowMagicSingle(this.scene, config)
        break
      case LootTypes.ArrowMagicMultiple:
        loot = new ArrowMagicMultiple(this.scene, config)
        break
      case LootTypes.ArrowNormalSingle:
        loot = new ArrowNormalSingle(this.scene, config)
        break
      case LootTypes.ArrowNormalMultiple:
        loot = new ArrowNormalMultiple(this.scene, config)
        break
      case LootTypes.ArrowSilverSingle:
        loot = new ArrowSilverSingle(this.scene, config)
        break
      case LootTypes.ArrowSilverMultiple:
        loot = new ArrowSilverMultiple(this.scene, config)
        break            
      case LootTypes.Key:
        loot = new Key(this.scene, config)
        break
      case LootTypes.ShortSword:
        loot = new ShortSword(this.scene, config)
        break
    }

    this.collisionManager.addEntity(loot, loot.radius)
    this.scene.add.existing(loot)
  }

  canPickUp (loot, characterClass) {
    switch (characterClass) {
      case CharacterClasses.Archer:
        return archerCanPickUp(loot)
      case CharacterClasses.Cleric:
        return clericCanPickUp(loot)
      case CharacterClasses.Warrior:
        return fighterCanPickUp(loot)
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
    case LootTypes.LongBow:
    case LootTypes.ShortBow:
    case LootTypes.Character: // Any character can pick up a character's body
      return true
    default:
      return false
  }
}

function fighterCanPickUp (loot) {
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