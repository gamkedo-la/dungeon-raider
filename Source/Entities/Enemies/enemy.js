import EntityTypes from '../../Globals/entityTypes.js'
import { TileLayerKeys } from '../../Keys/mapLayerKeys.js'

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const frame = 0
    super(scene, config.x, config.y, config.spriteSheet, frame) // actual position will be set by the Level Scene

    this.scene = scene
    Object.assign(this, config)
    this.lastPosition = { x: this.x, y: this.y }
    this.targetPosition = null
    this.shouldBeDead = false
    this.isDead = false
    this.animations = {}
    this.canMove = false
    this.canAttack = true
    this.depth = 8
    this.spawner = config.spawner

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, this.animationComplete, this)

    // Register for the 'update' event
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
  }

  buildAnimations (animations) {
    for (const animsKey in animations) {
      this.animations[animsKey] = this.scene.anims.get(animations[animsKey].key)
    }
  }

  update (time, delta) {
    if (!this.scene || this.isDead) return

    if (this.shouldBeDead) {
      enemyDied(this)
      return
    }

    this.lastPosition = { x: this.x, y: this.y }
    this.pursueCharacters()
  }

  levelDidStart () {
    this.canMove = true
  }

  pursueCharacters () {
    if (!this.canMove || this.anims.currentAnim.key === this.animations.death.key || this.anims.currentAnim.key === this.animations.dead.key) return

    const { closestCharacter, distance } = this.scene.getClosestCharacter(this)
    if (!closestCharacter) return

    const targetDistance = this.targetPosition ? Phaser.Math.Distance.Between(this.targetPosition.x, this.targetPosition.y, this.x, this.y) : null

    if (distance <= this.attributes.range) {
      this.targetPosition = null
      this.body.setVelocity(0,0)

      if (this.anims.currentAnim.key !== this.animations.primary.key) {
        this.anims.play(this.animations.primary, this)
        const angle = (Math.PI / 2) + Phaser.Math.Angle.Between(this.x, this.y, closestCharacter.x, closestCharacter.y)
        this.angle = Phaser.Math.RadToDeg(angle)  
      }
    } else if (distance <= 32) {
      this.targetPosition = null
      this.scene.physics.moveToObject(this, closestCharacter, this.attributes.speed)

      if (this.anims.currentAnim.key !== this.animations.primary.key) {
        this.anims.play(this.animations.primary, this)
        const angle = (Math.PI / 2) + Phaser.Math.Angle.Between(this.x, this.y, closestCharacter.x, closestCharacter.y)
        this.angle = Phaser.Math.RadToDeg(angle)  
      }
    } else if (!this.targetPosition || (targetDistance && targetDistance <= 8)) {
      const groundLayer = this.scene.mapManager.map.layers.find(layer => layer.name === TileLayerKeys.GroundLayer).tilemapLayer
      const closestCharacterTile = groundLayer.getTileAtWorldXY(closestCharacter.x, closestCharacter.y, false)
      const myTile = groundLayer.getTileAtWorldXY(this.x, this.y, false)
      const pathToFollow = pathToClosestCharacter(this, myTile, closestCharacterTile)
      this.targetPosition = { x: pathToFollow[1].pixelX + 16, y: pathToFollow[1].pixelY + 16 }
      this.updateFacingDirectionIfRequired()
      if (this.anims.currentAnim.key !== this.animations.walk.key) {
        this.anims.play(this.animations.walk, this)
      }
    } else if (this.targetPosition) {
      this.scene.physics.moveTo(this, this.targetPosition.x, this.targetPosition.y, this.attributes.speed)
      this.updateFacingDirectionIfRequired()
      if (this.anims.currentAnim.key !== this.animations.walk.key) {
        this.anims.play(this.animations.walk, this)
      }
    }
  }

  updateFacingDirectionIfRequired () {
		if (!this.scene || this.shouldBeDead || !this.targetPosition) return

    const angle = (Math.PI / 2) + Phaser.Math.Angle.Between(this.x, this.y, this.targetPosition.x, this.targetPosition.y)
    this.angle = Phaser.Math.RadToDeg(angle)
  }

  didCollideWith (otherEntity) {
    // This function will be overridden by the subclasses
    if (otherEntity.entityType === EntityTypes.Character && this.canAttack) {
      this.canAttack = false
      otherEntity.takeDamage(this.attributes.damage)
      this.scene.time.delayedCall(this.attributes.attackCooldown, () => { this.canAttack = true })
    } else if (otherEntity.entityType === EntityTypes.Tile) {
      if (this.targetPosition) {
        this.targetPosition = null
      }
    }
  }

  takeDamage (damage, otherEntity) {
    if (this.anims.currentAnim.key === this.animations.death.key) return

    this.attributes.health -= damage
    if (this.attributes.health <= 0) {
      this.anims.play(this.animations.death, this)
      this.body.setVelocity(0,0)
      this.scene.enemyKilledBy(this, otherEntity)
    }
  }

  animationComplete (animation, frame, gameObject) {
    if (animation.key === this.animations.death.key) {
      this.shouldBeDead = true
    }
  }
}

function enemyDied (enemy) {
	enemy.spawner?.enemyDied(enemy)
  enemy.isDead = true
  enemy.gameManager.destroyObject(enemy.scene.levelKey, enemy.id)
  enemy.destroy()
}

function pathToClosestCharacter (enemy, start, goal) {
  let openList = [start]
  let cameFrom = new Map()

  let gScore = new Map()
  gScore.set(start, 0)

  let fScore = new Map()
  fScore.set(start, heuristicCostEstimate(start, goal))

  while (openList.length > 0) {
    let current = openList.reduce((a, b) => fScore.get(a) < fScore.get(b) ? a : b)

    if (current.x === goal.x && current.y === goal.y) return reconstructPath(cameFrom, current)

    openList = openList.filter(node => node !== current)

    for (let neighbor of enemy.scene.mapManager.getNeighboringTiles(current.x, current.y)) {
      let tentativeGScore = gScore.get(current) + distBetween(enemy, current, neighbor)

      if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
        cameFrom.set(neighbor, current)
        gScore.set(neighbor, tentativeGScore)
        fScore.set(neighbor, gScore.get(neighbor) + heuristicCostEstimate(neighbor, goal))

        if (!openList.includes(neighbor)) {
          openList.push(neighbor)
        }
      }
    }
  }

  return null // Return null if no path is found
}

function heuristicCostEstimate(start, goal) {
  return (Phaser.Math.Distance.Between(start.x, start.y, goal.x, goal.y)) / 32
}

function distBetween(enemy, start, goal) {
  if (enemy.manager.isLocationOccupied(goal.x, goal.y)) return Number.MAX_SAFE_INTEGER

  return enemy.scene.mapManager.getTileCost(goal.x, goal.y)
}

function reconstructPath(cameFrom, current) {
  let totalPath = [current]

  while (cameFrom.has(current)) {
    current = cameFrom.get(current)
    totalPath.unshift(current)
  }

  return totalPath
}