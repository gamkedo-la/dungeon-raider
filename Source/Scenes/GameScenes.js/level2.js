import GameLevel from "./gameLevel.js"
import AudioKeys, { ExplorersMusic } from "../../Keys/audioKeys.js"
import { Level2Key } from "../../Keys/sceneKeys.js"
import { Level2MapKey } from "../../Keys/mapKeys.js"

class Level2 extends GameLevel {
  constructor () {
    super(Level2Key, Level2MapKey)
  }

  preload () {
    super.preload() // This may not actually preload anything since we have a Preload scene
  }

  create () {
    super.create()
    // Add any Level 2 specific stuff here, there may or may not be much since all of the levels will share most of the same functionality
    if (!this.sound.sounds.find(sound => sound.key === ExplorersMusic).isPlaying) {
      this.sound.play(ExplorersMusic, { loop: AudioKeys[ExplorersMusic].loop, volume: AudioKeys[ExplorersMusic].volume })
    }
  }

  update (time, delta) {
    super.update(time, delta)
    // Add any Level 2 specific stuff here, there may or may not be much since all of the levels will share most of the same functionality
  }
}

export default Level2