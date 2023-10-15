import { MasterTileset } from "../Keys/imageKeys.js"
import { TileLayerKeys, ObjectLayerKeys } from "../Keys/mapLayerKeys.js"

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

    this.objects = {}
    for (const objectLayer of this.map.objects) {
      for (const object of objectLayer.objects) {
        if (!this.objects[object.type]) this.objects[object.type] = []
        this.objects[object.type].push(object)
      }
    }
  }
}