import Preloader from './Source/Scenes/preloader.js'
import Credits from './Source/Scenes/credits.js'
import Options from './Source/Scenes/options.js'
import CharacterCreate from './Source/Scenes/characterCreate.js'
import GameOver from './Source/Scenes/gameOver.js'
import GameComplete from './Source/Scenes/gameComplete.js'
import UserInterface from './Source/Scenes/uiScene.js'

const scenes = [
  Preloader,
  Credits,
  Options,
  CharacterCreate,
  GameOver,
  GameComplete,
  UserInterface
]

const Game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 1600,
  height: 900,
  scene: scenes,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      tileBias: 32
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    keyboard: true,
    gamepad: true
  },
  pixelArt: true
})

export default Game
