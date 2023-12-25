import { CharacterClasses, Races, getCharacterAttributes } from "../Globals/characterAttributes.js"
import Character from "../Entities/Characters/character.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from "../Keys/inputEventKeys.js"
import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import SceneKeys from "../Keys/sceneKeys.js"
import UIAttributes from "../Globals/uiAttributes.js"
import FontLabel from "../UIElements/fontLabel.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import { InterLevelCharacterPane, MissingPlayerShadow } from "../Keys/imageKeys.js"
import Debug from "../Globals/debug.js"

class CharacterCreate extends Phaser.Scene {
  constructor () {
    super(SceneKeys.CharacterCreate)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.characterCount = 1
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
    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    this.characterCount = this.gameManager.getCharacterCount()
    this.buildCharacterFrames()

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

  buildCharacterFrames () {
    // TODO: Divide the screen into 4 columns, one for each player, dim or fade out the columns that are not active

    const frameData = this.buildFrameForPlayer(0, 0, 'Player 1', UIAttributes.Player1Color)
    const player1Frame = frameData.frame
    const player1Label = frameData.label
    player1Frame.setPosition(player1Frame.width / 2, this.game.canvas.height / 2)
    player1Label.x += player1Frame.x

    const player2Frame = this.buildFrameForPlayer(player1Frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 2', UIAttributes.Player2Color, this.characterCount < 2)
    const player3Frame = this.buildFrameForPlayer(player2Frame.frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 3', UIAttributes.Player3Color, this.characterCount < 3)
    const player4Frame = this.buildFrameForPlayer(player3Frame.frame.x + player1Frame.width, this.game.canvas.height / 2, 'Player 4', UIAttributes.Player4Color, this.characterCount < 4)
  }

  buildFrameForPlayer (x, y, title, color, missing = false) {
    const frame = this.add.image(x, y, InterLevelCharacterPane)

    const labelWidth = 40
    const playerLabelY = 30

    const label = new FontLabel(this, {
      x: frame.x - labelWidth,
      y: playerLabelY,
      title: title,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color
    })

    if (missing) {
      const shadow = this.add.image(frame.x, frame.y, MissingPlayerShadow)
      shadow.depth = 100
    }

    return { frame, label }
  }

  update (time, delta) {
    this.inputManager.update(time, delta)
  }

  processInput (event) {
    for (const eventKey in event) {
      if (event[eventKey].isDown) {
        createPlayer1Character(this, this.gameManager)
        // TODO: Player 1 isn't locked to Arrow keys. This scene needs to be updated to allow each player to select their input option
        this.gameManager.setActivePlayer(Player1Keys.Player, InputOptionsKeys.Arrows, true)

        if (this.characterCount > 1) {
          createPlayer2Character(this, this.gameManager)
          // TODO: Player 2 isn't locked to Gamepad 1. This scene needs to be updated to allow each player to select their input option
          this.gameManager.setActivePlayer(Player2Keys.Player, InputOptionsKeys.Gamepad1, true)
        }

        if (this.characterCount > 2) {
          createPlayer3Character(this, this.gameManager)
          // TODO: Player 3 isn't locked to Gamepad 2. This scene needs to be updated to allow each player to select their input option
          this.gameManager.setActivePlayer(Player3Keys.Player, InputOptionsKeys.Gamepad2, true)
        }

        if (this.characterCount > 3) {
          createPlayer4Character(this, this.gameManager)
          // TODO: Player 4 isn't locked to Gamepad 3. This scene needs to be updated to allow each player to select their input option
          this.gameManager.setActivePlayer(Player4Keys.Player, InputOptionsKeys.Gamepad3, true)
        }

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

export default CharacterCreate