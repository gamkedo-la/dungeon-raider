import { MasterTileset } from "../Keys/imageKeys.js"
import { TileLayerKeys } from "../Keys/mapLayerKeys.js"
import EntityTypes from "../Globals/entityTypes.js"
import CollidableGIDs from "../Globals/collisionTiles.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"

export default class MapManager {
  constructor (scene, tilemapKey, gameManager) {
    this.scene = scene
    this.tilemapKey = tilemapKey
    this.gameManager = gameManager
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
    this.doors = []
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
    this.store = {
      items: [],
      keeper: null,
      prices: setPrices(this.map.properties)
    }

    for (const objectLayer of this.map.objects) {
      for (const object of objectLayer.objects) {
        // Tiled uses Upper Left as the origin/anchor, Phaser uses Center
        object.x += object.width / 2
        object.y -= object.height / 2
        processObject(this, object, gameManager)
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

function processObject (manager, object, gameManager) {
  switch (object.type) {
    case EntityTypes.Character:
      object = assignPropertiesToObject(object.properties, object)
      processPlayerSpawnObject(manager, object)
      break
    case EntityTypes.Exit:
      manager.exits.push(assignPropertiesToObject(object.properties, object))
      break
    case EntityTypes.Door:
			if (!gameManager.isObjectDestroyed(manager.scene.levelKey, object.id)) {
				manager.doors.push(assignPropertiesToObject(object.properties, object))
			}
      break
    case EntityTypes.Enemies.Ogre1:
    case EntityTypes.Enemies.Skeleton1:
			if (!gameManager.isObjectDestroyed(manager.scene.levelKey, object.id)) {
				manager.enemySpawnPoints.push(assignPropertiesToObject(object.properties, object))
			}
      break
    case EntityTypes.StoreItem:
      manager.store.items.push(assignPropertiesToObject(object.properties, object))
      break
    case EntityTypes.StoreKeeper:
      manager.store.keeper = assignPropertiesToObject(object.properties, object)
      break
    case EntityTypes.Loot.ArrowFireMultiple:
    case EntityTypes.Loot.ArrowFireSingle:
    case EntityTypes.Loot.ArrowMagicMultiple:
    case EntityTypes.Loot.ArrowMagicSingle:
    case EntityTypes.Loot.ArrowNormalMultiple:
    case EntityTypes.Loot.ArrowNormalSingle:
    case EntityTypes.Loot.ArrowSilverMultiple:
    case EntityTypes.Loot.ArrowSilverSingle:
    case EntityTypes.Loot.Axe:
    case EntityTypes.Loot.BattleAxe:
    case EntityTypes.Loot.ChainMail:
    case EntityTypes.Loot.FlangedMace:
    case EntityTypes.Loot.FoodLarge:
    case EntityTypes.Loot.FoodSmall:
    case EntityTypes.Loot.GoldPile:
    case EntityTypes.Loot.GoldPiece:
    case EntityTypes.Loot.HalfPlateMail:
    case EntityTypes.Loot.Hammer:
    case EntityTypes.Loot.HammerMagic:
    case EntityTypes.Loot.Helmet:
    case EntityTypes.Loot.Key:
    case EntityTypes.Loot.LeatherArmor:
    case EntityTypes.Loot.LongBow:
    case EntityTypes.Loot.LongSword:
    case EntityTypes.Loot.Mace:
    case EntityTypes.Loot.PlateMail:
    case EntityTypes.Loot.RingMail:
    case EntityTypes.Loot.Shield:
    case EntityTypes.Loot.ShortBow:
    case EntityTypes.Loot.ShortSword:
    case EntityTypes.Loot.WarHammer:
    case EntityTypes.Loot.WarHammerMagic:
			if (!gameManager.isObjectDestroyed(manager.scene.levelKey, object.id)) {
				manager.loot.push(assignPropertiesToObject(object.properties, object))
			}
      break
    default:
      console.warn(`Unknown Loot type: ${object.type}`)
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

function setPrices (properties) {
  const prices = {}
  properties.forEach(property => {
    if (property.name.endsWith('Cost')) {
      prices[property.name] = property.value
    }
  })

  return prices
}