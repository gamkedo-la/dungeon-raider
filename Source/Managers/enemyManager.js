import EntityTypes from '../Globals/entityTypes.js'
import { getAttributesForEnemy } from '../Globals/enemyAttributes.js'
import Spawner from '../Entities/Enemies/spawner.js'
import Ogre1 from '../Entities/Enemies/ogre1.js'
import Skeleton1 from '../Entities/Enemies/skeleton1.js'

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
    }

    this.collisionManager.addEntity(newEnemy, newEnemy.attributes.radius)
    this.scene.add.existing(newEnemy)
    this.enemies.push(newEnemy)

    return newEnemy
  }

  update () {
    this.occupiedTiles = {}
    for (const enemy of this.enemies) {
      if (!this.occupiedTiles[Math.floor(enemy.x / 32)]) this.occupiedTiles[Math.floor(enemy.x / 32)] = {}
      this.occupiedTiles[Math.floor(enemy.x / 32)][Math.floor(enemy.y / 32)] = true
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