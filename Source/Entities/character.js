import { SpriteSheets } from '../Globals/spriteSheetLoaderData.js'
import { Races, CharacterClasses } from '../Globals/characterAttributes.js'
import { CharacterType } from '../Keys/entityKeys.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import AnimationKeys from '../Keys/animationKeys.js'

export default class Character extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet(config.race, config.characterClass)
    const frame = 0
    const tempPosition = { x: 0, y: 0 }
    super(scene, tempPosition.x, tempPosition.y, spriteSheet, frame) // actual position will be set by the Level Scene

    this.scene = scene
    this.spriteSheet = spriteSheet
    this.entityType = CharacterType
    this.player = config.player
    this.race = config.race
    this.characterClass = config.characterClass
    this.gameManager = config.gameManager

    this.animationKeys = this.getAnimationKeys()
    this.animations = {
      idle: null,
      walk: null,
      attack1: null,
      attack2: null,
      injured: null,
      death: null,
      dead: null
    }

    this.buildAnimations()
    this.anims.play(this.animationKeys.idle, this)

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

  getAnimationKeys () {
    switch (this.race) {
      case Races.Elf: return this.getElvenAnimationKeys()
      case Races.Human: return this.getHumanAnimationKeys()
      case Races.Dwarf: return this.getDwarfAnimationKeys()
    }
  }

  getElvenAnimationKeys () {
    switch (this.characterClass) {
      case CharacterClasses.Warrior: return {
        idle: AnimationKeys.ElvenWarriorIdle,
        walk: AnimationKeys.ElvenWarriorWalk,
        attack1: AnimationKeys.ElvenWarriorAttack1,
        attack2: AnimationKeys.ElvenWarriorAttack2,
        injured: AnimationKeys.ElvenWarriorInjured,
        death: AnimationKeys.ElvenWarriorDeath,
        dead: AnimationKeys.ElvenWarriorDead
      }
      case CharacterClasses.Archer: return {
        idle: AnimationKeys.ElvenArcherIdle,
        walk: AnimationKeys.ElvenArcherWalk,
        attack1: AnimationKeys.ElvenArcherAttack1,
        attack2: AnimationKeys.ElvenArcherAttack2,
        injured: AnimationKeys.ElvenArcherInjured,
        death: AnimationKeys.ElvenArcherDeath,
        dead: AnimationKeys.ElvenArcherDead
      }
      case CharacterClasses.Cleric: return {
        idle: AnimationKeys.ElvenClericIdle,
        walk: AnimationKeys.ElvenClericWalk,
        attack1: AnimationKeys.ElvenClericAttack1,
        attack2: AnimationKeys.ElvenClericAttack2,
        injured: AnimationKeys.ElvenClericInjured,
        death: AnimationKeys.ElvenClericDeath,
        dead: AnimationKeys.ElvenClericDead
      }
      case CharacterClasses.Magi: return {
        idle: AnimationKeys.ElvenMagiIdle,
        walk: AnimationKeys.ElvenMagiWalk,
        attack1: AnimationKeys.ElvenMagiAttack1,
        attack2: AnimationKeys.ElvenMagiAttack2,
        injured: AnimationKeys.ElvenMagiInjured,
        death: AnimationKeys.ElvenMagiDeath,
        dead: AnimationKeys.ElvenMagiDead
      }
    }
  }

  getHumanAnimationKeys () {
    switch (this.characterClass) {
      case CharacterClasses.Warrior: return {
        idle: AnimationKeys.HumanWarriorIdle,
        walk: AnimationKeys.HumanWarriorWalk,
        attack1: AnimationKeys.HumanWarriorAttack1,
        attack2: AnimationKeys.HumanWarriorAttack2,
        injured: AnimationKeys.HumanWarriorInjured,
        death: AnimationKeys.HumanWarriorDeath,
        dead: AnimationKeys.HumanWarriorDead
      }
      case CharacterClasses.Archer: return {
        idle: AnimationKeys.HumanArcherIdle,
        walk: AnimationKeys.HumanArcherWalk,
        attack1: AnimationKeys.HumanArcherAttack1,
        attack2: AnimationKeys.HumanArcherAttack2,
        injured: AnimationKeys.HumanArcherInjured,
        death: AnimationKeys.HumanArcherDeath,
        dead: AnimationKeys.HumanArcherDead
      }
      case CharacterClasses.Cleric: return {
        idle: AnimationKeys.HumanClericIdle,
        walk: AnimationKeys.HumanClericWalk,
        attack1: AnimationKeys.HumanClericAttack1,
        attack2: AnimationKeys.HumanClericAttack2,
        injured: AnimationKeys.HumanClericInjured,
        death: AnimationKeys.HumanClericDeath,
        dead: AnimationKeys.HumanClericDead
      }
      case CharacterClasses.Magi: return {
        idle: AnimationKeys.HumanMagiIdle,
        walk: AnimationKeys.HumanMagiWalk,
        attack1: AnimationKeys.HumanMagiAttack1,
        attack2: AnimationKeys.HumanMagiAttack2,
        injured: AnimationKeys.HumanMagiInjured,
        death: AnimationKeys.HumanMagiDeath,
        dead: AnimationKeys.HumanMagiDead
      }
    }
  }

  getDwarvenAnimationKeys () {
    switch (this.characterClass) {
      case CharacterClasses.Warrior: return {
        idle: AnimationKeys.DwarvenWarriorIdle,
        walk: AnimationKeys.DwarvenWarriorWalk,
        attack1: AnimationKeys.DwarvenWarriorAttack1,
        attack2: AnimationKeys.DwarvenWarriorAttack2,
        injured: AnimationKeys.DwarvenWarriorInjured,
        death: AnimationKeys.DwarvenWarriorDeath,
        dead: AnimationKeys.DwarvenWarriorDead
      }
      case CharacterClasses.Archer: return {
        idle: AnimationKeys.DwarvenArcherIdle,
        walk: AnimationKeys.DwarvenArcherWalk,
        attack1: AnimationKeys.DwarvenArcherAttack1,
        attack2: AnimationKeys.DwarvenArcherAttack2,
        injured: AnimationKeys.DwarvenArcherInjured,
        death: AnimationKeys.DwarvenArcherDeath,
        dead: AnimationKeys.DwarvenArcherDead
      }
      case CharacterClasses.Cleric: return {
        idle: AnimationKeys.DwarvenClericIdle,
        walk: AnimationKeys.DwarvenClericWalk,
        attack1: AnimationKeys.DwarvenClericAttack1,
        attack2: AnimationKeys.DwarvenClericAttack2,
        injured: AnimationKeys.DwarvenClericInjured,
        death: AnimationKeys.DwarvenClericDeath,
        dead: AnimationKeys.DwarvenClericDead
      }
      case CharacterClasses.Magi: return {
        idle: AnimationKeys.DwarvenMagiIdle,
        walk: AnimationKeys.DwarvenMagiWalk,
        attack1: AnimationKeys.DwarvenMagiAttack1,
        attack2: AnimationKeys.DwarvenMagiAttack2,
        injured: AnimationKeys.DwarvenMagiInjured,
        death: AnimationKeys.DwarvenMagiDeath,
        dead: AnimationKeys.DwarvenMagiDead
      }
    }
  }

  buildAnimations () {
    this.animations.idle = this.scene.anims.get(this.animationKeys.idle)
    if (!this.animations.idle) {
      this.animations.idle = this.scene.anims.create({
        key: this.animationKeys.idle,
        frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.idle }),
        frameRate: 1,
        repeat: -1
      })
    }

    this.animations.walk = this.scene.anims.get(this.animationKeys.walk)
    if (!this.animations.walk) {
      this.animations.walk = this.scene.anims.create({
        key: this.animationKeys.walk,
        frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.walk }),
        frameRate: 8,
        repeat: -1
      })
    }

    this.animations.attack1 = this.scene.anims.get(this.animationKeys.attack1)
    if (!this.animations.attack1) {
      this.animations.attack1 = this.scene.anims.create({
        key: this.animationKeys.attack1,
        frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.attack1 }),
        frameRate: 8,
        repeat: -1
      })
    }

    // TODO: Need to add these frames to the sprite sheets
    // this.animations.attack2 = this.scene.anims.get(this.animationKeys.attack2)
    // if (!this.animations.attack2) {
    //   this.animations.attack2 = this.scene.anims.create({
    //     key: this.animationKeys.attack2,
    //     frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.attack2 }),
    //     frameRate: 8,
    //     repeat: -1
    //   })
    // }

    // this.animations.injured = this.scene.anims.get(this.animationKeys.injured)
    // if (!this.animations.injured) {
    //   this.animations.injured = this.scene.anims.create({
    //     key: this.animationKeys.injured,
    //     frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.injured }),
    //     frameRate: 1,
    //     repeat: -1
    //   })
    // }

    // this.animations.death = this.scene.anims.get(this.animationKeys.death)
    // if (!this.animations.death) {
    //   this.animations.death = this.scene.anims.create({
    //     key: this.animationKeys.death,
    //     frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.death }),
    //     frameRate: 8,
    //     repeat: 0
    //   })
    // }

    // this.animations.dead = this.scene.anims.get(this.animationKeys.dead)
    // if (!this.animations.dead) {
    //   this.animations.dead = this.scene.anims.create({
    //     key: this.animationKeys.dead,
    //     frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.dead }),
    //     frameRate: 1,
    //     repeat: -1
    //   })
    // }
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

    if (this.body.velocity.x > 0 && ((this.x + (this.width / 2)) >= (this.scene.cameras.main.scrollX + this.scene.cameras.main.width))) {
      this.body.velocity.x = 0
    } else if (this.body.velocity.x < 0 && ((this.x - (this.width / 2)) <= (this.scene.cameras.main.scrollX - this.scene.cameras.main.width))) {
      this.body.velocity.x = 0
    }

    if (this.body.velocity.y > 0 && ((this.y + (this.height / 2)) >= (this.scene.cameras.main.scrollY + this.scene.cameras.main.height))) {
      this.body.velocity.y = 0
    } else if (this.body.velocity.y < 0 && ((this.y - (this.height / 2)) <= (this.scene.cameras.main.scrollY - this.scene.cameras.main.height))) {
      this.body.velocity.y = 0
    }

    if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      this.anims.play(this.animationKeys.walk, this)
    } else {
      this.anims.play(this.animationKeys.idle, this)
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