import EntityTypes from '../Globals/entityTypes.js'
import FoodLarge from '../Entities/Loot/foodLarge.js'
import FoodSmall from '../Entities/Loot/foodSmall.js'
import GoldSinglePiece from '../Entities/Loot/goldSinglePiece.js'
import GoldFivePieces from '../Entities/Loot/goldFivePieces.js'

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
    switch (entityType) {
      case EntityTypes.FoodLarge:
        config.entityType = entityType
        loot = new FoodLarge(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break   
      case EntityTypes.FoodSmall:
        config.entityType = entityType
        loot = new FoodSmall(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break   
      case EntityTypes.GoldFivePieces:
        config.entityType = entityType
        loot = new GoldFivePieces(this.scene, config)
        this.collisionManager.addEntity(loot, loot.radius)
        this.scene.add.existing(loot)
        break   
      case EntityTypes.GoldSinglePiece:
        config.entityType = entityType
        loot = new GoldSinglePiece(this.scene, config)
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