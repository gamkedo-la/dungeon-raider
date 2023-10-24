import Preloader from './Source/Scenes/preloader.js'
import Title from './Source/Scenes/title.js'
import Credits from './Source/Scenes/credits.js'
import Options from './Source/Scenes/options.js'
import CharacterCreate from './Source/Scenes/characterCreate.js'
import GameLevel from './Source/Scenes/GameScenes.js/gameLevel.js'
import Level1 from './Source/Scenes/GameScenes.js/level1.js'
import Level2 from './Source/Scenes/GameScenes.js/level2.js'
import Level3 from './Source/Scenes/GameScenes.js/level3.js'
import GameOver from './Source/Scenes/gameOver.js'
import GameComplete from './Source/Scenes/gameComplete.js'
import UserInterface from './Source/Scenes/UIScene.js'

const scenes = [
  Preloader,
  Title,
  Credits,
  Options,
  CharacterCreate,
  GameLevel,
  Level1,
  Level2,
  Level3,
  GameOver,
  GameComplete,
  UserInterface
]

const Game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 450,
  scene: scenes,
  physics: {
    default: 'arcade'
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