import EntityTypes from '../../Globals/entityTypes.js'
import collisionTiles from '../../Globals/collisionTiles.js'
import { TileLayerKeys } from '../../Keys/mapLayerKeys.js'

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const frame = 0
    super(scene, config.x, config.y, config.spriteSheet, frame) // actual position will be set by the Level Scene

    this.scene = scene
    Object.assign(this, config)
    this.lastPosition = { x: this.x, y: this.y }
    this.targetPostion = null
    this.shouldBeDead = false
    this.isDead = false
    this.animations = {}
    this.canMove = false
    this.canAttack = true
    this.depth = 8

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
    if (!this.canMove) return

    const { closestCharacter, distance } = this.scene.getClosestCharacter(this)
    if (!closestCharacter) return

    const targetDistance = this.targetPostion ? Phaser.Math.Distance.Between(this.targetPostion.x, this.targetPostion.y, this.x, this.y) : null

    if (distance <= this.attributes.range) {
      this.targetPostion = null
      this.body.setVelocity(0,0)
      this.anims.play(this.animations.primary, this)
    } else if (distance <= 32) {
      this.targetPostion = null
      this.scene.physics.moveToObject(this, closestCharacter, this.attributes.speed)
    } else if (!this.targetPostion || (targetDistance && targetDistance <= 8)) {
      const groundLayer = this.scene.mapManager.map.layers.find(layer => layer.name === TileLayerKeys.GroundLayer).tilemapLayer
      const closestCharacterTile = groundLayer.getTileAtWorldXY(closestCharacter.x, closestCharacter.y, false)
      const myTile = groundLayer.getTileAtWorldXY(this.x, this.y, false)
      const pathToFollow = pathToClosestCharacter(this, myTile, closestCharacterTile)
      this.targetPostion = { x: pathToFollow[1].pixelX + 16, y: pathToFollow[1].pixelY + 16 }
    } else if (this.targetPostion) {
      this.scene.physics.moveTo(this, this.targetPostion.x, this.targetPostion.y, this.attributes.speed)
    }
  }

  didCollideWith (otherEntity) {
    // This function will be overridden by the subclasses
    if (otherEntity.entityType === EntityTypes.Character && this.canAttack) {
      this.canAttack = false
      otherEntity.takeDamage(this.attributes.damage)
      this.scene.time.delayedCall(this.attributes.attackCooldown, () => { this.canAttack = true })
    }
  }

  takeDamage (damage, otherEntity) {
    this.attributes.health -= damage
    if (this.attributes.health <= 0) {
      this.anims.play(this.animations.death, this)
      this.scene.enemyKilledBy(this, otherEntity)
      this.shouldBeDead = true // temporary
    }
  }

  animationComplete (animation, frame, gameObject) {
    if (animation.key === this.animations.death.key) {
      this.shouldBeDead = true
    }
  }
}

function enemyDied (enemy) {
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

    for (let neighbor of getNeighbors(enemy, current)) {
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
  if (collisionTiles.includes(goal.index)) return Number.MAX_SAFE_INTEGER

  if (enemy.manager.isLocationOccupied(goal.x, goal.y)) return Number.MAX_SAFE_INTEGER

  return 1
}

function getNeighbors(enemy, node) {
  const collisionLayer =  enemy.scene.mapManager.map.layers.find(layer => layer.name === TileLayerKeys.CollisionLayer).tilemapLayer
  const groundLayer = enemy.scene.mapManager.map.layers.find(layer => layer.name === TileLayerKeys.GroundLayer).tilemapLayer
  const belowGroundLayer =  enemy.scene.mapManager.map.layers.find(layer => layer.name === TileLayerKeys.BelowGroundLayer).tilemapLayer 

  let west = collisionLayer.getTileAt(node.x - 1, node.y, false)
  if (!west || !collisionTiles.includes(west.index)) {
    west = belowGroundLayer.getTileAt(node.x - 1, node.y, false)
    if (!west || !collisionTiles.includes(west.index)) west = groundLayer.getTileAt(node.x - 1, node.y, false)
  }

  let east = collisionLayer.getTileAt(node.x + 1, node.y, false)
  if (!east || !collisionTiles.includes(east.index)) {
    east = belowGroundLayer.getTileAt(node.x + 1, node.y, false)
    if (!east || !collisionTiles.includes(east.index)) east = groundLayer.getTileAt(node.x + 1, node.y, false)
  }

  let north = collisionLayer.getTileAt(node.x, node.y - 1, false)
  if (!north || !collisionTiles.includes(north.index)) {
    north = belowGroundLayer.getTileAt(node.x, node.y - 1, false)
    if (!north || !collisionTiles.includes(north.index)) north = groundLayer.getTileAt(node.x, node.y - 1, false)
  }

  let south = collisionLayer.getTileAt(node.x, node.y + 1, false)
  if (!south || !collisionTiles.includes(south.index)) {
    south = belowGroundLayer.getTileAt(node.x, node.y + 1, false)
    if (!south || !collisionTiles.includes(south.index)) south = groundLayer.getTileAt(node.x, node.y + 1, false)
  }

  const result = []
  if (west) result.push(west)
  if (east) result.push(east)
  if (north) result.push(north)
  if (south) result.push(south)

  return result
}

function reconstructPath(cameFrom, current) {
  let totalPath = [current]

  while (cameFrom.has(current)) {
    current = cameFrom.get(current)
    totalPath.unshift(current)
  }

  return totalPath
}