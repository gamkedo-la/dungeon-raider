import { CharacterClasses } from '../Globals/characterAttributes.js'
import EntityTypes from '../Globals/entityTypes.js'
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

    switch (entityType) {
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
      case LootTypes.Axe:
        loot = new Axe(this.scene, config)
        break
      case LootTypes.BattleAxe:
        loot = new BattleAxe(this.scene, config)
        break
      case LootTypes.FlangedMace:
        loot = new FlangedMace(this.scene, config)
        break
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
      case LootTypes.Hammer:
        loot = new Hammer(this.scene, config)
        break
      case LootTypes.HammerMagic:
        loot = new HammerMagic(this.scene, config)
        break
      case LootTypes.Key:
        loot = new Key(this.scene, config)
        break
      case LootTypes.LongBow:
        loot = new LongBow(this.scene, config)
        break
      case LootTypes.LongSword:
        loot = new LongSword(this.scene, config)
        break
      case LootTypes.Mace:
        loot = new Mace(this.scene, config)
        break
      case LootTypes.ShortBow:
        loot = new ShortBow(this.scene, config)
        break
      case LootTypes.ShortSword:
        loot = new ShortSword(this.scene, config)
        break
      case LootTypes.WarHammer:
        loot = new WarHammer(this.scene, config)
        break
      case LootTypes.WarHammerMagic:
        loot = new WarHammerMagic(this.scene, config)
        break
      // case LootTypes.Staff:
      //   loot = new Staff(this.scene, config)
      //   break
      // case LootTypes.Dagger:
      //   loot = new Dagger(this.scene, config)
      //   break
      // case LootTypes.ChainMail:
      //   loot = new ChainMail(this.scene, config)
      //   break
      // case LootTypes.LeatherArmor:
      //   loot = new LeatherArmor(this.scene, config)
      //   break
      // case LootTypes.RingMail:
      //   loot = new RingMail(this.scene, config)
      //   break
      // case LootTypes.PlateMail:
      //   loot = new PlateMail(this.scene, config)
      //   break
      // case LootTypes.HalfPlateMail:
      //   loot = new HalfPlateMail(this.scene, config)
      //   break
      // case LootTypes.Helmet:
      //   loot = new Helmet(this.scene, config)
      //   break
      // case LootTypes.Shield:
      //   loot = new Shield(this.scene, config)
      //   break
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