import EntityTypes from '../Globals/entityTypes.js'
import { getAttributesForEnemy } from '../Globals/enemyAttributes.js'
import Spawner from '../Entities/Enemies/spawner.js'
import Ogre1 from '../Entities/Enemies/ogre1.js'
import Skeleton1 from '../Entities/Enemies/skeleton1.js'
import Demon1 from '../Entities/Enemies/demon1.js'

export default class EnemyManager {
  constructor (scene, mapManager, collisionManager, gameManager) {
    this.scene = scene
    this.mapManager = mapManager
    this.collisionManager = collisionManager
    this.gameManager = gameManager
    this.characterCount = this.gameManager.getCharacterCount()
    this.enemies = []
    this.occupiedTiles = {}
    this.addEnemies()
  }

  addEnemies () {
    for (const enemySpawnPoint of this.mapManager.enemySpawnPoints) {
      const attributes = getAttributesForEnemy(enemySpawnPoint)
      const config = {}
      Object.assign(config, enemySpawnPoint)
      config.manager = this      
      config.attributes = Phaser.Utils.Objects.DeepCopy(attributes)
      config.gameManager = this.gameManager
      this.addEnemy(enemySpawnPoint.type, config)
    }

    for (const spawners of this.mapManager.spawners) {
      const config = {}
      Object.assign(config, spawners)
      config.gameManager = this.gameManager
      this.addSpawner(spawners.type, config)
    }
  }

  addEnemy (entityType, config) {
    if (config.minCharacterCount > this.characterCount) return
    const EnemyTypes = EntityTypes.Enemies

    let newEnemy = null
    config.manager = this
    switch (entityType) {
      case EnemyTypes.Ogre1:
        newEnemy = new Ogre1(this.scene, config)
        break
      case EnemyTypes.Skeleton1:
        newEnemy = new Skeleton1(this.scene, config)
        break
      case EnemyTypes.Demon1:
        newEnemy = new Demon1(this.scene, config)
        break
    }

    this.collisionManager.addEntity(newEnemy, newEnemy.attributes.radius)
    this.scene.add.existing(newEnemy)
    this.enemies.push(newEnemy)

    return newEnemy
  }

  update () {
    this.occupiedTiles = {}
    for (const enemy of this.enemies) {
      // need to account for enemies that are near the edge of a tile
      if (!this.occupiedTiles[Math.floor(enemy.x / 32)]) this.occupiedTiles[Math.floor(enemy.x / 32)] = {}
      this.occupiedTiles[Math.floor(enemy.x / 32)][Math.floor(enemy.y / 32)] = true

      if (enemy.x % 32 < 6) {
        // enemy is near the left edge of a tile, so add the left tile to the occupied tiles
        if (!this.occupiedTiles[Math.floor(enemy.x / 32) - 1]) this.occupiedTiles[Math.floor(enemy.x / 32) - 1] = {}
        this.occupiedTiles[Math.floor(enemy.x / 32) - 1][Math.floor(enemy.y / 32)] = true

        // check upper left and lower left tiles
        if (enemy.y % 32 < 6) {
          if (!this.occupiedTiles[Math.floor(enemy.x / 32) - 1][Math.floor(enemy.y / 32) - 1]) this.occupiedTiles[Math.floor(enemy.x / 32) - 1][Math.floor(enemy.y / 32) - 1] = true
        } else if (enemy.y % 32 > 26) {
          if (!this.occupiedTiles[Math.floor(enemy.x / 32) - 1][Math.floor(enemy.y / 32) + 1]) this.occupiedTiles[Math.floor(enemy.x / 32) - 1][Math.floor(enemy.y / 32) + 1] = true
        }
      } else if (this.x % 32 > 26) {
        // enemy is near the right edge of a tile, so add the right tile to the occupied tiles
        if (!this.occupiedTiles[Math.floor(enemy.x / 32) + 1]) this.occupiedTiles[Math.floor(enemy.x / 32) + 1] = {}
        this.occupiedTiles[Math.floor(enemy.x / 32) + 1][Math.floor(enemy.y / 32)] = true

        // check upper right and lower right tiles
        if (enemy.y % 32 < 6) {
          if (!this.occupiedTiles[Math.floor(enemy.x / 32) + 1][Math.floor(enemy.y / 32) - 1]) this.occupiedTiles[Math.floor(enemy.x / 32) + 1][Math.floor(enemy.y / 32) - 1] = true
        } else if (enemy.y % 32 > 26) {
          if (!this.occupiedTiles[Math.floor(enemy.x / 32) + 1][Math.floor(enemy.y / 32) + 1]) this.occupiedTiles[Math.floor(enemy.x / 32) + 1][Math.floor(enemy.y / 32) + 1] = true
        }
      }
      
      if (enemy.y % 32 < 6) {
        // enemy is near the top edge of a tile, so add the top tile to the occupied tiles
        if (!this.occupiedTiles[Math.floor(enemy.x / 32)][Math.floor(enemy.y / 32) - 1]) this.occupiedTiles[Math.floor(enemy.x / 32)][Math.floor(enemy.y / 32) - 1] = true
      } else if (enemy.y % 32 > 26) {
        // enemy is near the bottom edge of a tile, so add the bottom tile to the occupied tiles
        if (!this.occupiedTiles[Math.floor(enemy.x / 32)][Math.floor(enemy.y / 32) + 1]) this.occupiedTiles[Math.floor(enemy.x / 32)][Math.floor(enemy.y / 32) + 1] = true
      }

      if (enemy.targetPosition) {
        if (!this.occupiedTiles[Math.floor(enemy.targetPosition.x / 32)]) this.occupiedTiles[Math.floor(enemy.targetPosition.x / 32)] = {}
        this.occupiedTiles[Math.floor(enemy.targetPosition.x / 32)][Math.floor(enemy.targetPosition.y / 32)] = true
      }
    }
  }

  isLocationOccupied (x, y) {
    return this.occupiedTiles[x] ? this.occupiedTiles[x][y] : false
  }

  addSpawner (entityType, config) {
    if (config.minCharacterCount > this.characterCount) return

    config.manager = this
    const newSpawner = new Spawner(this.scene, config)

    this.collisionManager.addEntity(newSpawner, config.radius)
    this.scene.add.existing(newSpawner)
    this.enemies.push(newSpawner)

    return newSpawner
  }

  shutdown () {
    for (const enemy of this.enemies) {
      enemy.destroy()
    }
    this.enemies = []
  }
}