import { PreloaderKey, TitleKey, Level1Key } from '../Keys/sceneKeys.js'
import ImageKeys from '../Keys/imageKeys.js'
import { SpriteSheetLoaderData } from '../Globals/spriteSheetLoaderData.js'
import AudioKeys from '../Keys/audioKeys.js'
import MapKeys from '../Keys/mapKeys.js'
import { GameManagerKey } from '../Managers/gameManager.js'
import GameManager from '../Managers/gameManager.js'
// import AtlasKeys from '../Keys/atlasKeys.js'

class Preloader extends Phaser.Scene {
  constructor () {
    super(PreloaderKey)
  }

  preload () {
    // Load individual Images. Images are identical to Sprites, but Images cannot be animated.
    for (const key in ImageKeys) {
      this.load.image(ImageKeys[key], `../../Public/Images/${ImageKeys[key]}.png`)
    }

    // Load the Tilemaps. Tilemaps are JSON files that contain information about the map, including the tileset used, the layers, and the objects.
    // Our Master Tileset is a single image that contains all of the tiles we will use in our game.  It was loaded in the previous for-loop as an Image.
    for (const key in MapKeys) {
      this.load.tilemapTiledJSON(MapKeys[key], `../../Public/Maps/${MapKeys[key]}.json`)
    }

    // Load individual Audio files. This will include loopable background music and sound effects.
    for (const key in AudioKeys) {
      this.load.audio(AudioKeys[key], `../../Public/Audio/${AudioKeys[key]}.mp3`)
    }

    // We may not need to load any Sprite Atlases for this project, but if we do, this is how we would do it:
    // for (const key in AtlasKeys) {
    //   this.load.atlas(AtlasKeys[key].image, `../../Public/Images/${AtlasKeys[key].image}.png`, `../../Public/SpriteSheetData/${AtlasKeys[key].data}.json`)
    // }

    // Spritesheets differ from Sprite Altases in that the individual images in a Spritesheet are all the same dimensions, and are arranged in a grid.
    // Sprite Atlases are usually packed with a software tool and can contain images of different dimensions arranged in any way (including rotated to maximize space usage).
    // This function accepts an array of 'SpriteSheetFileConfig' objects, which is what SpriteSheetLoaderData is
    this.load.spritesheet(SpriteSheetLoaderData)
  }

  create () {
    this.game.registry.set(GameManagerKey, new GameManager(this.game))
    // TODO: 'TitleKey' is what we acutally want, 'Level1Key' is just for testing
    // this.scene.start(TitleKey)
    this.scene.start(Level1Key)
    this.scene.remove(PreloaderKey)
  }
}

export default Preloader
