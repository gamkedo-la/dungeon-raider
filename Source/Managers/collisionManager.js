import EntityTypes from '../Keys/entityKeys.js'

export default class CollisionManager {
  constructor (scene, mapManager) {
    this.scene = scene
    this.mapManager = mapManager
    this.characterGroup = this.scene.physics.add.group()
    this.scene.physics.add.collider(this.characterGroup, this.mapManager.layers.CollisionLayer, this.characterMapCollision, this.characterMapProcess, this)
    this.scene.physics.add.overlap(this.characterGroup, this.characterGroup, this.characteCharacterOverlap, this.characteCharacterProcess, this)
  }

  addEntity (entityToAdd, radius = null) {
    this.scene.physics.add.existing(entityToAdd)
    switch (entityToAdd.entityType) {
      case EntityTypes.CharacterType:
        this.characterGroup.add(entityToAdd)
        if(radius) entityToAdd.body.setCircle(radius, (entityToAdd.width / 2) - radius, (entityToAdd.width / 2) - radius)
        break
    }
  }

  // Collision Process Handlers - Process handlers allow us to return tsrue if a collision should occur, or false if it should not.
  // Returning false saves processing time since the collision won't be checked.
  characterMapProcess (character, tile) {
    return true
  }

  // Collision Handlers - Phaser repositions entities that are colliding so they no longer are colliding
  characterMapCollision (character, tile) {
    character.didCollideWith(tile)
    if (tile.didCollideWith) tile.didCollideWith(character) // tiles may not have a didCollideWith method
  }

  // Overlap Process Handlers - These are the same as Collision Process Handlers, but for Overlap events
  characteCharacterProcess (character1, character2) {
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
}