import { getAttributesForEnemyType } from '../Globals/enemyAttributes.js'
import Ogre1 from '../Entities/ogre1.js'

export default class EnemyManager {
  constructor (scene, mapManager, collisionManager) {
    this.scene = scene
    this.mapManager = mapManager
    this.collisionManager = collisionManager
    this.enemies = []
    this.addEnemies()
  }

  addEnemies () {
    for (const enemySpawnPoint of this.mapManager.enemySpawnPoints) {
      const attributes = getAttributesForEnemyType(enemySpawnPoint.type)
      const config = {}
      Object.assign(config, enemySpawnPoint)
      config.attributes = attributes
      this.addEnemy(enemySpawnPoint.type, config)
    }
  }

  addEnemy (entityType, config) {
    switch (entityType) {
      case 'ogre1':
        const newOgre = new Ogre1(this.scene, config)
        this.collisionManager.addEntity(newOgre, newOgre.attributes.radius)
        this.scene.add.existing(newOgre)
        break
    }
  }
}