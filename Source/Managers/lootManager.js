import EntityTypes from '../Globals/entityTypes.js'
import FoodLarge from '../Entities/Loot/foodLarge.js'
import FoodSmall from '../Entities/Loot/foodSmall.js'
import GoldPiece from '../Entities/Loot/goldPiece.js'
import GoldPile from '../Entities/Loot/goldPile.js'
import ArrowNormalSingle from '../Entities/Loot/arrowNormalSingle.js'
import ArrowNormalMultiple from '../Entities/Loot/arrowNormalMultiple.js'
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

    switch (entityType) {
      case LootTypes.FoodLarge:
        config.entityType = entityType
        loot = new FoodLarge(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break   
      case LootTypes.FoodSmall:
        config.entityType = entityType
        loot = new FoodSmall(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break   
      case LootTypes.GoldPile:
        config.entityType = entityType
        loot = new GoldPile(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break   
      case LootTypes.GoldPiece:
        config.entityType = entityType
        loot = new GoldPiece(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break
      case LootTypes.ArrowNormalSingle:
        config.entityType = entityType
        loot = new ArrowNormalSingle(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break
      case LootTypes.ArrowNormalMultiple:
        config.entityType = entityType
        loot = new ArrowNormalMultiple(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break
      case LootTypes.Key:
        config.entityType = entityType
        loot = new Key(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
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