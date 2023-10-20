import { GameLevelKey, GameOverKey, GameCompleteKey } from "../../Keys/sceneKeys.js"
import MapManager from "../../Managers/mapManager.js"
import Character from "../../Entities/character.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../../Keys/playerPropertyKeys.js"
import { Races, CharacterClasses } from "../../Globals/characterAttributes.js"
import { GameManagerKey } from "../../Managers/gameManager.js"

class GameLevel extends Phaser.Scene {
  constructor (sceneKey, mapKey) {
    super(sceneKey || GameLevelKey)
    this.mapKey = mapKey
    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.mapManager = null // can't create this until the scene is initialized => in create()
    this.players = []
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.mapManager = new MapManager(this, this.mapKey)
    this.players.push(new Character(this, {
      player: Player1Keys.Player,
      x: this.mapManager.player1Spawn.x,
      y: this.mapManager.player1Spawn.y,
      race: this.gameManager.getPlayerRace(Player1Keys.Player),
      characterClass: this.gameManager.getPlayerClass(Player1Keys.Player)
    }))
  }

  update (time, delta) {
    // Do NOT 'update' Sprites or other Game Objects. Sprites have preUpdate() and postUpdate() methods for that.
    // Updating Game Objects can make it hard or impossible to predict what the state
    // of the Game Object is when this method fires.

  }
}

export default GameLevel