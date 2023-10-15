import { GameLevelKey, GameOverKey, GameCompleteKey } from "../../Keys/sceneKeys.js"
import MapManager from "../../Managers/mapManager.js"

class GameLevel extends Phaser.Scene {
  constructor (sceneKey, mapKey) {
    super(sceneKey || GameLevelKey)
    this.mapKey = mapKey
    this.mapManager = null // can't create this until the scene is initialized => in create()
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.mapManager = new MapManager(this, this.mapKey)
  }

  update (time, delta) {
    // Do NOT 'update' Sprites or other Game Objects. Sprites have preUpdate() and postUpdate() methods for that.
    // Updating Game Objects can make it hard or impossible to predict what the state
    // of the Game Object is when this method fires.

  }
}

export default GameLevel