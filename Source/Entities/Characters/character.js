import { CharacterSpriteSheets } from '../../Globals/characterSpriteSheetLoaderData.js'
import { PlayerMarkerSpriteSheet } from '../../Globals/playerMarkerSpriteSheetLoaderData.js'
import { Races, CharacterClasses } from '../../Globals/characterAttributes.js'
import EntityTypes from '../../Globals/entityTypes.js'
import InputEventKeys from '../../Keys/inputEventKeys.js'
import CharacterAnimations from '../../Keys/characterAnimationKeys.js'

export default class Character extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const spriteSheet = getSpriteSheet(config.race, config.characterClass)
    const frame = 0
    const tempPosition = { x: 0, y: 0 }
    super(scene, tempPosition.x, tempPosition.y, spriteSheet, frame) // actual position will be set by the Level Scene

    this.scene = scene
    this.depth = 10
    this.spriteSheet = spriteSheet
    this.entityType = EntityTypes.Character
    this.player = config.player
    this.race = config.race
    this.characterClass = config.characterClass
    this.gameManager = config.gameManager
    this.isExiting = false
    this.exited = false
    this.activeExit = null

    this.animations = {}

    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)

    this.buildPlayerMarker()

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

    this.maxHealth = this.attributes.maxHealth
    this.maxMagic = this.attributes.maxMagic

    this.shouldBeDead = false
    this.isDead = false

    // Register for the 'update
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  healthLoss () {
    if (!this.scene || this.exited || this.isExiting || this.isDead) return

    this.attributes.health--
    if (this.attributes.health <= 0) {
      this.shouldBeDead = true
      this.attributes.health = 0
    } else {
      this.scene.time.delayedCall(this.attributes.healthLossRate, () => {
        this.healthLoss()
      })  
    }
  }

  magicRegen () {
    if (!this.scene || this.exited || this.isExiting || this.isDead) return

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

  buildPlayerMarker () {
    let markerData = null
    switch (this.player) {
      case 'player-1':
        markerData = CharacterAnimations.Player1Marker
        break
      case 'player-2':
        markerData = CharacterAnimations.Player2Marker
        break
      case 'player-3':
        markerData = CharacterAnimations.Player3Marker
        break
      case 'player-4':
        markerData = CharacterAnimations.Player4Marker
        break
    }
    this.playerMarker = this.scene.add.sprite(this.x, this.y, PlayerMarkerSpriteSheet, markerData.frames[0])
    this.playerMarker.depth = this.depth - 1
    this.playerMarker.anims.play(markerData.key, true)
  }

  buildAnimations () {
    const animationsProps = CharacterAnimations[`${this.race}${this.characterClass}`]
    for (const animationProps in animationsProps) {
      this.animations[animationProps] = this.scene.anims.get(`${animationsProps[animationProps].key}`)
    }
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta)

    // Do stuff each game step before the physics/collision simulation
  }

  exitAnimation(time, delta) {
    const spinSpeed = 10
    const shrinkSpeed = 0.0005
    
    // spin around
    this.angle += spinSpeed * delta
    
    // shrink to nothingness
    this.scaleX -= shrinkSpeed * delta
    this.scaleY -= shrinkSpeed * delta
    
    // fade to black
    let darker = Math.round(255*this.scaleX)
    let rgb = Phaser.Display.Color.GetColor(darker,darker,darker)
    this.setTint(rgb)
    
    // finally, actually exit
    if (this.scaleX < 0) {
        console.log("character finished the exit animation!");
        this.isExiting = false
        this.scaleX = 1
        this.scaleY = 1
        this.setTint(Phaser.Display.Color.GetColor(255,255,255))
        this.serialize()
        this.exited = true
    }
  }

  update (time, delta) {
    // There is no guarantee regarding whether the physics/collision simulation has occurred before or after this update function is called
    if (!this.scene || this.exited || this.isDead) return

    if (this.isExiting) {
      this.exitAnimation(time, delta)
      if (this.activeExit) {
        const maxDelta  = 1
        if (this.x > this.activeExit.x) {
          this.x -= Math.min(maxDelta, (this.x - this.activeExit.x) / 2)
        } else if (this.x < this.activeExit.x) {
          this.x += Math.min(maxDelta, (this.activeExit.x - this.x) / 2)
        }

        if (this.y > this.activeExit.y) {
          this.y -= Math.min(maxDelta, (this.y - this.activeExit.y) / 2)
        } else if (this.y < this.activeExit.y) {
          this.y += Math.min(maxDelta, (this.activeExit.y - this.y) / 2)
        }
      }
    }

    if (this.exited) {
      this.scene.characterExited(this)
      this.destroy()
      return
    }

    if (this.shouldBeDead) {
      characterDied(this)
      return
    }

    this.updateAnimationsIfRequired()
    this.updateFacingDirectionIfRequired()

    this.playerMarker.x = this.x
    this.playerMarker.y = this.y
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

  canBePursued () {
    return !this.isDead && !this.shouldBeDead && !this.isExiting && !this.exited
  }

  collectedLoot (loot) {
    if (loot.attribute === 'health') {
      this.attributes.health = Math.min(this.attributes.maxHealth, this.attributes.health + loot.value)
    } else if (loot.attribute === 'magic') {
      this.attributes.magic = Math.min(this.attributes.maxMagic, this.attributes.magic + loot.value)
    } else if (loot.attribute === 'arrows') {
      const arrow = this.attributes.availableArrows.find((element) => element.name === loot.arrowType);
      arrow.quantity += loot.value;
    } else {
      this.attributes.loot[loot.attribute] += loot.value
    }
  }

  didCollideWith (otherEntity) {
    // Don't call destroy() here. Instead, set the "this.shouldBeDead" flag that will be checked in the update() function
    if (EntityTypes.isEnemy(otherEntity)) {
      // If we can hurt this enemy with our body, then do that here. The enemy will call "takeDamage" on us if it can hurt us with its body
    } else if (EntityTypes.isLoot(otherEntity)) {
      // only pickup arrows if you're an Archer
      if (otherEntity.loot.attribute === 'arrows') {
        if (this.characterClass === CharacterClasses.Archer) {
          this.collectedLoot(otherEntity.loot);
          otherEntity.destroy();
        }
      } else {
        // picked up a loot item
        this.collectedLoot(otherEntity.loot);
        otherEntity.destroy();
      }
    } else if (otherEntity.entityType === EntityTypes.Tile) {
      // hit a tile
    } else if (otherEntity.entityType === EntityTypes.Character) {
      // hit another character
    } else if (otherEntity.entityType === EntityTypes.Exit) { // FIXME: this never fires
      // reached an exit
      this.playerMarker.destroy()
      this.isExiting = true
      this.activeExit = otherEntity
    }
  }

  takeDamage (damage) {
    if (this.isDead || this.isExiting) return
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
    if (this.shouldBeDead || this.isDead || this.isExiting || this.exited) return
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
    // TODO: Need to implement this, analog stick and allow movement along angles other than 45 degrees?
    this.useKeyboardInput(event)
  }

  serialize () {
    // this function records all information about the character that needs to be saved to the Game Manager in order to restore the character in the next scene
    // be sure to add new properties here (or to the 'attributes' property) if you add them to the Character class
    this.gameManager.setCharacterRaceForPlayer(this.player, this.race)
    this.gameManager.setCharacterClassForPlayer(this.player, this.characterClass)
    this.gameManager.setCharacterAttributesForPlayer(this.player, this.attributes)
  }

  shutdown () {
    this.serialize()
    this.off(Phaser.Scenes.Events.UPDATE, this.update, this)
    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)
    this.inputManager.unregisterForEvent(this.inputEvent, this.processInput, this)
    this.playerMarker.destroy()
    this.destroy()
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
  character.attributes.health = 0
  character.attributes.magic = 0
  character.serialize()
  character.scene.characterDied(character)
  character.playerMarker.destroy()
  character.destroy() // when destroy() returns, this GameObject no longer has a scene (character.scene === null) and many things will be broken if we try to do anything else with this GameObject
}