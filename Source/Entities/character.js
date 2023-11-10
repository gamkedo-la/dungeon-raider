import { CharacterSpriteSheets } from '../Globals/characterSpriteSheetLoaderData.js'
import { Races, CharacterClasses } from '../Globals/characterAttributes.js'
import EntityTypes from '../Globals/entityTypes.js'
import InputEventKeys from '../Keys/inputEventKeys.js'
import CharacterAnimations from '../Keys/characterAnimationKeys.js'

export default class Character extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet(config.race, config.characterClass)
    const frame = 0
    const tempPosition = { x: 0, y: 0 }
    super(scene, tempPosition.x, tempPosition.y, spriteSheet, frame) // actual position will be set by the Level Scene

    this.scene = scene
    this.spriteSheet = spriteSheet
    this.entityType = EntityTypes.Character
    this.player = config.player
    this.race = config.race
    this.characterClass = config.characterClass
    this.gameManager = config.gameManager

    this.animations = {}

    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)

    // Set Input properties
    this.inputEvent = config.inputEvent
    if (this.inputEvent === InputEventKeys.onArrows || this.inputEvent === InputEventKeys.onWASD) {
      this.processInput = this.useKeyboardInput
    } else {
      this.processInput = this.useGamepadInput
    }
    this.lastPosition = new Phaser.Math.Vector2(this.x, this.y)
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

  buildAnimations () {
    const animationsProps = CharacterAnimations[`${this.race}${this.characterClass}`]
    for (const animationProps in animationsProps) {
      this.animations[animationProps] = this.scene.anims.get(`${this.player}-${animationsProps[animationProps].key}`)
    }
  }

  preUpdate (time, delta) {
    // this.lastPosition.x = this.x
    // this.lastPosition.y = this.y

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

    this.lastPosition.x = this.x
    this.lastPosition.y = this.y

    this.body.setVelocity(0, 0)
  }

  updateAnimationsIfRequired () {
    if (!this.isAttacking) {
      if ((this.body.velocity.x !== 0 || this.body.velocity.y !== 0)) {
        this.anims.play(this.animations.walk, true)
      } else if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.anims.play(this.animations.idle, true)
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
    if (animation.key === this.animations.primary.key) {
      this.isAttacking = false
      this.anims.play(this.animations.idle, true)
    } else if (animation.key === this.animations.secondary.key) {
      this.isAttacking = false
      this.anims.play(this.animations.idle, true)
    }
  }

  didCollideWith (otherEntity) {
    // Don't call destroy() here. Instead, set the "this.shouldBeDead" flag that will be checked in the update() function
    if (EntityTypes.isEnemy(otherEntity)) {
      // If we can hurt this enemy with our body, then do that here. The enemy will call "takeDamage" on us if it can hurt us with its body
    } else if (otherEntity.entityType === EntityTypes.Tile) {
      // hit a tile
    } else if (otherEntity.entityType === EntityTypes.Character) {
      // hit another character
    }
  }

  takeDamage (damage) {
    this.attributes.health -= damage
    if (this.attributes.health <= 0) {
      this.shouldBeDead = true
    }
  }

  addLoot (loot) {
    const lootType = Object.keys(loot)[0]
    this.attributes.loot[lootType] += loot[lootType]
  }

  useKeyboardInput (event) {
    if (this.isDead) return
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
      this.anims.play(this.animations.primary, false)
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
      // this.anims.play(this.animations.secondary, false)
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
          return CharacterSpriteSheets.HumanWarrior
        case CharacterClasses.Archer:
          return CharacterSpriteSheets.HumanArcher
        case CharacterClasses.Magi:
          return CharacterSpriteSheets.HumanMagi
        case CharacterClasses.Cleric:
          return CharacterSpriteSheets.HumanCleric
      }
    case Races.Elven:
      switch (characterClass) {
        case CharacterClasses.Warrior:
          return CharacterSpriteSheets.ElvenWarrior
        case CharacterClasses.Archer:
          return CharacterSpriteSheets.ElvenArcher
        case CharacterClasses.Magi:
          return CharacterSpriteSheets.ElvenMagi
        case CharacterClasses.Cleric:
          return CharacterSpriteSheets.ElvenCleric
      }
    case Races.Dwarven:
      switch (characterClass) {
        case CharacterClasses.Warrior:
          return CharacterSpriteSheets.DwarvenWarrior
        case CharacterClasses.Archer:
          return CharacterSpriteSheets.DwarvenArcher
        case CharacterClasses.Magi:
          return CharacterSpriteSheets.DwarvenMagi
        case CharacterClasses.Cleric:
          return CharacterSpriteSheets.DwarvenCleric
      }
  }
}

function characterDied (character) {
  console.log(`${character.player} died!`)
  character.isDead = true
  character.destroy() // when destroy() returns, this GameObject no longer has a scene (character.scene === null) and many things will be broken if we try to do anything else with this GameObject
}