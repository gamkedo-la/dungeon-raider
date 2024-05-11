import SceneKeys from '../Keys/sceneKeys.js'
import Title from './title.js'
import { StyleConfigs } from '../Keys/fontKeys.js'
import ImageKeys from '../Keys/imageKeys.js'
import { CharacterSpriteSheets } from '../Globals/characterSpriteSheetLoaderData.js'
import { PlayerMarkerSpriteSheet } from '../Globals/playerMarkerSpriteSheetLoaderData.js'
import { EnemySpriteSheets } from '../Globals/enemySpriteSheetLoaderData.js'
import { AnimatedObjectSpriteSheets } from '../Globals/animatedObjectSpriteSheetLoaderData.js'
import { GameManagerKey } from '../Managers/gameManager.js'
import GameManager from '../Managers/gameManager.js'
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import { CharacterClasses, Races, getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/Characters/character.js"
import Debug from "../Globals/debug.js"
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"

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
    this.load.image(ImageKeys.GoldPieceImage, `../../Public/Images/${ImageKeys.GoldPieceImage}.png`)

    // Load the webfont script. This is needed to load custom fonts.
    this.load.script('webfont', `../../Public/Fonts/webfont_loader.js`)
  }

  create () {
    new FontLabel(this, {
      x: this.game.canvas.width / 2,
      y: this.game.canvas.height / 2,
      title: 'Loading...',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.TitleFontSize,
      color: UIAttributes.UIColor,
      align: UIAttributes.CenterAlign
    })

    this.time.delayedCall(100, () => {
      this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
        console.log('Gamepad connected:', pad)
      })
      this.gameManager = new GameManager(this.game)
      this.game.registry.set(GameManagerKey, this.gameManager)
  
      if (Debug.SkipTitleScene && Debug.SkipCharacterCreateScene) {
        loadDebugDefaults(this, this.gameManager)
      }
  
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
    })
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
