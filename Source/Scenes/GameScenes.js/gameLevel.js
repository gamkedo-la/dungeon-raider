import { GameLevelKey, GameOverKey, GameCompleteKey } from "../../Keys/sceneKeys.js"
import MapManager from "../../Managers/mapManager.js"
import Character from "../../Entities/character.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../../Keys/playerPropertyKeys.js"
import { Races, CharacterClasses } from "../../Globals/characterAttributes.js"
import { GameManagerKey } from "../../Managers/gameManager.js"
import InputManager from '../../Managers/inputManager.js'

class GameLevel extends Phaser.Scene {
  constructor (sceneKey, mapKey) {
    super(sceneKey || GameLevelKey)
    this.mapKey = mapKey
    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.mapManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.players = []
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.mapManager = new MapManager(this, this.mapKey)
    this.inputManager = new InputManager(this, this.gameManager)

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

      this.physics.add.existing(character)
      this.add.existing(character)
      character.setInputManager(this.inputManager)
    }
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
    // Do NOT 'update' Sprites or other Game Objects. Sprites have preUpdate() and postUpdate() methods for that.
    // Updating Game Objects can make it hard or impossible to predict what the state
    // of the Game Object is when this method fires.

  }
}

export default GameLevel