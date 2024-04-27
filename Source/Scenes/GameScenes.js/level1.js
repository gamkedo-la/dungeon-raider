import GameLevel from "./gameLevel.js"
import AudioKeys, { GamePlayMusic } from "../../Keys/audioKeys.js"
import { Level1Key } from "../../Keys/sceneKeys.js"
import { Level1MapKey } from "../../Keys/mapKeys.js"

class Level1 extends GameLevel {
  constructor () {
    super(Level1Key, Level1MapKey)
  }

  preload () {
    super.preload() // This may not actually preload anything since we have a Preload scene
  }

  create () {
    super.create()
    // Add any Level 1 specific stuff here, there may or may not be much since all of the levels will share most of the same functionality
    if (!this.sound.sounds.find(sound => sound.key === GamePlayMusic).isPlaying) {
      this.sound.play(GamePlayMusic, { loop: AudioKeys[GamePlayMusic].loop, volume: AudioKeys[GamePlayMusic].volume })
    }
  }

  update (time, delta) {
    super.update(time, delta)
    // Add any Level 1 specific stuff here, there may or may not be much since all of the levels will share most of the same functionality

    // TODO: When all Characters have exited the Level 1 Dungeon, transition to the Inter-Level Scene
    // TODO: If all Characters have died, transition to the Game Over Scene
  }
}

export default Level1