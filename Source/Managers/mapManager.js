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

    this.exits = []
    this.loot = []

    this.player1Spawns = []
    this.player2Spawns = []
    this.player3Spawns = []
    this.player4Spawns = []
    this.defaultSpawns = {
      [Player1Keys.Player]: null,
      [Player2Keys.Player]: null,
      [Player3Keys.Player]: null,
      [Player4Keys.Player]: null
    }

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

  getPlayerSpawn (player, targetingExitId = null) {
    let result = null
    switch (player) {
      case Player1Keys.Player:
        result  = this.player1Spawns.find(spawn => targetingExitId ? spawn.targetingExitId === targetingExitId : spawn.isDefault)
        if (!result) result = this.defaultSpawns[Player1Keys.Player]
        return result
      case Player2Keys.Player:
        result = this.player2Spawns.find(spawn => targetingExitId ? spawn.targetingExitId === targetingExitId : spawn.isDefault)
        if (!result) result = this.defaultSpawns[Player2Keys.Player]
        return result
      case Player3Keys.Player:
        result = this.player3Spawns.find(spawn => targetingExitId ? spawn.targetingExitId === targetingExitId : spawn.isDefault)
        if (!result) result = this.defaultSpawns[Player3Keys.Player]
        return result
      case Player4Keys.Player:
        result = this.player4Spawns.find(spawn => targetingExitId ? spawn.targetingExitId === targetingExitId : spawn.isDefault)
        if (!result) result = this.defaultSpawns[Player4Keys.Player]
        return result
      default:
        result = null
        return result
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
      object = assignPropertiesToObject(object.properties, object)
      processPlayerSpawnObject(manager, object)
      break
    case EntityTypes.Exit:
      manager.exits.push(assignPropertiesToObject(object.properties, object))
      break
    case EntityTypes.FoodLarge:
    case EntityTypes.FoodSmall:
    case EntityTypes.GoldFivePieces:
    case EntityTypes.GoldSinglePiece:
    case EntityTypes.ArrowNormalMultiple:
    case EntityTypes.ArrowNormalSingle:
    case EntityTypes.Key:
      manager.loot.push(assignPropertiesToObject(object.properties, object))
      break
    case EntityTypes.Ogre1:
      manager.enemySpawnPoints.push(assignPropertiesToObject(object.properties, object))
      break
    default:
      console.warn(`Unknown object type: ${object.type}`)
      break
  }
}

function processPlayerSpawnObject (manager, object) {
  switch (object.player) {
    case Player1Keys.Player:
      manager.player1Spawns.push(object)
      if (object.isDefault) manager.defaultSpawns[Player1Keys.Player] = object
      break
    case Player2Keys.Player:
      manager.player2Spawns.push(object)
      if (object.isDefault) manager.defaultSpawns[Player2Keys.Player] = object
      break
    case Player3Keys.Player:
      manager.player3Spawns.push(object)
      if (object.isDefault) manager.defaultSpawns[Player3Keys.Player] = object
      break
    case Player4Keys.Player:
      manager.player4Spawns.push(object)
      if (object.isDefault) manager.defaultSpawns[Player4Keys.Player] = object
      break
  }
}

function assignPropertiesToObject (properties, object) {
  const objectProperties = {}
  properties.forEach(property => {
    objectProperties[property.name] = property.value
  })
  return { ...object, ...objectProperties }
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