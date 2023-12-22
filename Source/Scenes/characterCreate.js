import { getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/character.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from "../Keys/inputEventKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import SceneKeys from "../Keys/sceneKeys.js"
import UIAttributes from "../Globals/uiAttributes.js"
import FontLabel from "../UIElements/fontLabel.js"
import Debug from "../Globals/debug.js"
import { InterLevelCharacterPane } from "../Keys/imageKeys.js"

class CharacterCreate extends Phaser.Scene {
  constructor () {
    super(SceneKeys.CharacterCreate)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.playerCount = 1
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.input.gamepad.on(Phaser.Input.Gamepad.Events.CONNECTED, pad => {
      console.log('Gamepad connected:', pad)
    })
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.inputManager = new InputManager(this, this.gameManager)

    this.playerCount = this.gameManager.getPlayerCount()

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    // TODO: Divide the screen into 4 columns, one for each player, dim or fade out the columns that are not active
    const player1Frame = this.add.image(0, 0, InterLevelCharacterPane)
    player1Frame.setPosition(player1Frame.width / 2, this.game.canvas.height / 2)
    const player2Frame = this.add.image(player1Frame.x + player1Frame.width, this.game.canvas.height / 2, InterLevelCharacterPane)
    const player3Frame = this.add.image(player2Frame.x + player1Frame.width, this.game.canvas.height / 2, InterLevelCharacterPane)
    const player4Frame = this.add.image(player3Frame.x + player1Frame.width, this.game.canvas.height / 2, InterLevelCharacterPane)

    // TODO: Each player chooses a Character Type (Elf, Human, Dwarf) and a Character Class (Warrior, Archer, Magi, Cleric) for their character
    // and then presses Enter/Return/X to confirm

    // TODO: Temporary until this scene has been implemented
    new FontLabel(this, {
      x: this.game.canvas.width / 2 - 200,
      y: this.game.canvas.height / 2,
      title: '[Character Create] Press Any Control Key (WASD or Arrows) to Continue',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor
    })
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  processInput (event) {
    for (const eventKey in event) {
      if (event[eventKey].isDown) {
        this.gameManager.goToLevel(SceneKeys.Level1)
        this.scene.stop(SceneKeys.CharacterCreate)
      }
    }

    // const activePlayer = this.gameManager.getPlayerForInputOption(event)
    // // TODO: When each Player selects a Race, update the Game Manager (this.gameManager.setPlayerRace())
    // // this.gameManager.setCharacterRaceForPlayer(activePlayer, selectedRace)

    // // TODO: When each Player selects a Character Class, update the Game Manager (this.gameManager.setPlayerClass())
    // // this.gameManager.setCharacterClassForPlayer(activePlayer, selectedCharacterClass)

    // // TODO: When each Player confirms, create their character and add its serializable attributes to the gameManager
    // const attributes = this.gameManager.getCharacterAttributesForPlayer(activePlayer)
    // const character = (new Character(this, {
    //   attributes,
    //   player: activePlayer,
    //   race: this.gameManager.getCharacterRaceForPlayer(activePlayer),
    //   characterClass: this.gameManager.getCharacterClassForPlayer(activePlayer),
    //   gameManager: this.gameManager,
    //   inputEvent: this.gameManager.getInputEventForPlayer(activePlayer)
    // }))
    // character.serialize()
    
    // // TODO: When all players have confirmed, transition to the Level 1 Scene
    // this.scene.start(SceneKeys.Level1)
    // this.scene.stop(SceneKeys.CharacterCreate)
  }
}

export default CharacterCreate