import SceneKeys from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import { InterLevelCharacterPane, MissingPlayerShadow } from "../Keys/imageKeys.js"

class InterLevel extends Phaser.Scene {
  constructor () {
    super(SceneKeys.InterLevel)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
    this.characterCount = 1
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.inputManager = new InputManager(this, this.gameManager)

    for (const inputEvent in InputEventKeys) {
      this.inputManager.registerForEvent(inputEvent, this.processInput, this)
    }

    this.characterCount = this.gameManager.getCharacterCount()
    this.buildCharacterFrames()

    const activePlayers = this.gameManager.getActivePlayers()
    for (const activePlayer of activePlayers) {
      const attributes = this.gameManager.getCharacterAttributesForPlayer(activePlayer)
      attributes.health = attributes.health + Math.ceil((attributes.maxHealth - attributes.health) / 2)
      attributes.magic = attributes.magic + Math.ceil((attributes.maxMagic - attributes.magic) / 2)
      this.gameManager.setCharacterAttributesForPlayer(activePlayer, attributes)
    }

    // TODO: Temporary until this scene has been implemented
    new FontLabel(this, {
      x: this.game.canvas.width / 2 - 200,
      y: this.game.canvas.height / 2,
      title: 'Press Any Control Key (WASD or Arrows) to Continue',
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor
    })

    // TODO: Build the Inter-Level screen, including:
    // 1. Next Dungeon Level [Number or Title]
    // 2. Current character stats (HP, MP, etc.)
    // 3. Current character equipment (Weapon, Armor, etc.)
    // 4. Resurrect characters (if necessary) with half HP/MP etc.
    // 5. A audio & visual indications of when/which Players have confirmed their readiness to continue
  }

  buildCharacterFrames () {
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
    // TODO: Update audio & visual indications of which Players have cnfirmed their readiness to continue
    // TODO: When all Players have confirmed, transition to the next Dungeon Level
    for (const eventKey in event) {
      if (event[eventKey].isDown) {
        const destinationLevelKey = this.gameManager.getDestinationLevelKey()
        if (destinationLevelKey) {
          this.gameManager.goToLevel(destinationLevelKey)
          this.scene.remove(this.scene.key)
        } else {
          console.warn('InterLevel.processInput: destinationLevelKey is not set')
        }
      }
    }
  }
}

export default InterLevel