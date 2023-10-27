import EntityTypes from '../Keys/entityKeys.js'

export default class CollisionManager {
  constructor (scene, mapManager) {
    this.scene = scene
    this.mapManager = mapManager
  }

  addEntity (entityToAdd) {
    this.scene.physics.add.existing(entityToAdd)
    switch (entityToAdd.entityType) {
      case EntityTypes.CharacterType:
        this.scene.physics.add.collider(entityToAdd, this.mapManager.layers.CollisionLayer, this.characterMapCollision, this.characterMapProcess, this)
        break
    }
  }

  // Collision Process Handlers - Process handlers allow us to return true if a collision should occur, or false if it should not.
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

  // Overlap Handlers - Phaser only notifies us that an overlap has occurred, but does not reposition entities
}