export const Ogre1Attributes = {
  health: 100,
  gold: 100,
  damage: 20,
  attackCooldown: 1000,
  runSpeed: 50,
  radius: 12
}

export function getAttributesForEnemyType (enemyType) {
  switch (enemyType) {
    case 'ogre1':
      return Ogre1Attributes
    default:
      console.warn(`Unknown enemy type: ${enemyType}`)
      return Ogre1Attributes
  }
}