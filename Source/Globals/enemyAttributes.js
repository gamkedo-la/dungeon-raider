import EntityTypes from './entityTypes.js'

export const Ogre1Attributes = {
  health: 100,
  loot: {
    probability: 0.5,
    gold: {
      probability: 0.55,
      min: 1,
      max: 100
    },
    food: {
      probability: 0.25,
      min: 1,
      max: 1
    },
    // TODO: We want to have a potion class so we can track what type of potion it is without telling the player
    // what type of potion it is. The UI will say 'potions' and the player can take their chances.
    healthPotion: {
      probability: 0.1,
      min: 1,
      max: 1
    },
    manaPotion: {
      probability: 0.05,
      min: 1,
      max: 1
    },
    poisonPotion: {
      probability: 0.05,
      min: 1,
      max: 1
    }
  },
  damage: 20,
  attackCooldown: 1000,
  runSpeed: 50,
  radius: 12,
  range: 32
}

export function getAttributesForEnemy (enemy) {
  switch (enemy.entityType) {
    case EntityTypes.Ogre1Type: return Ogre1Attributes
    default:
      console.warn(`Unknown enemy type: ${enemy.entityType}`)
      return Ogre1Attributes
  }
}

export function getLootForEnemy (enemy) {
  switch (enemy.entityType) {
    case EntityTypes.Ogre1Type: return Ogre1Attributes
    default:
      console.warn(`Unknown enemy type: ${enemy.entityType}`)
      return Ogre1Attributes
  }
}

function getEnemyLoot (loot) {
  if (hasLoot(loot)) return lootType(loot)
  return null
}

function hasLoot (loot) {
  return Phaser.Math.FloatBetween(0, 1) <= loot.probability
}

function lootType (loot) {
  const roll = Phaser.Math.FloatBetween(0, 1)
  const lootTypes = Object.keys(loot).filter(key => key !== 'probability')
  let cumulativeProbability = 0
  for (const lootType of lootTypes) {
    cumulativeProbability += loot[lootType].probability
    if (roll <= cumulativeProbability) {
      return { [lootType]: getLootAmount(loot[lootType]) }
    }
  }
}

function getLootAmount (loot) {
  return Phaser.Math.Between(loot.min, loot.max)
}