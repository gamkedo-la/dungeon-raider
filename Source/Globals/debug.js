import { Races, CharacterClasses } from "./characterAttributes.js"
import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import SceneKeys from "../Keys/sceneKeys.js"

// Skip the title scene and character create scene
export const SkipTitleScene = true
export const SkipCharacterCreateScene = true

// How many characters to create if skipping the character create scene
export const DefaultCharacterCount = 2

// Character attributes if skipping the character create scene
export const Player1Race  = Races.Elven
export const Player1Class = CharacterClasses.Warrior
export const Player1Input = InputOptionsKeys.Arrows

export const Player2Race = Races.Human
export const Player2Class = CharacterClasses.Archer
export const Player2Input = InputOptionsKeys.Gamepad1

export const Player3Race = Races.Dwarven
export const Player3Class = CharacterClasses.Magi
export const Player3Input = InputOptionsKeys.Gamepad2

export const Player4Race = Races.Human
export const Player4Class = CharacterClasses.Cleric
export const Player4Input = InputOptionsKeys.Gamepad3

// Which level to load
export const LevelToLoad = SceneKeys.Level1

const Debug = {
  SkipTitleScene,
  SkipCharacterCreateScene,

  DefaultCharacterCount,
  Player1Race,
  Player1Class,
  Player1Input,
  Player2Race,
  Player2Class,
  Player2Input,
  Player3Race,
  Player3Class,
  Player3Input,
  Player4Race,
  Player4Class,
  Player4Input,

  LevelToLoad
}

export default Debug