import EntityTypes, { isCharacter, isEnemy, isLoot, isHitbox } from '../Globals/entityTypes.js'

export default class CollisionManager {
  constructor (scene, mapManager) {
    this.scene = scene
    this.mapManager = mapManager

    this.characterGroup = this.scene.physics.add.group()
    this.enemyGroup = this.scene.physics.add.group()
    this.hitboxGroup = this.scene.physics.add.group()
    this.doorGroup = this.scene.physics.add.staticGroup()
    this.exitGroup = this.scene.physics.add.staticGroup()
    this.lootGroup = this.scene.physics.add.staticGroup()
    this.groups = [this.characterGroup, this.enemyGroup, this.doorGroup, this.exitGroup, this.lootGroup]

    this.scene.physics.add.collider(this.characterGroup, this.mapManager.layers.CollisionLayer, this.characterMapCollision, this.characterMapProcess, this)
    this.scene.physics.add.collider(this.characterGroup, this.doorGroup, this.characterMapCollision, this.characterMapProcess, this)
    this.scene.physics.add.collider(this.enemyGroup, this.mapManager.layers.CollisionLayer, this.enemyMapCollision, this.enemyMapProcess, this)
    this.scene.physics.add.collider(this.enemyGroup, this.doorGroup, this.enemyMapCollision, this.enemyMapProcess, this)
    this.scene.physics.add.collider(this.hitboxGroup, this.mapManager.layers.CollisionLayer, this.hitboxMapCollision, this.hitboxMapProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.hitboxGroup, this.characterHitboxOverlap, this.characterHitboxProcess, this)
    this.scene.physics.add.overlap(this.enemyGroup, this.hitboxGroup, this.enemyHitboxOverlap, this.enemyHitboxProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.characterGroup, this.characteCharacterOverlap, this.characteCharacterProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.enemyGroup, this.characterEnemyOverlap, this.characterEnemyProcess, this)
    this.scene.physics.add.overlap(this.enemyGroup, this.enemyGroup, this.enemyEnemyOverlap, this.enemyEnemyProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.exitGroup, this.characterExitOverlap, this.characterExitProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.lootGroup, this.characterLootOverlap, this.characterLootProcess, this)
  }

  addEntity (entityToAdd, radius = null) {
    if (isLoot(entityToAdd)) {
      addLoot(this, entityToAdd, radius)
    } else if (isEnemy(entityToAdd)) {
      addEnemy(this, entityToAdd, radius)
    } else if (isCharacter(entityToAdd)) {
      addCharacter(this, entityToAdd, radius)
    } else if (isHitbox(entityToAdd)) {
			addHitbox(this, entityToAdd, radius)
		} else {
      switch (entityToAdd.entityType) {
        case EntityTypes.Door:
          this.doorGroup.add(entityToAdd)
          entityToAdd.body.setCircle(16, 0, 0)
          break
        case EntityTypes.Exit:
          this.exitGroup.add(entityToAdd)
          break
        case EntityTypes.StoreItem:
          this.lootGroup.add(entityToAdd)
          break
      }
    }
  }

  shutdown () {
    for (const group of this.groups) {
      group.clear(true, true)
    }
  }

  // Collision Process Handlers - Process handlers allow us to return tsrue if a collision should occur, or false if it should not.
  // Returning false saves processing time since the collision won't be checked.
  characterMapProcess (character, tile) {
    return true
  }

  enemyMapProcess (enemy, tile) {
    return true
  }

  hitboxMapProcess (hitbox, tile) {
    return true
  }

  characterHitboxProcess(character, hitbox) {
    return true
  }

  enemyHitboxProcess(enemy, hitbox) {
    return true
  }

  // Collision Handlers - Phaser repositions entities that are colliding so they no longer are colliding
  characterMapCollision (character, tile) {
    tile.entityType = EntityTypes.Tile
    character.didCollideWith(tile)
    if (tile.didCollideWith) tile.didCollideWith(character) // tiles may not have a didCollideWith method
  }

  enemyMapCollision (enemy, tile) {
    tile.entityType = EntityTypes.Tile
    enemy.didCollideWith(tile)
    if (tile.didCollideWith) tile.didCollideWith(enemy) // tiles may not have a didCollideWith method
  }

  hitboxMapCollision(hitbox, tile) {
    tile.entityType = EntityTypes.Tile
    hitbox.didCollideWith(tile)
  }

  // Overlap Process Handlers - These are the same as Collision Process Handlers, but for Overlap events
  characteCharacterProcess (character1, character2) {
    return true
  }

  characterEnemyProcess (character, enemy) {
    return true
  }

  enemyEnemyProcess (enemy1, enemy2) {
    return true
  }

  characterExitProcess (character, exit) {
    return true
  }

  characterLootProcess (character, loot) {
    return true
  }

  // Overlap Handlers - Phaser only notifies us that an overlap has occurred, but does not reposition entities
  characterHitboxOverlap(character, hitbox) {
    hitbox.didCollideWith(character)
  }

  enemyHitboxOverlap(enemy, hitbox) {
    hitbox.didCollideWith(enemy)
  }

  characteCharacterOverlap (character1, character2) {
    character1.x = character1.lastPosition.x
    character1.y = character1.lastPosition.y
    character2.x = character2.lastPosition.x
    character2.y = character2.lastPosition.y
    character1.didCollideWith(character2)
    character2.didCollideWith(character1)
  }

  characterEnemyOverlap (character, enemy) {
    character.x = character.lastPosition.x
    character.y = character.lastPosition.y
    character.didCollideWith(enemy)
    enemy.didCollideWith(character)
  }

  enemyEnemyOverlap (enemy1, enemy2) {
    enemy1.x = enemy1.lastPosition.x
    enemy1.y = enemy1.lastPosition.y
    enemy2.x = enemy2.lastPosition.x
    enemy2.y = enemy2.lastPosition.y
    enemy1.didCollideWith(enemy2)
    enemy2.didCollideWith(enemy1)
  }

  characterExitOverlap (character, exit) {
    character.didCollideWith(exit)
    exit.didCollideWith(character)
  }

  characterLootOverlap (character, loot) {
    character.didCollideWith(loot)
    // loot.didCollideWith(character) // loot doesn't care?
  }
}

function addCharacter (manager, entityToAdd, radius = null) {
  manager.characterGroup.add(entityToAdd)
  if (radius) entityToAdd.body.setCircle(radius, (entityToAdd.width / 2) - radius, (entityToAdd.width / 2) - radius)
}

function addLoot (manager, entityToAdd, radius = null) {
  manager.lootGroup.add(entityToAdd)
  if (radius) {
    if (entityToAdd.radius < 16) entityToAdd.body.setOffset(16 - entityToAdd.radius, 16 - entityToAdd.radius)
    entityToAdd.body.setCircle(radius, (entityToAdd.width / 2) - radius, (entityToAdd.width / 2) - radius)
  }
}

function addEnemy (manager, entityToAdd, radius = null) {
  manager.enemyGroup.add(entityToAdd)
  if (radius) entityToAdd.body.setCircle(radius, (entityToAdd.width / 2) - radius, (entityToAdd.width / 2) - radius)
}

function addHitbox(manager, entityToAdd, radius = null) {
	manager.hitboxGroup.add(entityToAdd)
  if (radius) entityToAdd.body.setCircle(radius, 0, 0)
}