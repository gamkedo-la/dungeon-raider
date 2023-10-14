import { GameLevelKey } from "../../Keys/sceneKeys.js"
import MapManager from "../../Managers/MapManager.js"

class GameLevel extends Phaser.Scene {
  constructor (sceneKey, mapKey) {
    super(sceneKey || GameLevelKey)
    this.mapKey = mapKey
    this.mapManager = new MapManager(this, this.mapKey)
  }

  preload () {

  }

  create () {

  }

  update (time, delta) {

  }
}

export default GameLevel