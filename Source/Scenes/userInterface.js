import { UserInterfaceKey } from "../Keys/sceneKeys.js"
import GameManager from "../Managers/GameManager.js"

class UserInterface extends Phaser.Scene {
  constructor () {
    super(UserInterfaceKey)
  }

  preload () {

  }

  create () {

  }

  update (time, delta) {
    // get player health and lives from Game Manager
  }
}

export default UserInterface