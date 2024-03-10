import SceneKeys from '../Keys/sceneKeys.js'
import Title from './title.js'
import { StyleConfigs } from '../Keys/fontKeys.js'
import ImageKeys from '../Keys/imageKeys.js'
import { CharacterSpriteSheetLoaderData, CharacterSpriteSheets } from '../Globals/characterSpriteSheetLoaderData.js'
import { PlayerMarkerSpriteSheetLoaderData, PlayerMarkerSpriteSheet } from '../Globals/playerMarkerSpriteSheetLoaderData.js'
import { EnemySpriteSheetLoaderData, EnemySpriteSheets } from '../Globals/enemySpriteSheetLoaderData.js'
import { AnimatedObjectSpriteSheetLoaderData, AnimatedObjectSpriteSheets } from '../Globals/animatedObjectSpriteSheetLoaderData.js'
import { TileSpriteSheetLoaderData } from '../Globals/tileSpriteSheetLoaderData.js'
import AudioKeys from '../Keys/audioKeys.js'
import MapKeys from '../Keys/mapKeys.js'
import { GameManagerKey } from '../Managers/gameManager.js'
import GameManager from '../Managers/gameManager.js'
import CharacterAnimations from '../Keys/characterAnimationKeys.js'
import EnemyAnimations from '../Keys/enemyAnimationKeys.js'
import AnimatedObjectAnimations from '../Keys/animatedObjectsAnimationKeys.js'
import InputOptionsKeys from '../Keys/inputOptionsKeys.js'
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import { CharacterClasses, Races, getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/Characters/character.js"
import Debug from "../Globals/debug.js"
// import AtlasKeys from '../Keys/atlasKeys.js'

class Preloader extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Preloader)
    this.gameManager = null // can't create this until the scene is initialized => in create()
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
      this.load.audio(key, `../../Public/Audio/${key}.mp3`)
    }

    // We may not need to load any Sprite Atlases for this project, but if we do, this is how we would do it:
    // for (const key in AtlasKeys) {
    //   this.load.atlas(AtlasKeys[key].image, `../../Public/Images/${AtlasKeys[key].image}.png`, `../../Public/SpriteSheetData/${AtlasKeys[key].data}.json`)
    // }

    // Spritesheets differ from Sprite Altases in that the individual images in a Spritesheet are all the same dimensions, and are arranged in a grid.
    // Sprite Atlases are usually packed with a software tool and can contain images of different dimensions arranged in any way (including rotated to maximize space usage).
    // This function accepts an array of 'SpriteSheetFileConfig' objects, which is what CharacterSpriteSheetLoaderData is
    this.load.spritesheet(CharacterSpriteSheetLoaderData)
    this.load.spritesheet(PlayerMarkerSpriteSheetLoaderData)
    this.load.spritesheet(EnemySpriteSheetLoaderData)
    this.load.spritesheet(TileSpriteSheetLoaderData)
    this.load.spritesheet(AnimatedObjectSpriteSheetLoaderData)

    // Load the webfont script. This is needed to load custom fonts.
    this.load.script('webfont', `../../Public/Fonts/webfont_loader.js`)
  }

  create () {
    this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
      console.log('Gamepad connected:', pad)
    })
    this.gameManager = new GameManager(this.game)
    this.game.registry.set(GameManagerKey, this.gameManager)

    // Animations are Global for whole Game => load them here and use anywhere
    buildAllAnimations(this)

    if (Debug.SkipTitleScene && Debug.SkipCharacterCreateScene) {
      loadDebugDefaults(this, this.gameManager)
    }

    // TODO: 'TitleKey' is what we acutally want, 'Level1Key' is just for testing
    if (Debug.SkipTitleScene) {
      if (Debug.SkipCharacterCreateScene) {
        this.gameManager.goToLevel(SceneKeys.Level1)
      } else {
        this.scene.start(SceneKeys.CharacterCreate)
      }
    } else {
      this.scene.add(SceneKeys.Title, new Title(), true)
    }

    this.scene.remove(SceneKeys.Preloader)
  }
}

function loadDebugDefaults (scene, gameManager) {
  gameManager.setPlayerCount(Debug.DefaultCharacterCount)
  gameManager.setCharacterCount(Debug.DefaultCharacterCount)
  gameManager.setActivePlayer(Player1Keys.Player, Debug.Player1Input, true)
  createPlayer1Character(scene, gameManager)
  if (Debug.DefaultCharacterCount >= 2) {
    gameManager.setActivePlayer(Player2Keys.Player, Debug.Player2Input, true)
    createPlayer2Character(scene, gameManager)
  }
  if (Debug.DefaultCharacterCount >= 3) {
    gameManager.setActivePlayer(Player3Keys.Player, Debug.Player3Input, true)
    createPlayer3Character(scene, gameManager)
  }
  if (Debug.DefaultCharacterCount >= 4) {
    gameManager.setActivePlayer(Player4Keys.Player, Debug.Player4Input, true)
    createPlayer4Character(scene, gameManager)
  }
}

function buildAllAnimations (preloader) {
  buildAllCharacterAnimations(preloader)
  buildAllPlayerMarkerAnimations(preloader)
  buildAllEnemyAnimations(preloader)
  buildAllAnimatedObjectAnimations(preloader)
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
  // const playerKeys = [Player1Keys.Player, Player2Keys.Player, Player3Keys.Player, Player4Keys.Player]

  // subtract 1 to account for the "__base" frame, divide by 4 to account for the 4 nearly duplicate rows (1 for each player color)
  // const frameCount = (preloader.textures.get(CharacterSpriteSheets[`${characterType}`]).frameTotal - 1) / 4

  for (const animationKey in CharacterAnimations[characterType]) {
    const animation = CharacterAnimations[characterType][animationKey]

    preloader.anims.create({
      key: animation.key,
      frames: preloader.anims.generateFrameNumbers(CharacterSpriteSheets[`${characterType}`], { frames: animation.frames }),
      frameRate: animation.props.frameRate,
      repeat: animation.props.repeat
    })
  }
}

function buildAllPlayerMarkerAnimations (preloader) {
  buildPlayerMarkerAnimations(preloader, Player1Keys.Player)
  buildPlayerMarkerAnimations(preloader, Player2Keys.Player)
  buildPlayerMarkerAnimations(preloader, Player3Keys.Player)
  buildPlayerMarkerAnimations(preloader, Player4Keys.Player)
}

function buildPlayerMarkerAnimations (preloader, playerKey) {
  let markerAnimationData  = null
  switch (playerKey) {
    case Player1Keys.Player:
      markerAnimationData = CharacterAnimations.Player1Marker
      break
    case Player2Keys.Player:
      markerAnimationData = CharacterAnimations.Player2Marker
      break
    case Player3Keys.Player:
      markerAnimationData = CharacterAnimations.Player3Marker
      break
    case Player4Keys.Player:
      markerAnimationData = CharacterAnimations.Player4Marker
      break
  }

    preloader.anims.create({
      key: markerAnimationData.key,
      frames: preloader.anims.generateFrameNumbers(PlayerMarkerSpriteSheet, { frames: markerAnimationData.frames }),
      frameRate: markerAnimationData.props.frameRate,
      repeat: markerAnimationData.props.repeat,
      yoyo: markerAnimationData.props.yoyo
    })
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

function buildAllAnimatedObjectAnimations (preloader) {
  for (const animatedObjectType in AnimatedObjectAnimations) {
    buildAnimatedObjectAnimations(preloader, animatedObjectType)
  }
}

function buildAnimatedObjectAnimations (preloader, animatedObjectType) {
  // This function builds all of the animations for a single animated object type
  const frameCount = preloader.textures.get(AnimatedObjectSpriteSheets[`${animatedObjectType}`]).frameTotal

  for (const animationKey in AnimatedObjectAnimations[animatedObjectType]) {
    const animation = AnimatedObjectAnimations[animatedObjectType][animationKey]
    const frames = []
    for (const frame of animation.frames) {
      frames.push(frame)
    }

    preloader.anims.create({
      key: `${animation.key}`,
      frames: preloader.anims.generateFrameNumbers(AnimatedObjectSpriteSheets[`${animatedObjectType}`], { frames }),
      frameRate: animation.props.frameRate,
      repeat: animation.props.repeat
    })
  }
}

function createPlayer1Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Debug.Player1Race, Debug.Player1Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player1Keys.Player,
    race: Debug.Player1Race,
    characterClass: Debug.Player1Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player1Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer2Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Debug.Player2Race, Debug.Player2Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player2Keys.Player,
    race: Debug.Player2Race,
    characterClass: Debug.Player2Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player2Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer3Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Debug.Player3Race, Debug.Player3Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player3Keys.Player,
    race: Debug.Player3Race,
    characterClass: Debug.Player3Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player3Keys.Player)
  }))

  newCharacter.serialize()
}

function createPlayer4Character (scene, gameManager) {
  // This is a temporary function to create a player for testing purposes
  const attributes = getCharacterAttributes(Debug.Player4Race, Debug.Player4Class)
  const newCharacter = (new Character(scene, {
    attributes,
    player: Player4Keys.Player,
    race: Debug.Player4Race,
    characterClass: Debug.Player4Class,
    gameManager: gameManager,
    inputEvent: gameManager.getInputEventForPlayer(Player4Keys.Player)
  }))

  newCharacter.serialize()
}

export default Preloader
