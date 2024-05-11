import SceneKeys from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import OptionMenu from "../UIElements/optionMenu.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import AudioKeys, { TitleMusic, AlertSound, MenuChanged } from "../Keys/audioKeys.js"
import { Races, CharacterClasses, getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/Characters/character.js"
import UIAttributes from "../Globals/uiAttributes.js"
import Debug from "../Globals/debug.js"

import ImageKeys from '../Keys/imageKeys.js'
import { CharacterSpriteSheetLoaderData, CharacterSpriteSheets } from '../Globals/characterSpriteSheetLoaderData.js'
import { PlayerMarkerSpriteSheetLoaderData, PlayerMarkerSpriteSheet } from '../Globals/playerMarkerSpriteSheetLoaderData.js'
import { EnemySpriteSheetLoaderData, EnemySpriteSheets } from '../Globals/enemySpriteSheetLoaderData.js'
import { AnimatedObjectSpriteSheetLoaderData, AnimatedObjectSpriteSheets } from '../Globals/animatedObjectSpriteSheetLoaderData.js'
import { TileSpriteSheetLoaderData } from '../Globals/tileSpriteSheetLoaderData.js'
import MapKeys from '../Keys/mapKeys.js'
import CharacterAnimations from '../Keys/characterAnimationKeys.js'
import EnemyAnimations from '../Keys/enemyAnimationKeys.js'
import AnimatedObjectAnimations from '../Keys/animatedObjectsAnimationKeys.js'

const selections = {
  OnePlayer: 1,
  TwoPlayer: 2,
  ThreePlayer: 3,
  FourPlayer: 4,
  Controls: 5,
  Credits: 6
}

class Title extends Phaser.Scene {
  constructor () {
    super(SceneKeys.Title)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()

    this.alertSound = null
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
    for (const key in ImageKeys) {
      if (key === ImageKeys.GoldPieceImage) continue
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

    // Spritesheets differ from Sprite Altases in that the individual images in a Spritesheet are all the same dimensions, and are arranged in a grid.
    // Sprite Atlases are usually packed with a software tool and can contain images of different dimensions arranged in any way (including rotated to maximize space usage).
    // This function accepts an array of 'SpriteSheetFileConfig' objects, which is what CharacterSpriteSheetLoaderData is
    this.load.spritesheet(CharacterSpriteSheetLoaderData)
    this.load.spritesheet(PlayerMarkerSpriteSheetLoaderData)
    this.load.spritesheet(EnemySpriteSheetLoaderData)
    this.load.spritesheet(TileSpriteSheetLoaderData)
    this.load.spritesheet(AnimatedObjectSpriteSheetLoaderData)
  }

  create () {
    buildAllAnimations(this)
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
      this.gameManager.addGamepad(pad)
    })

    this.inputManager = new InputManager(this, this.gameManager)

    this.optionMenu = new OptionMenu(this, {
        gameManager: this.gameManager,
        inputManager: this.inputManager,
        selections: selections,
				selected: selections.OnePlayer,
				onSelectCallback: this.onMenuSelectOption.bind(this)
    })

    this.buildMenu()
    this.alertSound = this.sound.add(AlertSound, { loop: AudioKeys[AlertSound].loop, volume: AudioKeys[AlertSound].volume })
    this.alertSound = this.sound.add(MenuChanged, { loop: AudioKeys[MenuChanged].loop, volume: AudioKeys[MenuChanged].volume })

    if (!this.sound.sounds.find(sound => sound.key === TitleMusic)?.isPlaying) {
      this.sound.play(TitleMusic, { loop: AudioKeys[TitleMusic].loop, volume: AudioKeys[TitleMusic].volume })
    }

    this.cameras.main.fadeIn(2000, 0,0,0)
  }

  buildMenu () {
    this.optionMenu.buildMenuOption('1 Player Game', 1, UIAttributes.Player1Color, true)
    this.optionMenu.buildMenuOption('2 Player Game', 2, UIAttributes.Player2Color)
    this.optionMenu.buildMenuOption('3 Player Game', 3, UIAttributes.Player3Color)
    this.optionMenu.buildMenuOption('4 Player Game', 4, UIAttributes.Player4Color)
    this.optionMenu.buildMenuOption('Controls', 5)
    this.optionMenu.buildMenuOption('Credits', 6)
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  onMenuSelectOption (option) {
		if (option === selections.Controls) {
			this.scene.start(SceneKeys.Options)
      this.scene.stop(SceneKeys.Title)
		} else if (option === selections.Credits) {
			this.scene.start(SceneKeys.Credits)
      this.scene.stop(SceneKeys.Title)
		} else {
			this.gameManager.setPlayerCount(option || selections.OnePlayer)
			this.gameManager.setCharacterCount(option || selections.OnePlayer)
			if (Debug.SkipCharacterCreateScene) {
				loadDebugDefaults(this, this.gameManager, option)
			} else {
				this.scene.start(SceneKeys.CharacterCreate)
			}
      this.sound.sounds.find(sound => sound.key === TitleMusic).stop()
			this.scene.stop(SceneKeys.Title)
		}
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



function loadDebugDefaults (scene, gameManager, selected) {
	console.log(selected)
  createPlayer1Character(scene, gameManager)
  gameManager.setActivePlayer(Player1Keys.Player, Debug.Player1Input, true)        

  if (selected > selections.OnePlayer) {
    createPlayer2Character(scene, gameManager)
    gameManager.setActivePlayer(Player2Keys.Player, Debug.Player2Input, true)
  }

  if (selected > selections.TwoPlayer) {
    createPlayer3Character(scene, gameManager)
    gameManager.setActivePlayer(Player3Keys.Player, Debug.Player3Input, true)
  }

  if (selected > selections.ThreePlayer) {
    createPlayer4Character(scene, gameManager)
    gameManager.setActivePlayer(Player4Keys.Player, Debug.Player4Input, true)
  }

  gameManager.goToLevel(Debug.LevelToLoad)
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

export default Title