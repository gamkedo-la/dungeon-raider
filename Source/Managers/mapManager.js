import { MasterTileset } from "../Keys/imageKeys.js"
import { TileLayerKeys } from "../Keys/mapLayerKeys.js"
import EntityTypes from "../Globals/entityTypes.js"
import CollidableGIDs, { BridgeIndex, Lava, Liquids, Water } from "../Globals/collisionTiles.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"

export default class MapManager {
  constructor (scene, tilemapKey, gameManager) {
    this.scene = scene
    this.tilemapKey = tilemapKey
    this.gameManager = gameManager
    this.map = scene.make.tilemap({ key: tilemapKey })
    this.tileAnimations = extractTileAnimations(this.map)
    this.tileset = this.map.addTilesetImage(MasterTileset, MasterTileset)
    
    // optional map RGB color tint
    this.mapTintRGB = 0xFFFFFF // default to pure white tint
    let rgbData = this.map.properties.find(o => o.name === 'mapTintRGB')
    if (rgbData != undefined) {
        let rgbstring = rgbData.value
        console.log("Tinting the map this color: "+rgbstring)
        this.mapTintRGB = parseInt(rgbstring,16)
        // safeguard against invalid input data like a typo
        if (isNaN(this.mapTintRGB)) this.mapTintRGB = 0xFFFFFF
    }

    this.layers = {}
    const collisionTileSet = new Set()
    for (const layerKey in TileLayerKeys) {
      this.layers[layerKey] = this.map.createLayer(TileLayerKeys[layerKey], this.tileset).layer.tilemapLayer
      this.layers[layerKey].setTint(this.mapTintRGB)
      if (TileLayerKeys[layerKey] === TileLayerKeys.CollisionLayer) {
        this.map.setCollision(CollidableGIDs, true)
        for (let row = 0; row < this.layers[layerKey].layer.data.length; row++) {
          for (let col = 0; col < this.layers[layerKey].layer.data[row].length; col++) {
            const tile = this.layers[layerKey].layer.data[row][col]
            if (CollidableGIDs.includes(tile.index)) collisionTileSet.add({ x: tile.x, y: tile.y })
          }
        }
      }
      if (TileLayerKeys[layerKey] === TileLayerKeys.BelowGroundLayer) {
        for (let row = 0; row < this.layers[layerKey].layer.data.length; row++) {
          for (let col = 0; col < this.layers[layerKey].layer.data[row].length; col++) {
            const tile = this.layers[layerKey].layer.data[row][col]
            if (CollidableGIDs.includes(tile.index)) collisionTileSet.add({ x: tile.x, y: tile.y })
          }
        }
      }
      this.layers[layerKey].animatedTiles = findAnimatedTiles(this.tileAnimations, this.layers[layerKey].layer.data)
    }

    this.exits = []
    this.drawbridges = []
    this.doors = []
    this.loot = []
    this.collisionTileIndexes = Array.from(collisionTileSet)

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
    this.spawners = []
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

    this.tileCosts = buildTileCosts(this)
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

  getNeighboringTiles (x, y) {
    const neighbors = []
    if (this.tileCosts[y - 1] && this.tileCosts[y - 1][x]) neighbors.push(this.tileCosts[y - 1][x])
    if (this.tileCosts[y + 1] && this.tileCosts[y + 1][x]) neighbors.push(this.tileCosts[y + 1][x])
    if (this.tileCosts[y][x - 1]) neighbors.push(this.tileCosts[y][x - 1])
    if (this.tileCosts[y][x + 1]) neighbors.push(this.tileCosts[y][x + 1])
    return neighbors
  }

  getTileAt (x, y) {
    return this.tileCosts[y][x]
  }

  getTileCost (x, y, entity) {
    const tile = this.tileCosts[y][x]
    if (tile.cost > 1) {
      if (entity.entityType === EntityTypes.Enemies.Skeleton1) {
        if (Liquids.includes(tile.index)) {
          return 2
        } else {
          return Number.MAX_SAFE_INTEGER
        }
      } else if (entity.entityType === EntityTypes.Enemies.Ogre1) {
        if (Water.includes(tile.index)) {
          return 2
        } else {
          return Number.MAX_SAFE_INTEGER
        }
      } else if (entity.entityType === EntityTypes.Enemies.Demon1) {
        if (Lava.includes(tile.index)) {
          return 2
        } else {
          return Number.MAX_SAFE_INTEGER
        }
      }      
    } else {
      return tile.cost
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
    case EntityTypes.Drawbridge:
      manager.drawbridges.push(assignPropertiesToObject(object.properties, object))
      break
    case EntityTypes.Door:
			if (!gameManager.isObjectDestroyed(manager.scene.levelKey, object.id)) {
				manager.doors.push(assignPropertiesToObject(object.properties, object))
			}
      break
    case EntityTypes.Enemies.Ogre1:
    case EntityTypes.Enemies.Skeleton1:
    case EntityTypes.Enemies.Demon1:
			if (!gameManager.isObjectDestroyed(manager.scene.levelKey, object.id)) {
				manager.enemySpawnPoints.push(assignPropertiesToObject(object.properties, object))
			}
      break
    case EntityTypes.Spawners.Ogre1:
    case EntityTypes.Spawners.Skeleton1:
    case EntityTypes.Spawners.Demon1:
      if (!gameManager.isObjectDestroyed(manager.scene.levelKey, object.id)) {
        manager.spawners.push(assignPropertiesToObject(object.properties, object))
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

function buildTileCosts (manager) {
  const tileCosts = {}
  const collisionLayer =  manager.map.layers.find(layer => layer.name === TileLayerKeys.CollisionLayer).tilemapLayer
  const groundLayer = manager.map.layers.find(layer => layer.name === TileLayerKeys.GroundLayer).tilemapLayer
  const belowGroundLayer =  manager.map.layers.find(layer => layer.name === TileLayerKeys.BelowGroundLayer).tilemapLayer 

  for (let row = 0; row < manager.map.height; row++) {
    for (let col = 0; col < manager.map.width; col++) {
      let tile = collisionLayer.getTileAt(col, row, false)
      if (!tile || !CollidableGIDs.includes(tile.index)) {
        tile = belowGroundLayer.getTileAt(col, row, false)
        if (tile) {
          if (groundLayer.getTileAt(col, row)?.index === BridgeIndex) {
            tile = null
          } else if (!CollidableGIDs.includes(tile.index)) {
            tile = null
          }
        }
      }

      if (tile) {
        if (!tileCosts[row]) tileCosts[row] = {}
        tile.cost = Number.MAX_SAFE_INTEGER
        tileCosts[row][col] = tile
      } else {
        tile = groundLayer.getTileAt(col, row, false) || { x: col, y: row, pixelX: col * 32, pixelY: row * 32, cost: 1 }
        if (!tileCosts[row]) tileCosts[row] = {}
        tile.cost = 1
        tileCosts[row][col] = tile
      }
    }
  }

  return tileCosts
}