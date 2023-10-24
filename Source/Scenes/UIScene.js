import { UserInterfaceKey } from "../Keys/sceneKeys.js"
import GameManager from "../Managers/gameManager.js"

class UserInterface extends Phaser.Scene {
  constructor () {
    super(UserInterfaceKey)
  }

  preload () {
    super.preload()

    // May not need to preload anything here since we have a Preloader scene
  }

  create () {

  }

  update (time, delta) {
    // get player health, weapons, armor, equipment, etc. from Game Manager
  }
}

export default UserInterface