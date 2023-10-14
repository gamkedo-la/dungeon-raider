import { PreloaderKey, TitleKey } from '../Keys/sceneKeys.js'
import ImageKeys from '../Keys/imageKeys.js'
import AudioKeys from '../Keys/audioKeys.js'

class Preloader extends Phaser.Scene {
  constructor () {
    super(PreloaderKey)
  }

  preload () {
    for (const key in ImageKeys) {
      this.load.image(ImageKeys[key], `../../Public/Images/${ImageKeys[key]}.png`)
    }

    for (const key in AudioKeys) {
      this.load.audio(AudioKeys[key], `../../Public/Audio/${AudioKeys[key]}.mp3`)
    }
  }

  create () {
    this.scene.start(TitleKey)
    this.scene.remove(PreloaderKey)
  }
}

export default Preloader
