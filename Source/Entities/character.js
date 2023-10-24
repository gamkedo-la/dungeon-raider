import { SpriteSheets } from '../Globals/spriteSheetLoaderData.js'
import { Races, CharacterClasses } from '../Globals/characterAttributes.js'

export default class Character extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const texture = getSpriteSheet(config.race, config.characterClass)
    const frame = 0
    const tempPosition = { x: 0, y: 0 }
    super(scene, tempPosition.x, tempPosition.y, texture, frame) // actual position will be set by the Level Scene

    this.scene = scene
    this.player = config.player
    this.race = config.race
    this.characterClass = config.characterClass
    this.gameManager = config.gameManager
    this.inputManager = null // input manager will be set by the Level Scene
    this.inputEvent = config.inputEvent

    this.attributes = config.attributes // see characterAttributes.js for the structure of this object

    this.shouldBeDead = false
    this.isDead = false
  }

  preupdate (time, delta) {
    super.preupdate(time, delta)
    
    // TODO: Update the Character's position based on the results of 'processInput' which will not necessarily be called at a convenient time
  }

  processInput (event) {
    console.log(event)
  }

  postupdate () {
    if (this.isDead) return

    super.postupdate()

    // TODO: May need to do some work here, updating health or other stats, though that may be handled elsewhere when collisions occur
    // TODO: This is a good place to check if the character has died and take dead character actions if so
    if (this.shouldBeDead) {
      characterDied(this)
    }
  }

  setInputManager (inputManager) {
    this.inputManager = inputManager
    this.inputManager.registerForEvent(this.inputEvent, this.processInput, this)
  }

  serialize () {
    // this function records all information about the character that needs to be saved to the Game Manager in order to restore the character in the next scene
    this.gameManager.setCharacterRaceForPlayer(this.player, this.race)
    this.gameManager.setCharacterClassForPlayer(this.player, this.characterClass)
    this.gameManager.setCharacterAttributesForPlayer(this.player, this.attributes)
    // this.gameManager.setCharacterMagicForPlayer(this.player, this.magic)
  }
}

function getSpriteSheet (race, characterClass) {
  switch (race) {
    case Races.Human:
      switch (characterClass) {
        case CharacterClasses.Warrior:
          return SpriteSheets.HumanWarrior
        case CharacterClasses.Archer:
          return SpriteSheets.HumanArcher
        case CharacterClasses.Magi:
          return SpriteSheets.HumanMagi
        case CharacterClasses.Cleric:
          return SpriteSheets.HumanCleric
      }
    case Races.Elf:
      switch (characterClass) {
        case CharacterClasses.Warrior:
          return SpriteSheets.ElvenWarrior
        case CharacterClasses.Archer:
          return SpriteSheets.ElvenArcher
        case CharacterClasses.Magi:
          return SpriteSheets.ElvenMagi
        case CharacterClasses.Cleric:
          return SpriteSheets.ElvenCleric
      }
    case Races.Dwarf:
      switch (characterClass) {
        case CharacterClasses.Warrior:
          return SpriteSheets.DwarvenWarrior
        case CharacterClasses.Archer:
          return SpriteSheets.DwarvenArcher
        case CharacterClasses.Magi:
          return SpriteSheets.DwarvenMagi
        case CharacterClasses.Cleric:
          return SpriteSheets.DwarvenCleric
      }
  }
}

function characterDied (character) {
  console.log(`${character.player} died!`)
}