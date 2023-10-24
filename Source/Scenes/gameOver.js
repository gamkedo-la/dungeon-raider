import { GameOverKey } from "../Keys/sceneKeys.js"

class GameOver extends Phaser.Scene {
  constructor () {
    super(GameOverKey)
  }

  preload () {

  }

  create () {
    // TODO: Build Game Over Scene including the Menu:
    // 1. Game Over Title
    // 2. Menu Options (Continue, Restart, Quit, Credits)
    // Continue -> all Characters resurrected at half stats and launch straight into last level attempted
    // Restart -> All Characters resurrected at full stats and launch into Level 1
    // Quit -> Return to Title Screen (all Characters wiped)
    // Credits -> Display Credits (also wipe all Characters)
  }

  update (time, delta) {

  }
}

export default GameOver