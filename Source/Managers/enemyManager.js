import EntityTypes from '../Globals/entityTypes.js'
import { getAttributesForEnemy } from '../Globals/enemyAttributes.js'
import Ogre1 from '../Entities/Enemies/ogre1.js'

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

    switch (entityType) {
      case EnemyTypes.Enemies.Ogre1:
        const newOgre = new Ogre1(this.scene, config)
        this.collisionManager.addEntity(newOgre, newOgre.attributes.radius)
        this.scene.add.existing(newOgre)
        this.enemies.push(newOgre)
        break
    }
  }

  shutdown () {
    for (const enemy of this.enemies) {
      enemy.destroy()
    }
    this.enemies = []
  }
}