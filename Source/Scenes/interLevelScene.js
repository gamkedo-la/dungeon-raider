import SceneKeys from "../Keys/sceneKeys"

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

    // TODO: Build the Inter-Level screen, including:
    // 1. Next Dungeon Level [Number or Title]
    // 2. Current character stats (HP, MP, etc.)
    // 3. Current character equipment (Weapon, Armor, etc.)
    // 4. Resurrect characters (if necessary) with half HP/MP etc.
    // 5. A audio & visual indications of when/which Players have confirmed their readiness to continue
  }

  update (time, delta) {

  }

  processInput (event) {
    // TODO: Update audio & visual indications of which Players have cnfirmed their readiness to continue
    // TODO: When all Players have confirmed, transition to the next Dungeon Level
    console.log(event)
  }
}

export default InterLevel