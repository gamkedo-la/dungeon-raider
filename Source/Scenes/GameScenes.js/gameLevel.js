import { GameLevelKey, UserInterfaceKey, GameOverKey, GameCompleteKey, InterLevelKey, FinalLevelKey } from "../../Keys/sceneKeys.js"
import MapManager from "../../Managers/mapManager.js"
import InputManager from '../../Managers/inputManager.js'
import CollisionManager from "../../Managers/collisionManager.js"
import EnemyManager from "../../Managers/enemyManager.js"
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
    this.enemyManager = new EnemyManager(this, this.mapManager, this.collisionManager, this.gameManager)
    this.inputManager = new InputManager(this, this.gameManager)
    this.inputManager.registerForEvent(onDebug, this.toggleDebug, this)
    this.inputManager.registerForEvent(onPause, this.togglePause, this)
    this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
      this.inputManager.addGamepad(pad)
    })

    this.createCharacters()
    this.setupCamera()

    this.debugGraphics = this.add.graphics()
    this.scene.launch(UserInterfaceKey)
    this.mapManager.startTileAnimations()
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

      this.collisionManager.addEntity(character, character.attributes.radius) // add the character to the physics simulation and enable collisions
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
    if (this.characters.length === 0) {
      this.createCharacters()
      if (this.characters.length === 0) return
    } else if (this.characters.every(character => character.isDead)) {
      this.scene.stop(UserInterfaceKey)
      this.scene.start(GameOverKey)
      return
    } else if (this.characters.every(character => character.isDead || character.hasExited)) {
      this.scene.stop(UserInterfaceKey)
      if (this.key === FinalLevelKey) {
        this.scene.start(GameCompleteKey)
      } else {
        this.scene.start(InterLevelKey)
      }
      return
    }

    this.inputManager.update(time, delta)
    if (this.physics.world.debugGraphic.visible) {
      this.drawDebug()
    } else {
      this.debugGraphics.clear()
    }

    const characterXs = this.characters.map(character => character.x)
    const characterYs = this.characters.map(character => character.y)
    const minX = Math.min(...characterXs)
    const maxX = Math.max(...characterXs)
    const minY = Math.min(...characterYs)
    const maxY = Math.max(...characterYs)

    if (Math.abs(maxX - minX) + this.characters[0].width <= this.cameras.main.width / this.cameras.main.zoom) {
      this.cameras.main.centerOnX((maxX + minX) / 2)
    }

    if (Math.abs(maxY - minY) + this.characters[0].height <= this.cameras.main.height / this.cameras.main.zoom) {
      this.cameras.main.centerOnY((maxY + minY) / 2)
    }

    if (this.cameras.main.worldView.right !== 0 && this.cameras.main.worldView.bottom !== 0) {
      for (const character of this.characters) {
        character.x = Phaser.Math.Clamp(character.x, this.cameras.main.worldView.left + character.width / 2, this.cameras.main.worldView.right - character.width / 2)
        character.y = Phaser.Math.Clamp(character.y, this.cameras.main.worldView.top + character.height / 2, this.cameras.main.worldView.bottom - character.height / 2)
      }
    }
  }

  getClosestCharacter (entity) {
    const distances = this.characters.map(character => {

      const distance = character.isDead || character.shouldBeDead ? Number.MAX_VALUE : Phaser.Math.Distance.Between(entity.x, entity.y, character.x, character.y)
      return { character, distance }
    })

    distances.sort((a, b) => a.distance - b.distance)
    if (distances[0].distance === Number.MAX_VALUE) return { closestCharacter: null, distance: Number.MAX_VALUE }
    return { closestCharacter: distances[0].character, distance: distances[0].distance }
  }

  enemyKilledBy (enemy, otherEntity) {
    const loot = getLootForEnemy(enemy)
    otherEntity.addLoot(loot)
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