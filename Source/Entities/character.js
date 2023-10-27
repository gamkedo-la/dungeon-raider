import { SpriteSheets } from '../Globals/spriteSheetLoaderData.js'
import { Races, CharacterClasses } from '../Globals/characterAttributes.js'
import { CharacterType } from '../Keys/entityKeys.js'
import InputEventKeys from '../Keys/inputEventKeys.js'

export default class Character extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const texture = getSpriteSheet(config.race, config.characterClass)
    const frame = 0
    const tempPosition = { x: 0, y: 0 }
    super(scene, tempPosition.x, tempPosition.y, texture, frame) // actual position will be set by the Level Scene

    this.scene = scene
    this.entityType = CharacterType
    this.player = config.player
    this.race = config.race
    this.characterClass = config.characterClass
    this.gameManager = config.gameManager

    // Set Input properties
    this.inputEvent = config.inputEvent
    if (this.inputEvent === InputEventKeys.onArrows || this.inputEvent === InputEventKeys.onWASD) {
      this.processInput = this.useKeyboardInput
    } else {
      this.processInput = this.useGamepadInput
    }
    this.inputManager = null // input manager will be set by the Level Scene

    this.attributes = config.attributes // see characterAttributes.js for the structure of this object

    this.shouldBeDead = false
    this.isDead = false

    // Register for the 'update
    this.scene.events.on('update', this.update, this)
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta)

    // Do stuff each game step before the physics/collision simulation
  }

  update (time, delta) {
    // There is no guarantee regarding whether the physics/collision simulation has occurred before or after this update function is called
    if (this.isDead) return

    if (this.shouldBeDead) {
      characterDied(this)
      return
    }

    this.body.setVelocity(0, 0)
  }

  setInputManager (inputManager) {
    this.inputManager = inputManager
    this.inputManager.registerForEvent(this.inputEvent, this.processInput, this)
  }

  didCollideWith (otherEntity) {
    // Don't call destroy() here. Instead, set the "this.shouldBeDead" flag that will be checked in the update() function
    switch (otherEntity.entityType) {
      // case CharacterType:
      //   this.shouldBeDead = true
      //   break
      default:
        console.log(`Character.didCollideWith: ${this.player} collided with ${otherEntity.entityType}`)
        break
    }
  }

  useKeyboardInput (event) {
    if (event.right.isDown) {
      if (event.left.isDown) {
        this.body.velocity.x = 0
      } else {
        this.body.velocity.x = this.attributes.runSpeed
      }
    } else if (event.left.isDown) {
      if (event.right.isDown) {
        this.body.velocity.x = 0
      } else {
        this.body.velocity.x = -this.attributes.runSpeed
      }
    } else {
      this.body.velocity.x = 0
    }
  
    if (event.up.isDown) {
      if (event.down.isDown) {
        this.body.velocity.y = 0
      } else {
        this.body.velocity.y = -this.attributes.runSpeed
      }
    }
  
    if (event.down.isDown) {
      if (event.up.isDown) {
        this.body.velocity.y = 0
      } else {
        this.body.velocity.y = this.attributes.runSpeed
      }
    }
  }
  
  useGamepadInput (event) {
    // TODO: Need to implement this
  }

  serialize () {
    // this function records all information about the character that needs to be saved to the Game Manager in order to restore the character in the next scene
    this.gameManager.setCharacterRaceForPlayer(this.player, this.race)
    this.gameManager.setCharacterClassForPlayer(this.player, this.characterClass)
    this.gameManager.setCharacterAttributesForPlayer(this.player, this.attributes)
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
  character.isDead = true
  character.destroy() // when destroy() returns, this GameObject no longer has a scene (character.scene === null) and many things will be broken if we try to do anything else with this GameObject
}