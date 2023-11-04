import { GameLevelKey, UserInterfaceKey, GameOverKey, GameCompleteKey, InterLevelKey } from "../../Keys/sceneKeys.js"
import MapManager from "../../Managers/mapManager.js"
import InputManager from '../../Managers/inputManager.js'
import CollisionManager from "../../Managers/collisionManager.js"
import Character from "../../Entities/character.js"
import { GameManagerKey } from "../../Managers/gameManager.js"
import { onDebug, onPause } from "../../Keys/inputEventKeys.js"

class GameLevel extends Phaser.Scene {
  constructor (sceneKey, mapKey) {
    super(sceneKey || GameLevelKey)
    this.mapKey = mapKey
    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.mapManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.characters = []
    this.debugGraphics = null
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.physics.world.debugGraphic.visible = false
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.mapManager = new MapManager(this, this.mapKey)
    this.collisionManager = new CollisionManager(this, this.mapManager)
    this.inputManager = new InputManager(this, this.gameManager)
    this.inputManager.registerForEvent(onDebug, this.toggleDebug, this)
    this.inputManager.registerForEvent(onPause, this.togglePause, this)

    this.createCharacters()
    this.setupCamera()

    this.debugGraphics = this.add.graphics()
    this.scene.launch(UserInterfaceKey)
  }

  createCharacters () {
    const activePlayers = this.gameManager.getActivePlayers()
    for (const activePlayer of activePlayers) {
      const attributes = this.gameManager.getCharacterAttributesForPlayer(activePlayer)
      const character = (new Character(this, {
        attributes,
        player: activePlayer,
        race: this.gameManager.getCharacterRaceForPlayer(activePlayer),
        characterClass: this.gameManager.getCharacterClassForPlayer(activePlayer),
        gameManager: this.gameManager,
        inputEvent: this.gameManager.getInputEventForPlayer(activePlayer)
      }))

      const playerSpawnPos = this.mapManager.getPlayerSpawn(activePlayer)
      character.setPosition(playerSpawnPos.x, playerSpawnPos.y)

      this.collisionManager.addEntity(character) // add the character to the physics simulation and enable collisions
      this.add.existing(character) // add the character to the scene => will be visible and updated

      this.characters.push(character)
    }
  }

  setupCamera () {
    this.cameras.main.setBounds(0, 0, this.mapManager.map.widthInPixels, this.mapManager.map.heightInPixels)
    this.cameras.main.setZoom(0.5)
    this.tweens.add({
      targets: this.cameras.main,
      zoom: 2,
      delay: 500,
      duration: 2000,
      ease: Phaser.Math.Easing.Quadratic.InOut,
      onComplete: () => {
        for (const character of this.characters) {
          character.setInputManager(this.inputManager)
          character.levelDidStart()
        }
      },
      onCompleteScope: this
    })
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
    if (this.physics.world.debugGraphic.visible) {
      this.drawDebug()
    } else {
      this.debugGraphics.clear()
    }

    const cameraPos = { x: 0, y: 0 }
    for (const character of this.characters) {
      cameraPos.x += character.x
      cameraPos.y += character.y
    }
    cameraPos.x /= this.characters.length
    cameraPos.y /= this.characters.length
    this.cameras.main.centerOn(this.characters[0].x, this.characters[0].y)
  }

  toggleDebug () {
    this.physics.world.debugGraphic.visible = !this.physics.world.debugGraphic.visible
  }

  drawDebug () {
    this.debugGraphics.clear()
    this.mapManager.map.renderDebugFull(this.debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(255, 0, 0, 100),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })
  }

  togglePause () {
    console.log('GameLevel.togglePause')
  }
}

export default GameLevel