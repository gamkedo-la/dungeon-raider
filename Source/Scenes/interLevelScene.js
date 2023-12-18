import SceneKeys from "../Keys/sceneKeys.js"
import Level1 from "./GameScenes.js/level1.js"
import Level2 from "./GameScenes.js/level2.js"
import Level3 from "./GameScenes.js/level3.js"
// Add more level imports here as we create them
import { GameManagerKey } from "../Managers/gameManager.js"
import InputManager from '../Managers/inputManager.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"

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
          // this.scene.start(destinationLevelKey)
          this.scene.add(destinationLevelKey, buildLevelForKey(destinationLevelKey), true)
          this.scene.stop(this.scene.key)
        } else {
          console.warn('InterLevel.processInput: destinationLevelKey is not set')
        }
      }
    }
  }
}

export default InterLevel

function buildLevelForKey (key) {
  switch (key) {
    case SceneKeys.Level1:
      return new Level1()
    case SceneKeys.Level2:
      return new Level2()
    case SceneKeys.Level3:
      return new Level3()
    default:
      console.warn(`buildLevelForKey: Invalid Level Key: ${key}. See interLevelScene.js`)
      return null
  }
}