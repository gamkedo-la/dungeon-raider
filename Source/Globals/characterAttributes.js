export const Races = {
  Human: 'Human',
  Elf: 'Elf',
  Dwarf: 'Dwarf'
}

export const CharacterClasses = {
  Warrior: 'Warrior',
  Archer: 'Archer',
  Magi: 'Magi',
  Cleric: 'Cleric'
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
    case Races.Human:
      Object.assign(attributes, human)
      break
    case Races.Elf:
      Object.assign(attributes, elf)
      break
    case Races.Dwarf:
      Object.assign(attributes, dwarf)
      break
  }

  switch (characterClass) {
    case CharacterClasses.Warrior:
      addWarriorModifiers(attributes)
      break
    case CharacterClasses.Archer:
      addArcherModifiers(attributes)
      break
    case CharacterClasses.Magi:
      addMagiModifiers(attributes)
      break
    case CharacterClasses.Cleric:
      addClericModifiers(attributes)
      break
  }

  return attributes
}

const human = {
  runSpeed: 85, // higher is better
  attackCooldown: 500, // lower is better
  health: 100,  // higher is better
  healthLoss: 5, // lower is better
  magic: 0, // higher is better
  magicRegen: 0, // higher is better
  meleeDamage: 0, // higher is better, final damage = meleeDamage + weaponDamage
  rangedDamage: 0, // higher is better, final damage = rangedDamage + weaponDamage
}

const elf = {
  runSpeed: 100,
  attackCooldown: 300,
  health: 80,
  healthLoss: 7,
  magic: 20,
  magicRegen: 3,
  meleeDamage: -3,
  rangedDamage: 3,
}

const dwarf = {
  runSpeed: 70,
  attackCooldown: 700,
  health: 120,
  healthLoss: 3,
  magic: -20,
  magicRegen: -3,
  meleeDamage: 3,
  rangedDamage: -3,
}

const warriorModifiers = {
  runSpeed: -2,
  attackCooldown: 100,
  health: 20,
  healthLoss: 0,
  magic: 0,
  magicRegen: 0,
  meleeDamage: 3,
  rangedDamage: 0
}

const archerModifiers = {
  runSpeed: 1,
  attackCooldown: -100,
  health: -10,
  healthLoss: 1,
  magic: 0,
  magicRegen: 0,
  meleeDamage: 0,
  rangedDamage: 3
}

const magiModifiers = {
  runSpeed: 0,
  attackCooldown: 300,
  health: -20,
  healthLoss: 2,
  magic: 100,
  magicRegen: 5,
  meleeDamage: 0,
  rangedDamage: 0
}

const clericModifiers = {
  runSpeed: -1,
  attackCooldown: 200,
  health: 0,
  healthLoss: 1,
  magic: 50,
  magicRegen: 2,
  meleeDamage: 1,
  rangedDamage: 0
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