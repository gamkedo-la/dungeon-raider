import { PreloaderKey, TitleKey, Level1Key } from '../Keys/sceneKeys.js'
import { StyleConfigs } from '../Keys/fontKeys.js'
import ImageKeys from '../Keys/imageKeys.js'
import { SpriteSheetLoaderData } from '../Globals/spriteSheetLoaderData.js'
import AudioKeys from '../Keys/audioKeys.js'
import MapKeys from '../Keys/mapKeys.js'
import { GameManagerKey } from '../Managers/gameManager.js'
import GameManager from '../Managers/gameManager.js'
import { Player1Keys } from "../Keys/playerPropertyKeys.js"
import { CharacterClasses, Races } from "../Globals/characterAttributes.js"
import { getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/character.js"
// import AtlasKeys from '../Keys/atlasKeys.js'

class Preloader extends Phaser.Scene {
  constructor () {
    super(PreloaderKey)
  }

  init () {
    for (const config of StyleConfigs) {
      const element = document.createElement('style')
      document.head.appendChild(element)
      const sheet = element.sheet  
      const styles = config
      sheet.insertRule(styles, 0)
    }
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

    // Load the webfont script. This is needed to load custom fonts.
    this.load.script('webfont', `../../Public/Fonts/webfont_loader.js`)
  }

  create () {
    const gameManager = new GameManager(this.game)
    this.game.registry.set(GameManagerKey, gameManager)

    // TODO: Move this into the Character Create Scene
    createPlayer1Character(this, gameManager)

    // TODO: 'TitleKey' is what we acutally want, 'Level1Key' is just for testing
    // this.scene.start(TitleKey)
    this.scene.start(Level1Key)
    this.scene.remove(PreloaderKey)
  }
}

function createPlayer1Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Races.Elf, CharacterClasses.Warrior)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player1Keys.Player,
    race: Races.Elf,
    characterClass: CharacterClasses.Warrior,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player1Keys.Player)
  }))

  newCharacter.serialize()
}

export default Preloader
