import { PreloaderKey, TitleKey } from '../Keys/sceneKeys.js'
import ImageKeys from '../Keys/imageKeys.js'

class Preloader extends Phaser.Scene {
  constructor () {
    super(PreloaderKey)
  }

  preload () {
    for (const key in ImageKeys) {
      this.load.image(ImageKeys[key], `../../Public/Images/${ImageKeys[key]}.png`)
    }
  }

  create () {
    this.scene.start(TitleKey)
    this.scene.remove(PreloaderKey)
  }
}

export default Preloader
