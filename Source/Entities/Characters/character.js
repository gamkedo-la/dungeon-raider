import { CharacterSpriteSheets } from '../../Globals/characterSpriteSheetLoaderData.js'
import { PlayerMarkerSpriteSheet } from '../../Globals/playerMarkerSpriteSheetLoaderData.js'
import { Races, CharacterClasses, CharacterStates } from '../../Globals/characterAttributes.js'
import { getWeaponByName } from '../../Globals/weaponAttributes.js'
import { getArmorByName } from '../../Globals/armorAttributes.js'
import EntityTypes from '../../Globals/entityTypes.js'
import InputEventKeys from '../../Keys/inputEventKeys.js'
import CharacterAnimations from '../../Keys/characterAnimationKeys.js'
import AudioKeys from '../../Keys/audioKeys.js'
import { PickupCoinSound } from '../../Keys/audioKeys.js'
import { PickupKeySound } from '../../Keys/audioKeys.js'
import { ExitSound } from '../../Keys/audioKeys.js'
import ImageKeys from "../../Keys/imageKeys.js"


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
    this.team = config.player
    this.player = config.player
    this.race = config.race
    this.characterClass = config.characterClass
    this.gameManager = config.gameManager
    this.activeExit = null
    this.storeItem = null

		this.currentState = CharacterStates.Idle

    this.facing = new Phaser.Math.Vector2(0.0, -1.0)
  	this.moveDirection = new Phaser.Math.Vector2(0.0, 0.0)

    this.animations = {}

    this.buildAnimations()
    this.anims.play(this.animations.idle, this)
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)
    this.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.animationUpdate, this)

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

    this.attributes = config.attributes // see characterAttributes.js for the structure of this object
    if (this.characterClass !== CharacterClasses.Magi && this.characterClass !== CharacterClasses.Cleric) {
      this.attributes.magic = 0
    }

    this.buildVisibleWeapon()

    this.maxHealth = this.attributes.maxHealth
    this.maxMagic = this.attributes.maxMagic

    // Register for the 'update
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  healthLoss () {
    if (!this.scene || this.currentState === CharacterStates.Exited || this.currentState === CharacterStates.Exiting || this.currentState === CharacterStates.Dead) return

    this.attributes.health--
    if (this.attributes.health <= 0) {
      this.currentState = CharacterStates.Dying
      this.attributes.health = 0
    } else {
      this.scene.time.delayedCall(this.attributes.healthLossRate, () => {
        this.healthLoss()
      })  
    }
  }

  magicRegen () {
    if (!this.scene || this.currentState === CharacterStates.Exited || this.currentState === CharacterStates.Exiting || this.currentState === CharacterStates.Dead) return

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

  // a sprite drawn on top of (or below) avatar (for swords, bows etc)
  buildVisibleWeapon () {
    
    // used for rudimentary animation to make the
    // sprite swing back and forth when attacking
    this.visibleWeaponSwingFrames = 20;
    this.visibleWeaponSwingRemaining = 0;
    this.visibleWeaponSwingAngle = 90;

    if (this.attributes?.primary?.visibleWeaponSprite) {
        this.visibleWeapon = this.scene.add.sprite(this.x, this.y, this.attributes.primary.visibleWeaponSprite)
    
        // change to + 1 for above player sprite
        this.visibleWeapon.depth = this.depth - 1 

        // so it pivots at the handle
        this.visibleWeapon.setOrigin(0.1,0.9);
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
        this.currentState = CharacterStates.Exited
        this.scaleX = 1
        this.scaleY = 1
        this.setTint(Phaser.Display.Color.GetColor(255,255,255))
        this.serialize()
    }
  }

  update (time, delta) {
    // There is no guarantee regarding whether the physics/collision simulation has occurred before or after this update function is called
    if (!this.scene || this.currentState === CharacterStates.Exited || this.currentState === CharacterStates.Dead) return

    if (this.currentState === CharacterStates.Exiting) {
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

    if (this.currentState === CharacterStates.Exited) {
      this.scene.characterExited(this)
      this.destroy()
      return
    }

    if (this.currentState === CharacterStates.Dying) {
      characterDied(this)
      return
    }

    this.updateAnimationsIfRequired()
    this.updateFacingDirectionIfRequired()

    if (this.storeItem) {
      if((this.attributes.loot.gold < this.storeItem.price) || (Math.abs(this.x - this.storeItem.x) > ((this.width / 2) + (this.storeItem.width / 2)) || Math.abs(this.y - this.storeItem.y) > ((this.height / 2) + (this.storeItem.height / 2)))) {
        this.storeItem = null
      }
    }

    this.playerMarker.x = this.x
    this.playerMarker.y = this.y
    this.lastPosition.x = this.x
    this.lastPosition.y = this.y

    if (this.visibleWeapon) {
        // offset the weapon depending on facing direction 
        // todo: (could a math.cos(facing.x) etc do it better?
        let offsetX = this.facing.x * 7
        let offsetY = this.facing.y * 7

        // looks better not quite centered, may want to use a variable vice a hard-coded number and may want to adjust based on weapon type
        const pivotFix = -16;
        if (this.facing.x > 0) offsetY -= 4 + pivotFix
        if (this.facing.x < 0) offsetY += 4 + pivotFix
        if (this.facing.y > 0) offsetX += 4 + pivotFix
        if (this.facing.y < 0) offsetX -= 4 + pivotFix

        this.visibleWeapon.x = this.x + offsetX
        this.visibleWeapon.y = this.y + offsetY

        // tilted a little (225 = straight ahead, 240 or 210 = nice little tilts)
        // if we want a nice tilt, it needs to be inversed at times:
        // needs +/- angle offset depending on facing dir
        this.visibleWeapon.angle = this.angle + 225

        // "swing" the sword
        if (this.visibleWeaponSwingRemaining) {
            this.visibleWeapon.angle += Math.sin(((this.visibleWeaponSwingRemaining/this.visibleWeaponSwingFrames)*(Math.PI)))*this.visibleWeaponSwingAngle;
            this.visibleWeaponSwingRemaining--;
        }
    
    }

    this.body.setVelocity(0, 0)
  }

  updateAnimationsIfRequired () {
    if (this.currentState === CharacterStates.Moving) {
      if ((this.body.velocity.x !== 0 || this.body.velocity.y !== 0)) {
        this.anims.play(this.animations.walk, true)
      } else if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
        this.anims.play(this.animations.idle, true)
      }
    } else if (this.currentState === CharacterStates.Attacking && this.anims.currentAnim.key !== this.animations.primary.key) {
      this.anims.play(this.animations.primary, true)
      // TODO: This should also play the attack animation of the visible weapon, but there isn't one yet
      // for now, we add to a weapon swing inertia that fades over time
      this.visibleWeaponSwingRemaining = this.visibleWeaponSwingFrames;
    }
  }

  updateFacingDirectionIfRequired () {
		if (this.currentState === CharacterStates.Exiting || (this.moveDirection.x === 0 && this.moveDirection.y === 0)) return

    const angle = (Math.PI / 2) + Phaser.Math.Angle.Between(0, 0, this.moveDirection.x, this.moveDirection.y)
    this.angle = Phaser.Math.RadToDeg(angle)
    this.facing = this.moveDirection.clone()
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
    if (animation.key === this.animations.primary.key || animation.key === this.animations.secondary.key) {
      this.currentState = CharacterStates.Idle
      this.anims.play(this.animations.idle, true)
    } else if (animation.key === this.animations.injured.key) {
      this.currentState = CharacterStates.Idle
      this.anims.play(this.animations.idle, true)
    } else if (animation.key === this.animations.death.key) {
      this.currentState = CharacterStates.Dead
      this.anims.play(this.animations.dead, true)
      this.scene.characterDied(this)
      // TODO: need to either change this.entityType to EntityTypes.Loot.Character or
      // add a new entity to the loot manager that represents this character's body (probably this one)
    }
  }

  animationUpdate (animation, frame) {
    if (animation.key === this.animations.primary.key) {
      const criticalFrame = getCriticalFrameForAnimation('primary', this.characterClass)
      if (frame.index === criticalFrame) {
        this.executePrimaryAttack()
      }
    } else if (animation.key === this.animations.secondary.key) {
      const criticalFrame = getCriticalFrameForAnimation('secondary', this.characterClass)
      if (frame.index === criticalFrame) {
        this.executeSecondaryAttack()
      }
    }
  }

  canBePursued () {
    return this.currentState !== CharacterStates.Dead && this.currentState !== CharacterStates.Dying && this.currentState !== CharacterStates.Exiting && this.currentState !== CharacterStates.Exited
  }

  sfx(soundId) {
    if (!soundId) return;
    if (!this.scene.sound) return;
    if (!AudioKeys[soundId]) return;
    this.scene.sound.play(soundId, { loop: AudioKeys[soundId].loop, volume: AudioKeys[soundId].volume })  
  }

  collectedLoot (loot) {
    if (loot.attribute === 'health') {
      this.attributes.health = Math.min(this.attributes.maxHealth, this.attributes.health + loot.value)
      this.sfx(PickupCoinSound)
    } else if (loot.attribute === 'magic') {
      this.attributes.magic = Math.min(this.attributes.maxMagic, this.attributes.magic + loot.value)
      this.sfx(PickupKeySound)
    } else if (loot.attribute === 'keys') {
      this.attributes.loot[loot.attribute] += loot.value
      this.sfx(PickupKeySound)
    } else if (loot.attribute === 'weapon') {
      this.attributes.availableEquipment.push(getWeaponByName(loot.name))
      this.sfx(PickupCoinSound)
    } else if (loot.attribute === 'armor') {
      this.attributes.availableArmor.push(getArmorByName(loot.name))
      this.sfx(PickupCoinSound)
    } else if (loot.attribute === 'arrows') {
      const arrow = this.attributes.availableArrows.find((element) => element.name === loot.arrowType);
      arrow.quantity += loot.value
      this.sfx(PickupCoinSound)
    } else {
      this.attributes.loot[loot.attribute] += loot.value
      this.sfx(PickupCoinSound)
    }
  }

  didCollideWith (otherEntity) {
    if (EntityTypes.isEnemy(otherEntity) || EntityTypes.isSpawner(otherEntity)) {
      // If we can hurt this enemy with our body, then do that here. The enemy will call "takeDamage" on us if it can hurt us with its body
    } else if (EntityTypes.isLoot(otherEntity)) {
      // Only pick up the loot you're allowed to use
      if (this.scene.lootManager.canPickUp(otherEntity, this.characterClass)) {
        this.collectedLoot(otherEntity.loot)
        this.gameManager.destroyObject(this.scene.levelKey, otherEntity.id)
        otherEntity.destroy()
      }
    } else if (otherEntity.entityType === EntityTypes.Tile) {
      // hit a tile
    } else if (otherEntity.entityType === EntityTypes.Character) {
      // hit another character
    } else if (otherEntity.entityType === EntityTypes.Exit) {
      // reached an exit
      this.playerMarker.destroy()
      if (this.currentState !== CharacterStates.Exiting) this.sfx(ExitSound) // play sound on 1st frame only
      this.currentState = CharacterStates.Exiting
      this.activeExit = otherEntity
    } else if (otherEntity.entityType === EntityTypes.StoreItem) {
      if (otherEntity.classCanPurchase(this.characterClass) && otherEntity.price <= this.attributes.loot.gold) {
        this.storeItem = otherEntity
      }
    }
  }

  takeDamage (damage, damageType = 'normal') {
    // TODO: need to add damageType to the damage calculation (normal, silver, magic, fire, etc.)
    if (this.currentState === CharacterStates.Dying || this.currentState === CharacterStates.Dead || this.currentState === CharacterStates.Exiting || this.currentState === CharacterStates.Exited) return
    this.attributes.health -= Math.max(damage - this.attributes.armor.defense - (this.attributes.helmet?.defense || 0) - (this.attributes.shield?.defense || 0), 0)
    if (this.attributes.health <= 0) {
      this.currentState = CharacterStates.Dying
      this.anims.play(this.animations.death, true)
    } else {
      this.currentState = CharacterStates.Injured
      this.flashWhite()
      this.anims.play(this.animations.injured, true)
    }
  }

  flashWhite (counter = 0) {
    this.scene.time.delayedCall(30, (counter) => {
      if (this.currentState === CharacterStates.Dying || this.currentState === CharacterStates.Dead || this.currentState === CharacterStates.Exiting || this.currentState === CharacterStates.Exited) {
        this.clearTint()
        return
      }

      if (counter++ % 2 === 0) {
        this.clearTint()
      } else {
        this.setTintFill(Phaser.Display.Color.GetColor(255, 255, 255))
      }

      if (counter < 10) {
        this.flashWhite(counter)
      } else {
        this.clearTint()
      }
    }, [counter])
  }

  addLoot (loot) {
    // This function is only called when an enemy is killed, not sure that's what we want and also not sure this will work
    const lootType = Object.keys(loot)[0]
    this.attributes.loot[lootType] += loot[lootType]
  }

  useKeyboardInput (event) {
    if (this.currentState === CharacterStates.Dying || this.currentState === CharacterStates.Dead || this.currentState === CharacterStates.Exiting || this.currentState === CharacterStates.Exited) return

		this.moveDirection.x = event.right.isDown - event.left.isDown
		this.moveDirection.y = event.down.isDown - event.up.isDown
		this.moveDirection = this.moveDirection.normalize()

		this.body.velocity.x = this.moveDirection.x * (this.attributes.runSpeed + this.attributes.armor.speedImpact)
		this.body.velocity.y = this.moveDirection.y * (this.attributes.runSpeed + this.attributes.armor.speedImpact)

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

		if (event.primary.isDown || event.secondary.isDown) {
			this.body.velocity.x = 0
			this.body.velocity.y = 0
		}

    if (event.primary.isDown && !this.primaryAttackCoolingDown) {
      this.body.velocity.x = 0
      this.body.velocity.y = 0
			this.currentState = CharacterStates.Attacking
      this.primaryAttackCoolingDown = true
      this.scene.time.delayedCall(this.attributes.attackCooldown + this.attributes.primary.speed, () => {
        this.primaryAttackCoolingDown = false
      })
    }

    if (event.secondary.isDown && !this.secondaryAttackCoolingDown) {
      this.body.velocity.x = 0
      this.body.velocity.y = 0
			this.currentState = CharacterStates.Attacking
      this.secondaryAttackCoolingDown = true
      this.scene.time.delayedCall(this.attributes.attackCooldown + this.attributes.secondary.speed, () => {
        this.secondaryAttackCoolingDown = false
      })
      // TODO: Restore this once there actually is a secondary attack animation
      // this.anims.play(this.animations.secondary, false)
    }

    if ((this.body.velocity.x !== 0 || this.body.velocity.y !== 0) && this.currentState !== CharacterStates.Attacking && this.currentState !== CharacterStates.Injured) {
      this.currentState = CharacterStates.Moving
    } else if (this.body.velocity.x === 0 && this.body.velocity.y === 0 && this.currentState !== CharacterStates.Attacking) {
      this.currentState = CharacterStates.Idle
    }
  }
  
  useGamepadInput (event) {
    // TODO: Need to implement this, analog stick and allow movement along angles other than 45 degrees?
    this.useKeyboardInput(event)
  }

  executePrimaryAttack () {
    if (this.storeItem) {
      // Attempt to purchase the item
      this.scene.purchaseItem(this, this.storeItem)
    } else {
      this.executeAttackWith(this.attributes.primary)
    }
  }

  executeSecondaryAttack () {
    console.log(`Secondary attack (${this.attributes.secondary.name})`)
    if (this.storeItem) {
      // Attempt to purchase the item
      this.scene.purchaseItem(this, this.storeItem)
      this.attributes.loot.gold -= this.storeItem.price
    } else {
      this.executeAttackWith(this.attributes.secondary)
    }
  }

  executeAttackWith (weapon) {
    this.currentState = CharacterStates.Attacking
    weapon.attack(this)
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
  character.clearTint()
  character.currentState = CharacterStates.Dead
  character.attributes.health = 0
  character.attributes.magic = 0
  character.serialize()
  character.playerMarker.destroy()
}

function getCriticalFrameForAnimation (animationType, characterClass) {
  switch (animationType) {
    case 'primary':
      switch (characterClass) {
        case CharacterClasses.Warrior:
          return 2
        case CharacterClasses.Archer:
          return 3
        case CharacterClasses.Magi:
          return 3
        case CharacterClasses.Cleric:
          return 3
      }
    case 'secondary':
      switch (characterClass) {
        case CharacterClasses.Warrior:
          return 2
        case CharacterClasses.Archer:
          return 3
        case CharacterClasses.Magi:
          return 3
        case CharacterClasses.Cleric:
          return 3
      }
  }
}