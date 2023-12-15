import EntityTypes from '../Globals/entityTypes.js'

export default class CollisionManager {
  constructor (scene, mapManager) {
    this.scene = scene
    this.mapManager = mapManager
    this.characterGroup = this.scene.physics.add.group()
    this.enemyGroup = this.scene.physics.add.group()
    this.exitGroup = this.scene.physics.add.group()
    this.scene.physics.add.collider(this.characterGroup, this.mapManager.layers.CollisionLayer, this.characterMapCollision, this.characterMapProcess, this)
    this.scene.physics.add.collider(this.enemyGroup, this.mapManager.layers.CollisionLayer, this.enemyMapCollision, this.enemyMapProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.characterGroup, this.characteCharacterOverlap, this.characteCharacterProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.enemyGroup, this.characterEnemyOverlap, this.characterEnemyProcess, this)
    this.scene.physics.add.overlap(this.enemyGroup, this.enemyGroup, this.enemyEnemyOverlap, this.enemyEnemyProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.exitGroup, this.characterExitOverlap, this.characterExitProcess, this)
  }

  addEntity (entityToAdd, radius = null) {
    switch (entityToAdd.entityType) {
      case EntityTypes.Character:
        this.characterGroup.add(entityToAdd)
        if (radius) entityToAdd.body.setCircle(radius, (entityToAdd.width / 2) - radius, (entityToAdd.width / 2) - radius)
        break
      case EntityTypes.Ogre1:
        this.enemyGroup.add(entityToAdd)
        if (radius) entityToAdd.body.setCircle(radius, (entityToAdd.width / 2) - radius, (entityToAdd.width / 2) - radius)
        break
      case EntityTypes.Exit:
        this.exitGroup.add(entityToAdd)
        // FIXME: should probably be a square tile shape
        console.log("adding an exit to the collision manager");
        if (radius) entityToAdd.body.setCircle(radius, (entityToAdd.width / 2) - radius, (entityToAdd.width / 2) - radius)
        break
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

  // Overlap Handlers - Phaser only notifies us that an overlap has occurred, but does not reposition entities
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
  }

  characterExitProcess (character, exit) {
    return true
  }
}