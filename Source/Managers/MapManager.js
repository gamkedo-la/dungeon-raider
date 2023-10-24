import { MasterTileset } from "../Keys/imageKeys.js"
import { TileLayerKeys } from "../Keys/mapLayerKeys.js"
import TiledObjectTypes from "../Keys/tiledObjectKeys.js"
import CollidableGIDs from "../Globals/collisionTiles.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"

export default class MapManager {
  constructor (scene, tilemapKey) {
    this.scene = scene
    this.tilemapKey = tilemapKey
    this.map = scene.make.tilemap({ key: tilemapKey })
    this.tileset = this.map.addTilesetImage(MasterTileset, MasterTileset)

    this.layers = {}
    for (const layerKey in TileLayerKeys) {
      this.layers[layerKey] = this.map.createLayer(TileLayerKeys[layerKey], this.tileset)
    }

    this.map.setCollision(CollidableGIDs, true, false, TileLayerKeys.Collision, false)

    this.player1Spawn = null
    this.player2Spawn = null
    this.player3Spawn = null
    this.player4Spawn = null

    for (const objectLayer of this.map.objects) {
      for (const object of objectLayer.objects) {
        // Tiled uses Upper Left as the origin/anchor, Phaser uses Center
        object.x += object.width / 2
        object.y += object.height / 2
        processObject(this, object)
      }
    }
  }

  getPlayerSpawn (player) {
    switch (player) {
      case Player1Keys.Player:
        return this.player1Spawn
      case Player2Keys.Player:
        return this.player2Spawn
      case Player3Keys.Player:
        return this.player3Spawn
      case Player4Keys.Player:
        return this.player4Spawn
      default:
        return null
    }
  
  }
}

function processObject (manager, object) {
  switch (object.type) {
    case TiledObjectTypes.SpawnPoint:
      processPlayerSpawnObject(manager, object)
      break
    default:
      console.warn(`Unknown object type: ${object.type}`)
      break
  }
}

function processPlayerSpawnObject (manager, object) {
  switch (object.name) {
    case 'Player1Spawn':
      manager.player1Spawn = object
      break
    case 'Player2Spawn':
      manager.player2Spawn = object
      break
    case 'Player3Spawn':
      manager.player3Spawn = object
      break
    case 'Player4Spawn':
      manager.player4Spawn = object
      break
  }
}