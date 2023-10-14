import GameLevel from "./gameLevel.js"
import { Level3Key } from "../../Keys/sceneKeys.js"
import { Level3MapKey } from "../../Keys/mapKeys.js"

class Level3 extends GameLevel {
  constructor () {
    super(Level3Key, Level3MapKey)
  }

  preload () {
    super.preload() // This may not actually preload anything since we have a Preload scene
  }

  create () {
    super.create()
    // Add any Level 3 specific stuff here, there may or may not be much since all of the levels will share most of the same functionality
  }

  update (time, delta) {
    super.update(time, delta)
    // Add any Level 3 specific stuff here, there may or may not be much since all of the levels will share most of the same functionality
  }
}

export default Level3