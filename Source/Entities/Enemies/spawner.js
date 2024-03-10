import EntityTypes from '../../Globals/entityTypes.js'
import { SpawnerOgre1, SpawnerSkeleton1, SpawnerDemon1 } from '../../Keys/imageKeys.js'
import { Ogre1Attributes, Skeleton1Attributes, Demon1Attributes } from '../../Globals/enemyAttributes.js'

export default class Spawner extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const frame = 0
    const spriteSheet = getSpriteSheet(config.type)
    super(scene, config.x, config.y, spriteSheet, frame)

    Object.assign(this, config)
    this.entityType = config.type
    this.scene = scene
    this.lastPosition = { x: this.x, y: this.y } // Spawners don't move, but this simplifies the Collision Manager's job
    this.health = 100
    this.damage = 10
    this.damageCooldown = 1000
    this.canDealDamage = true
    this.shouldBeDead = false
    this.isDead = false
    this.depth = 8
    this.nextId = 0

    this.currentlySpawned = 0
		this.spawnLimit = config.spawnLimit || 3 // maximum number of spawned entities (set to -1 for unlimited spawns)

    // Register for the 'update' event
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  update (time, delta) {
    if (!this.scene || this.isDead) return

    if (this.shouldBeDead) {
      spawnerDestroyed(this)
      return
    }
  }

  levelDidStart () {
    this.spawnEvent = this.scene.time.addEvent({
      delay: this.spawnRate,
      callback: () => spawnEnemy(this),
      callbackScope: this,
      loop: true
    })
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

	enemyDied (enemy) {
		this.currentlySpawned -= 1
	}
}

function getSpriteSheet (entityType) {
  switch (entityType) {
    case EntityTypes.Spawners.Ogre1:
      return SpawnerOgre1
    case EntityTypes.Spawners.Skeleton1:
      return SpawnerSkeleton1
    case EntityTypes.Spawners.Demon1:
      return SpawnerDemon1
  }
}

function spawnerDestroyed (spawner) {
	spawner.spawnEvent.remove()
  spawner.isDead = true
  spawner.gameManager.destroyObject(spawner.scene.levelKey, spawner.id)
  spawner.destroy()
}

function spawnEnemy (spawner) {
	if (spawner.spawnLimit > 0 && spawner.currentlySpawned >= spawner.spawnLimit) {
		return
	}

	spawner.currentlySpawned += 1
  switch (spawner.entityType) {
    case EntityTypes.Spawners.Ogre1:
      spawnOgre1(spawner)
      break
    case EntityTypes.Spawners.Skeleton1:
      spawnSkeleton1(spawner)
      break
    case EntityTypes.Spawners.Demon1:
      spawnDemon1(spawner)
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

function spawnDemon1 (spawner) {
  const newDemon = spawner.manager.addEnemy(EntityTypes.Enemies.Demon1, {
    id: `spawner${spawner.id}demon1${spawner.nextId++}`,
    gameManager: spawner.gameManager,
    entityType: EntityTypes.Enemies.Demon1,
    x: spawner.x,
    y: spawner.y,
    attributes: Phaser.Utils.Objects.DeepCopy(Demon1Attributes),
    spawner: spawner
  })

  newDemon.levelDidStart()
}