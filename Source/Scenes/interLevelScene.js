import SceneKeys from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import { InterLevelCharacterPane } from "../Keys/imageKeys.js"

class InterLevel extends Phaser.Scene {
  constructor () {
    super(SceneKeys.InterLevel)

    this.gameManager = null // can't create this until the scene is initialized => in create()
    this.inputManager = null // can't create this until the scene is initialized => in create()
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

    const player1Frame = this.add.image(0, 0, InterLevelCharacterPane)
    player1Frame.setPosition(player1Frame.width / 2, this.game.canvas.height / 2)
    const player2Frame = this.add.image(player1Frame.x + player1Frame.width, this.game.canvas.height / 2, InterLevelCharacterPane)
    const player3Frame = this.add.image(player2Frame.x + player1Frame.width, this.game.canvas.height / 2, InterLevelCharacterPane)
    const player4Frame = this.add.image(player3Frame.x + player1Frame.width, this.game.canvas.height / 2, InterLevelCharacterPane)

    const activePlayers = this.gameManager.getActivePlayers()
    for (const activePlayer of activePlayers) {
      const attributes = this.gameManager.getCharacterAttributesForPlayer(activePlayer)
      attributes.health = Math.ceil((attributes.maxHealth - attributes.health) / 2)
      attributes.magic = Math.ceil((attributes.maxMagic - attributes.magic) / 2)
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