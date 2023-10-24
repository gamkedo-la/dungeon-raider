import { CharacterCreateKey, Level1Key } from "../Keys/sceneKeys.js"
import { getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/character.js"
import InputEventKeys from "../Keys/inputEventKeys.js"

class CharacterCreate extends Phaser.Scene {
  constructor () {
    super(CharacterCreateKey)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.playerCount = 1
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.inputManager = new InputManager(this, this.gameManager)

    this.playerCount = this.gameManager.getPlayerCount()

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    // TODO: Divide the screen into 4 columns, one for each player, dim or fade out the columns that are not active
    // TODO: Each player chooses a Race and a Character Class for their character and then presses Enter/Return/X to confirm
  }

  update (time, delta) {
    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }
  }

  processInput (event) {
    const activePlayer = this.gameManager.getPlayerForInputOption(event)
    // TODO: When each Player selects a Race, update the Game Manager (this.gameManager.setPlayerRace())
    // this.gameManager.setCharacterRaceForPlayer(activePlayer, selectedRace)

    // TODO: When each Player selects a Character Class, update the Game Manager (this.gameManager.setPlayerClass())
    // this.gameManager.setCharacterClassForPlayer(activePlayer, selectedCharacterClass)

    // TODO: When each Player confirms, create their character and add its serializable attributes to the gameManager
    const attributes = this.gameManager.getCharacterAttributesForPlayer(activePlayer)
    const character = (new Character(this, {
      attributes,
      player: activePlayer,
      race: this.gameManager.getCharacterRaceForPlayer(activePlayer),
      characterClass: this.gameManager.getCharacterClassForPlayer(activePlayer),
      gameManager: this.gameManager,
      inputEvent: this.gameManager.getInputEventForPlayer(activePlayer)
    }))
    character.serialize()
    
    // TODO: When all players have confirmed, transition to the Level 1 Scene
    this.scene.start(Level1Key)
    this.scene.remove(CharacterCreateKey)
  }
}

export default CharacterCreate