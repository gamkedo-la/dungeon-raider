import EntityTypes from '../../Globals/entityTypes.js'
import Ogre1 from './ogre1.js'
import Skeleton1 from './skeleton1.js'
import { SpawnerOgre1, SpawnerSkeleton1 } from '../../Keys/imageKeys.js'
import { Ogre1Attributes, Skeleton1Attributes } from '../../Globals/enemyAttributes.js'

export default class Spawner extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const frame = 0
    const spriteSheet = getSpriteSheet(config.type)
    super(scene, config.x, config.y, spriteSheet, frame)

    Object.assign(this, config)
    this.entityType = config.type
    this.scene = scene
    this.lastPosition = { x: this.x, y: this.y } // Spawners don't move, but this simplifies the Collision Manager's job
    this.damage = 10
    this.damageCooldown = 1000
    this.canDealDamage = true
    this.shouldBeDead = false
    this.isDead = false
    this.depth = 8
    this.nextId = 0

    // Register for the 'update' event
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update (time, delta) {
    if (!this.scene || this.isDead) return

    if (this.shouldBeDead) {
      enemyDied(this)
      return
    }
  }

  levelDidStart () {
    //this.scene.time.delayedCall(this.spawnRate, () => {
      //spawnEnemy(this)
    //})
    this.spawnEvent = this.scene.time.addEvent({
      delay: this.spawnRate,
      callback: () => spawnEnemy(this),
      callbackScope: this,
      loop: true
    });
  }

  didCollideWith (entity) {
    if (entity.entityType === EntityTypes.Character) {
      if (this.canDealDamage) {
        entity.takeDamage(this.damage)
        this.canDealDamage = false
        this.scene.time.delayedCall(this.damageCooldown, () => {
          this.canDealDamage = true
        })
      }
    }
  }

  takeDamage (damage, otherEntity) {
    this.health -= damage
    if (this.health <= 0) {
      this.scene.enemyKilledBy(this, otherEntity)
      this.shouldBeDead = true
    }
  }
}

function getSpriteSheet (entityType) {
  switch (entityType) {
    case EntityTypes.Spawners.Ogre1:
      return SpawnerOgre1
    case EntityTypes.Spawners.Skeleton1:
      return SpawnerSkeleton1
  }
}

function enemyDied (enemy) {
  enemy.isDead = true
  enemy.gameManager.destroyObject(enemy.scene.levelKey, enemy.id)
  enemy.destroy()
}

function spawnEnemy (spawner) {
  switch (spawner.entityType) {
    case EntityTypes.Spawners.Ogre1:
      spawnOgre1(spawner)
      break
    case EntityTypes.Spawners.Skeleton1:
      spawnSkeleton1(spawner)
      break
  }
}

function spawnOgre1 (spawner) {
  const newOgre = spawner.manager.addEnemy(EntityTypes.Enemies.Ogre1, {
    id: `spawner${spawner.id}ogre1${spawner.nextId++}`,
    gameManager: spawner.gameManager,
    entityType: EntityTypes.Enemies.Ogre1,
    x: spawner.x,
    y: spawner.y,
    attributes: Phaser.Utils.Objects.DeepCopy(Ogre1Attributes),
    spawner: spawner
  })

  newOgre.levelDidStart()
}

function spawnSkeleton1 (spawner) {
  const newSkeleton = spawner.manager.addEnemy(EntityTypes.Enemies.Skeleton1, {
    id: `spawner${spawner.id}skeleton1${spawner.nextId++}`,
    gameManager: spawner.gameManager,
    entityType: EntityTypes.Enemies.Skeleton1,
    x: spawner.x,
    y: spawner.y,
    attributes: Phaser.Utils.Objects.DeepCopy(Skeleton1Attributes),
    spawner: spawner
  })

  newSkeleton.levelDidStart()
}