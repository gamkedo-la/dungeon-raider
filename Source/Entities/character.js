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
      primary: null,
      secondary: null,
      injured: null,
      death: null,
      dead: null
    }

    this.buildAnimations()
    this.anims.play(this.animationKeys.idle, this)
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)

    // Set Input properties
    this.inputEvent = config.inputEvent
    if (this.inputEvent === InputEventKeys.onArrows || this.inputEvent === InputEventKeys.onWASD) {
      this.processInput = this.useKeyboardInput
    } else {
      this.processInput = this.useGamepadInput
    }
    this.inputManager = null // input manager will be set by the Level Scene
    this.primaryAttackCoolingDown = false
    this.secondaryAttackCoolingDown = false
    this.isAttacking = false

    this.attributes = config.attributes // see characterAttributes.js for the structure of this object
    if (this.characterClass !== CharacterClasses.Magi && this.characterClass !== CharacterClasses.Cleric) {
      this.attributes.magic = 0
    }

    this.maxHealth = this.attributes.health
    this.maxMagic = this.attributes.magic

    this.shouldBeDead = false
    this.isDead = false

    // Register for the 'update
    this.scene.events.on('update', this.update, this)
  }

  healthLoss () {
    this.attributes.health--
    if (this.attributes.health <= 0) {
      this.shouldBeDead = true
    } else {
      this.scene.time.delayedCall(this.attributes.healthLossRate, () => {
        this.healthLoss()
      })  
    }
  }

  magicRegen () {
    if (this.characterClass === CharacterClasses.Magi || this.characterClass === CharacterClasses.Cleric) {
      if (this.attributes.magic < this.maxMagic) {
        this.attributes.magic++
      }
      this.scene.time.delayedCall(this.attributes.magicRegen, () => {
        this.magicRegen()
      })
    } else {
      this.attributes.magic = 0
    }
  }

  getAnimationKeys () {
    switch (this.race) {
      case Races.Elven: return this.getElvenAnimationKeys()
      case Races.Human: return this.getHumanAnimationKeys()
      case Races.Dwarf: return this.getDwarfAnimationKeys()
    }
  }

  getElvenAnimationKeys () {
    switch (this.characterClass) {
      case CharacterClasses.Warrior: return {
        idle: AnimationKeys.ElvenWarriorIdle,
        walk: AnimationKeys.ElvenWarriorWalk,
        primary: AnimationKeys.ElvenWarriorPrimary,
        secondary: AnimationKeys.ElvenWarriorSecondary,
        injured: AnimationKeys.ElvenWarriorInjured,
        death: AnimationKeys.ElvenWarriorDeath,
        dead: AnimationKeys.ElvenWarriorDead
      }
      case CharacterClasses.Archer: return {
        idle: AnimationKeys.ElvenArcherIdle,
        walk: AnimationKeys.ElvenArcherWalk,
        primary: AnimationKeys.ElvenArcherPrimary,
        secondary: AnimationKeys.ElvenArcherSecondary,
        injured: AnimationKeys.ElvenArcherInjured,
        death: AnimationKeys.ElvenArcherDeath,
        dead: AnimationKeys.ElvenArcherDead
      }
      case CharacterClasses.Cleric: return {
        idle: AnimationKeys.ElvenClericIdle,
        walk: AnimationKeys.ElvenClericWalk,
        primary: AnimationKeys.ElvenClericPrimary,
        secondary: AnimationKeys.ElvenClericSecondary,
        injured: AnimationKeys.ElvenClericInjured,
        death: AnimationKeys.ElvenClericDeath,
        dead: AnimationKeys.ElvenClericDead
      }
      case CharacterClasses.Magi: return {
        idle: AnimationKeys.ElvenMagiIdle,
        walk: AnimationKeys.ElvenMagiWalk,
        primary: AnimationKeys.ElvenMagiPrimary,
        secondary: AnimationKeys.ElvenMagiSecondary,
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
        primary: AnimationKeys.HumanWarriorPrimary,
        secondary: AnimationKeys.HumanWarriorSecondary,
        injured: AnimationKeys.HumanWarriorInjured,
        death: AnimationKeys.HumanWarriorDeath,
        dead: AnimationKeys.HumanWarriorDead
      }
      case CharacterClasses.Archer: return {
        idle: AnimationKeys.HumanArcherIdle,
        walk: AnimationKeys.HumanArcherWalk,
        primary: AnimationKeys.HumanArcherPrimary,
        secondary: AnimationKeys.HumanArcherSecondary,
        injured: AnimationKeys.HumanArcherInjured,
        death: AnimationKeys.HumanArcherDeath,
        dead: AnimationKeys.HumanArcherDead
      }
      case CharacterClasses.Cleric: return {
        idle: AnimationKeys.HumanClericIdle,
        walk: AnimationKeys.HumanClericWalk,
        primary: AnimationKeys.HumanClericPrimary,
        secondary: AnimationKeys.HumanClericSecondary,
        injured: AnimationKeys.HumanClericInjured,
        death: AnimationKeys.HumanClericDeath,
        dead: AnimationKeys.HumanClericDead
      }
      case CharacterClasses.Magi: return {
        idle: AnimationKeys.HumanMagiIdle,
        walk: AnimationKeys.HumanMagiWalk,
        primary: AnimationKeys.HumanMagiPrimary,
        secondary: AnimationKeys.HumanMagiSecondary,
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
        primary: AnimationKeys.DwarvenWarriorPrimary,
        secondary: AnimationKeys.DwarvenWarriorSecondary,
        injured: AnimationKeys.DwarvenWarriorInjured,
        death: AnimationKeys.DwarvenWarriorDeath,
        dead: AnimationKeys.DwarvenWarriorDead
      }
      case CharacterClasses.Archer: return {
        idle: AnimationKeys.DwarvenArcherIdle,
        walk: AnimationKeys.DwarvenArcherWalk,
        primary: AnimationKeys.DwarvenArcherPrimary,
        secondary: AnimationKeys.DwarvenArcherSecondary,
        injured: AnimationKeys.DwarvenArcherInjured,
        death: AnimationKeys.DwarvenArcherDeath,
        dead: AnimationKeys.DwarvenArcherDead
      }
      case CharacterClasses.Cleric: return {
        idle: AnimationKeys.DwarvenClericIdle,
        walk: AnimationKeys.DwarvenClericWalk,
        primary: AnimationKeys.DwarvenClericPrimary,
        secondary: AnimationKeys.DwarvenClericSecondary,
        injured: AnimationKeys.DwarvenClericInjured,
        death: AnimationKeys.DwarvenClericDeath,
        dead: AnimationKeys.DwarvenClericDead
      }
      case CharacterClasses.Magi: return {
        idle: AnimationKeys.DwarvenMagiIdle,
        walk: AnimationKeys.DwarvenMagiWalk,
        primary: AnimationKeys.DwarvenMagiPrimary,
        secondary: AnimationKeys.DwarvenMagiSecondary,
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

    this.animations.primary = this.scene.anims.get(this.animationKeys.primary)
    if (!this.animations.primary) {
      this.animations.primary = this.scene.anims.create({
        key: this.animationKeys.primary,
        frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.primary }),
        frameRate: 8,
        repeat: 0
      })
    }

    // TODO: Need to add these frames to the sprite sheets
    // this.animations.secondary = this.scene.anims.get(this.animationKeys.secondary)
    // if (!this.animations.secondary) {
    //   this.animations.secondary = this.scene.anims.create({
    //     key: this.animationKeys.secondary,
    //     frames: this.anims.generateFrameNumbers(this.spriteSheet, { frames: AnimationKeys.FrameKeys.secondary }),
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

    this.updateAnimationsIfRequired()
    this.updateFacingDirectionIfRequired()

    this.body.setVelocity(0, 0)
  }

  updateAnimationsIfRequired () {
    if (!this.isAttacking) {
      if ((this.body.velocity.x !== 0 || this.body.velocity.y !== 0)) {
        this.anims.play(this.animationKeys.walk, true)
      } else if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.anims.play(this.animationKeys.idle, true)
      }
    }
  }

  updateFacingDirectionIfRequired () {
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) return

    const angle = (Math.PI / 2) + Phaser.Math.Angle.Between(0, 0, this.body.velocity.x, this.body.velocity.y)
    this.angle = Phaser.Math.RadToDeg(angle)
  }

  setInputManager (inputManager) {
    this.inputManager = inputManager
    this.inputManager.registerForEvent(this.inputEvent, this.processInput, this)
  }

  levelDidStart () {
    this.scene.time.delayedCall(this.attributes.healthLossRate, () => {
      this.healthLoss()
    })
    if (this.characterClass === CharacterClasses.Magi || this.characterClass === CharacterClasses.Cleric) {
      this.scene.time.delayedCall(this.attributes.magicRegen, () => {
        this.magicRegen()
      })
    }
  }

  animationComplete (animation, frame) {
    if (animation.key === this.animationKeys.primary) {
      this.isAttacking = false
      this.anims.play(this.animationKeys.idle, true)
    } else if (animation.key === this.animationKeys.secondary) {
      this.isAttacking = false
      this.anims.play(this.animationKeys.idle, true)
    }
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

    if (this.body.velocity.x !== 0 && this.body.velocity.y !== 0) {
      // 0.7071 is the sine/cosine of 45 degrees
      this.body.velocity.x *= 0.7071
      this.body.velocity.y *= 0.7071
    }

    if (event.primary.isDown && !this.primaryAttackCoolingDown) {
      this.body.velocity.x = 0
      this.body.velocity.y = 0
      this.isAttacking = true
      this.primaryAttackCoolingDown = true
      this.scene.time.delayedCall(this.attributes.attackCooldown, () => {
        this.primaryAttackCoolingDown = false
      })
      this.anims.play(this.animationKeys.primary, false)
    }

    if (event.secondary.isDown && !this.secondaryAttackCoolingDown) {
      this.body.velocity.x = 0
      this.body.velocity.y = 0
      this.isAttacking = true
      this.secondaryAttackCoolingDown = true
      this.scene.time.delayedCall(this.attributes.attackCooldown, () => {
        this.secondaryAttackCoolingDown = false
      })
      // TODO: Restore this once there actually is a secondary attack animation
      // this.anims.play(this.animationKeys.secondary, false)
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
    case Races.Elven:
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