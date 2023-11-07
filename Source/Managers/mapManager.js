import { MasterTileset } from "../Keys/imageKeys.js"
import { TileLayerKeys } from "../Keys/mapLayerKeys.js"
import EntityTypes from "../Globals/entityTypes.js"
import CollidableGIDs from "../Globals/collisionTiles.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"

export default class MapManager {
  constructor (scene, tilemapKey) {
    this.scene = scene
    this.tilemapKey = tilemapKey
    this.map = scene.make.tilemap({ key: tilemapKey })
    this.tileAnimations = extractTileAnimations(this.map)
    this.tileset = this.map.addTilesetImage(MasterTileset, MasterTileset)

    this.layers = {}
    for (const layerKey in TileLayerKeys) {
      this.layers[layerKey] = this.map.createLayer(TileLayerKeys[layerKey], this.tileset).layer.tilemapLayer
      if (TileLayerKeys[layerKey] === TileLayerKeys.CollisionLayer) this.map.setCollision(CollidableGIDs, true)
      this.layers[layerKey].animatedTiles = findAnimatedTiles(this.tileAnimations, this.layers[layerKey].layer.data)
    }

    this.player1Spawn = null
    this.player2Spawn = null
    this.player3Spawn = null
    this.player4Spawn = null

    this.enemySpawnPoints = []

    for (const objectLayer of this.map.objects) {
      for (const object of objectLayer.objects) {
        // Tiled uses Upper Left as the origin/anchor, Phaser uses Center
        object.x += object.width / 2
        object.y -= object.height / 2
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

  startTileAnimations () {
    for (const layerKey in TileLayerKeys) {
      const layer = this.layers[layerKey]
      if (layer.animatedTiles.length > 0) {
        layer.animatedTiles.forEach(tile => {
          const frame = tile.animation[tile.currentFrame]
          tile.tile.index = frame.tileid
          animateTile(this.scene, layer, tile, frame)
        })
      }
    }
  }
}

function processObject (manager, object) {
  switch (object.type) {
    case EntityTypes.Character:
      processPlayerSpawnObject(manager, object)
      break
    case EntityTypes.Ogre1:
      console.log(object)
      manager.enemySpawnPoints.push(object)
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

function extractTileAnimations (map) {
  const animatedTiles = {}
  map.tilesets.forEach(tileset => {
    const tileData = tileset.tileData
    if (tileData) {
      const animationKeys = Object.keys(tileData).filter(key => tileData[key].animation)
      animationKeys.forEach(key => {
        tileData[key].animation.forEach(frame => { frame.tileid += tileset.firstgid })
        animatedTiles[parseInt(key) + tileset.firstgid] = tileData[key].animation
      })
    }
  })

  return animatedTiles
}

function findAnimatedTiles (tileAnimations, tileData) {
  const animatedTiles = []
  tileData.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tileAnimations[tile.index]) {
        animatedTiles.push({ x, y, tile, animation: tileAnimations[tile.index], currentFrame: 0 })
      }
    })
  })
  return animatedTiles
}

function animateTile (scene, layer, tile, frame) {
  scene.time.delayedCall(frame.duration, () => {
    tile.currentFrame = (tile.currentFrame + 1) % tile.animation.length
    const nextFrame = tile.animation[tile.currentFrame]
    layer.putTileAt(nextFrame.tileid, tile.x, tile.y)
    animateTile(scene, layer, tile, nextFrame)
  })
}