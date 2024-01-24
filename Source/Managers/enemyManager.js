import EntityTypes from '../Globals/entityTypes.js'
import { getAttributesForEnemy } from '../Globals/enemyAttributes.js'
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
    this.addEnemies()
  }

  addEnemies () {
    for (const enemySpawnPoint of this.mapManager.enemySpawnPoints) {
      const attributes = getAttributesForEnemy(enemySpawnPoint)
      const config = {}
      Object.assign(config, enemySpawnPoint)
      config.attributes = attributes
      this.addEnemy(enemySpawnPoint.type, config)
    }
  }

  addEnemy (entityType, config) {
    if (config.minCharacterCount > this.characterCount) return
    const EnemyTypes = EntityTypes.Enemies

    let newEnemy = null
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

  }

  shutdown () {
    for (const enemy of this.enemies) {
      enemy.destroy()
    }
    this.enemies = []
  }
}