const human = {
  runSpeed: 5, // higher is better
  attackCooldown: 5, // lower is better
  health: 100,  // higher is better
  healthLoss: 5, // lower is better
  magic: 0, // higher is better
  magicRegen: 0, // higher is better
  meleeDamage: 0, // higher is better, final damage = meleeDamage + weaponDamage
  rangedDamage: 0, // higher is better, final damage = rangedDamage + weaponDamage
}

const elf = {
  runSpeed: 7,
  attackCooldown: 3,
  health: 80,
  healthLoss: 7,
  magic: 20,
  magicRegen: 3,
  meleeDamage: -3,
  rangedDamage: 3,
}

const dwarf = {
  runSpeed: 3,
  attackCooldown: 7,
  health: 120,
  healthLoss: 3,
  magic: -20,
  magicRegen: -3,
  meleeDamage: 3,
  rangedDamage: -3,
}

const warriorModifiers = {
  runSpeed: -2,
  attackCooldown: 1,
  health: 20,
  healthLoss: 0,
  magic: 0,
  magicRegen: 0,
  meleeDamage: 3,
  rangedDamage: 0
}

const archerModifiers = {
  runSpeed: 1,
  attackCooldown: -1,
  health: -10,
  healthLoss: 1,
  magic: 0,
  magicRegen: 0,
  meleeDamage: 0,
  rangedDamage: 3
}

const magiModifiers = {
  runSpeed: 0,
  attackCooldown: 3,
  health: -20,
  healthLoss: 2,
  magic: 100,
  magicRegen: 5,
  meleeDamage: 0,
  rangedDamage: 0
}

const clericModifiers = {
  runSpeed: -1,
  attackCooldown: 2,
  health: 0,
  healthLoss: 1,
  magic: 50,
  magicRegen: 2,
  meleeDamage: 1,
  rangedDamage: 0
}

export function getCharacterAttributes (race, characterClass) {
  const attributes = {
    runSpeed: 0,
    attackCooldown: 0,
    health: 0,
    healthLoss: 0,
    magic: 0,
    magicRegen: 0,
    meleeDamage: 0,
    rangedDamage: 0
  }

  switch (race) {
    case 'human':
      Object.assign(attributes, human)
      break
    case 'elf':
      Object.assign(attributes, elf)
      break
    case 'dwarf':
      Object.assign(attributes, dwarf)
      break
  }

  switch (characterClass) {
    case 'warrior':
      addWarriorModifiers(attributes)
      break
    case 'archer':
      addArcherModifiers(attributes)
      break
    case 'magi':
      addMagiModifiers(attributes)
      break
    case 'cleric':
      addClericModifiers(attributes)
      break
  }

  return attributes
}

function addWarriorModifiers (attributes) {
  attributes.runSpeed += warriorModifiers.runSpeed
  attributes.attackCooldown += warriorModifiers.attackCooldown
  attributes.health += warriorModifiers.health
  attributes.healthLoss += warriorModifiers.healthLoss
  attributes.magic += warriorModifiers.magic
  attributes.magicRegen += warriorModifiers.magicRegen
  attributes.meleeDamage += warriorModifiers.meleeDamage
  attributes.rangedDamage += warriorModifiers.rangedDamage
}

function addArcherModifiers (attributes) {
  attributes.runSpeed += archerModifiers.runSpeed
  attributes.attackCooldown += archerModifiers.attackCooldown
  attributes.health += archerModifiers.health
  attributes.healthLoss += archerModifiers.healthLoss
  attributes.magic += archerModifiers.magic
  attributes.magicRegen += archerModifiers.magicRegen
  attributes.meleeDamage += archerModifiers.meleeDamage
  attributes.rangedDamage += archerModifiers.rangedDamage
}

function addMagiModifiers (attributes) {
  attributes.runSpeed += magiModifiers.runSpeed
  attributes.attackCooldown += magiModifiers.attackCooldown
  attributes.health += magiModifiers.health
  attributes.healthLoss += magiModifiers.healthLoss
  attributes.magic += magiModifiers.magic
  attributes.magicRegen += magiModifiers.magicRegen
  attributes.meleeDamage += magiModifiers.meleeDamage
  attributes.rangedDamage += magiModifiers.rangedDamage
}

function addClericModifiers (attributes) {
  attributes.runSpeed += clericModifiers.runSpeed
  attributes.attackCooldown += clericModifiers.attackCooldown
  attributes.health += clericModifiers.health
  attributes.healthLoss += clericModifiers.healthLoss
  attributes.magic += clericModifiers.magic
  attributes.magicRegen += clericModifiers.magicRegen
  attributes.meleeDamage += clericModifiers.meleeDamage
  attributes.rangedDamage += clericModifiers.rangedDamage
}