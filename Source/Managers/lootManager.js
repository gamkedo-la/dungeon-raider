import EntityTypes from '../Globals/entityTypes.js'
import FoodLarge from '../Entities/Loot/foodLarge.js'
import FoodSmall from '../Entities/Loot/foodSmall.js'
import GoldPiece from '../Entities/Loot/goldPiece.js'
import GoldPile from '../Entities/Loot/goldPile.js'
import ArrowNormalSingle from '../Entities/Loot/arrowNormalSingle.js'
import ArrowNormalMultiple from '../Entities/Loot/arrowNormalMultiple.js'
import Key from '../Entities/Loot/key.js'

export default class LootManager {
  constructor (scene, mapManager, collisionManager, gameManager) {
    this.scene = scene
    this.mapManager = mapManager
    this.collisionManager = collisionManager
    this.gameManager = gameManager
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

  shutdown () {
    for (const loot of this.loot) {
      loot.destroy()
    }
    this.loot = []
  }
}