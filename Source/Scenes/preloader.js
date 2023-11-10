import { PreloaderKey, TitleKey, Level1Key } from '../Keys/sceneKeys.js'
import { StyleConfigs } from '../Keys/fontKeys.js'
import ImageKeys from '../Keys/imageKeys.js'
import { CharacterSpriteSheetLoaderData, CharacterSpriteSheets } from '../Globals/characterSpriteSheetLoaderData.js'
import { EnemySpriteSheetLoaderData, EnemySpriteSheets } from '../Globals/enemySpriteSheetLoaderData.js'
import AudioKeys from '../Keys/audioKeys.js'
import MapKeys from '../Keys/mapKeys.js'
import { GameManagerKey } from '../Managers/gameManager.js'
import GameManager from '../Managers/gameManager.js'
import CharacterAnimations from '../Keys/characterAnimationKeys.js'
import EnemyAnimations from '../Keys/enemyAnimationKeys.js'
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import { CharacterClasses, Races, getCharacterAttributes } from "../Globals/characterAttributes.js"
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
    // This function accepts an array of 'SpriteSheetFileConfig' objects, which is what CharacterSpriteSheetLoaderData is
    this.load.spritesheet(CharacterSpriteSheetLoaderData)
    this.load.spritesheet(EnemySpriteSheetLoaderData)

    // Load the webfont script. This is needed to load custom fonts.
    this.load.script('webfont', `../../Public/Fonts/webfont_loader.js`)
  }

  create () {
    this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
      console.log('Gamepad connected:', pad)
    })
    const gameManager = new GameManager(this.game)
    this.game.registry.set(GameManagerKey, gameManager)

    // Animations are Global for whole Game => load them here and use anywhere
    buildAllAnimations(this)

    // TODO: Move this into the Character Create Scene
    createPlayer1Character(this, gameManager)
    createPlayer2Character(this, gameManager)

    // TODO: 'TitleKey' is what we acutally want, 'Level1Key' is just for testing
    // this.scene.start(TitleKey)
    this.scene.start(Level1Key)
    this.scene.remove(PreloaderKey)
  }
}

function buildAllAnimations (preloader) {
  buildAllCharacterAnimations(preloader)
  buildAllEnemyAnimations(preloader)
}

function buildAllCharacterAnimations (preloader) {
  for (const race of Object.values(Races)) {
    for (const characterClass of Object.values(CharacterClasses)) {
      buildCharacterAnimations(preloader, `${race}${characterClass}`)
    }
  }
}

function buildCharacterAnimations (preloader, characterType) {
  // This function builds all of the animations for a single character type
  const playerKeys = [Player1Keys.Player, Player2Keys.Player, Player3Keys.Player, Player4Keys.Player]

  // subtract 1 to account for the "__base" frame, divide by 4 to account for the 4 nearly duplicate rows (1 for each player color)
  const frameCount = (preloader.textures.get(CharacterSpriteSheets[`${characterType}`]).frameTotal - 1) / 4

  let i = 0
  for (const playerKey of playerKeys) {
    for (const animationKey in CharacterAnimations[characterType]) {
      const animation = CharacterAnimations[characterType][animationKey]
      const frames = []
      for (const frame of animation.frames) {
        frames.push(frame + (i * frameCount))
      }

      preloader.anims.create({
        key: `${playerKey}-${animation.key}`,
        frames: preloader.anims.generateFrameNumbers(CharacterSpriteSheets[`${characterType}`], { frames }),
        frameRate: animation.props.frameRate,
        repeat: animation.props.repeat
      })
    }
    i++
  }
}

function buildAllEnemyAnimations (preloader) {
  for (const enemyType in EnemySpriteSheets) {
    buildEnemyAnimations(preloader, enemyType)
  }
}

function buildEnemyAnimations (preloader, enemyType) {
  // This function builds all of the animations for a single enemy type
  const frameCount = preloader.textures.get(EnemySpriteSheets[`${enemyType}`]).frameTotal

  for (const animationKey in EnemyAnimations[enemyType]) {
    const animation = EnemyAnimations[enemyType][animationKey]
    const frames = []
    for (const frame of animation.frames) {
      frames.push(frame)
    }

    preloader.anims.create({
      key: `${animation.key}`,
      frames: preloader.anims.generateFrameNumbers(EnemySpriteSheets[`${enemyType}`], { frames }),
      frameRate: animation.props.frameRate,
      repeat: animation.props.repeat
    })
  }
}

function createPlayer1Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Races.Elven, CharacterClasses.Warrior)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player1Keys.Player,
    race: Races.Elven,
    characterClass: CharacterClasses.Warrior,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player1Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer2Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Races.Human, CharacterClasses.Archer)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player2Keys.Player,
    race: Races.Human,
    characterClass: CharacterClasses.Archer,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player2Keys.Player)
  }))

  newCharacter.serialize()
}

export default Preloader
