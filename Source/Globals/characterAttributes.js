import Armor from './armorAttributes.js'
import Weapons from './weaponAttributes.js'

export const Races = {
  Elven: 'Elven',
  Human: 'Human',
  Dwarven: 'Dwarven'
}

export const CharacterClasses = {
  Warrior: 'Warrior',
  Archer: 'Archer',
  Magi: 'Magi',
  Cleric: 'Cleric'
}

export const CharacterStates = {
	Moving: 'moving',
	Attacking: 'attacking'
}

export function getCharacterAttributes (race, characterClass) {
  const attributes = {
    runSpeed: 0,
    attackCooldown: 0,
    health: 0,
    healthLossRate: 0,
    maxHealth: 0,
    magic: 0,
    magicRegen: 0,
    maxMagic: 0,
    meleeDamage: 0,
    rangedDamage: 0,
    armor: Armor.PlainClothes,
    availableArmor: [Armor.PlainClothes],
    primary: Weapons.Fists,
    secondary: Weapons.Fists,
    availableEquipment: [Weapons.Fists],
    radius: 12,
    loot: {
      gold: 100,
      keys: 0
    }
  }

  switch (race) {
    case Races.Human:
      Object.assign(attributes, human)
      break
    case Races.Elven:
      Object.assign(attributes, elf)
      break
    case Races.Dwarven:
      Object.assign(attributes, dwarven)
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
  runSpeed: 200, // higher is better
  attackCooldown: 500, // lower is better
  health: 100,  // higher is better
  healthLossRate: 1000, // higher is better
  maxHealth: 100,
  magic: 0, // higher is better
  magicRegen: 1000, // lower is better
  maxMagic: 0,
  meleeDamage: 0, // higher is better, final damage = meleeDamage + weaponDamage
  rangedDamage: 0, // higher is better, final damage = rangedDamage + weaponDamage
  armor: Armor.PlainClothes,
  availableArmor: [],
  primary: Weapons.Fists,
  secondary: Weapons.Fists,
  availableEquipment: [],
  radius: 12
}

const elf = {
  runSpeed: 250,
  attackCooldown: 400,
  health: 80,
  healthLossRate: 800,
  maxHealth: 80,
  magic: 20,
  magicRegen: 800,
  maxMagic: 20,
  meleeDamage: -3,
  rangedDamage: 5,
  armor: Armor.PlainClothes,
  availableArmor: [],
  primary: Weapons.Fists,
  secondary: Weapons.Fists,
  availableEquipment: [],
  radius: 10
}

const dwarven = {
  runSpeed: 150,
  attackCooldown: 600,
  health: 120,
  healthLossRate: 1200,
  maxHealth: 120,
  magic: -20,
  magicRegen: 1200,
  maxMagic: -20,
  meleeDamage: 3,
  rangedDamage: -5,
  armor: Armor.PlainClothes,
  availableArmor: [Armor.HalfPlate],
  primary: Weapons.Axe,
  secondary: Weapons.Fists,
  availableEquipment: [Weapons.Fists, Weapons.Axe],
  radius: 14
}

const warriorModifiers = {
  runSpeed: -2,
  attackCooldown: 100,
  health: 20,
  healthLossRate: 300,
  maxHealth: 20,
  magic: 0,
  magicRegen: 0,
  maxMagic: 0,
  meleeDamage: 30,
  rangedDamage: 0,
  armor: Armor.RingMail,
  availableArmor: [Armor.RingMail],
  primary: Weapons.ShortSword,
  secondary: Weapons.Fists,
  availableEquipment: [Weapons.None, Weapons.Fists, Weapons.ShortSword],
  radius: 1
}

const archerModifiers = {
  runSpeed: 1,
  attackCooldown: -100,
  health: -10,
  healthLossRate: -100,
  maxHealth: -10,
  magic: 0,
  magicRegen: 0,
  maxMagic: 0,
  meleeDamage: 0,
  rangedDamage: 0,
  armor: Armor.LeatherArmor,
  availableArmor: [Armor.LeatherArmor],
  primary: Weapons.ShortBow,
  secondary: Weapons.None,
  availableEquipment: [Weapons.None, Weapons.ShortBow],
  equippedArrowPrimary: 'Normal',
  equippedArrowSecondary: null,
  availableArrows: [
    {
      name: 'Normal',
      quantity: 100
    },
    {
      name: 'Silver',
      quantity: 0
    },
    {
      name: 'Fire',
      quantity: 0
    },
    {
      name: 'Magic',
      quantity: 0
    }
  ],
  getArrowQuantity: (attributes) => {
    const result = attributes.availableArrows.find(arrow => arrow.name === attributes.equippedArrowPrimary)
    return result?.quantity
  },
  useArrow: (attributes) => {
    const result = attributes.availableArrows.find(arrow => arrow.name === attributes.equippedArrowPrimary)
    if (result) result.quantity -= 1
  },
  radius: -1
}

const magiModifiers = {
  runSpeed: 0,
  attackCooldown: 300,
  health: -20,
  healthLossRate: -200,
  maxHealth: -20,
  magic: 100,
  magicRegen: -200,
  maxMagic: 100,
  meleeDamage: 0,
  rangedDamage: 0,
  armor: Armor.PlainClothes,
  availableArmor: [Armor.PlainClothes],
  primary: Weapons.MagicArrow,
  secondary: Weapons.Staff,
  availableEquipment: [Weapons.None, Weapons.Fists, Weapons.MagicArrow, Weapons.Staff],
  radius: -1
}

const clericModifiers = {
  runSpeed: -1,
  attackCooldown: 200,
  health: 0,
  healthLossRate: 150,
  maxHealth: 0,
  magic: 50,
  magicRegen: -100,
  maxMagic: 50,
  meleeDamage: 15,
  rangedDamage: 0,
  armor: Armor.RingMail,
  availableArmor: [Armor.RingMail],
  primary: Weapons.Mace,
  secondary: Weapons.Heal,
  availableEquipment: [Weapons.None, Weapons.Fists, Weapons.Mace, Weapons.Heal],
  radius: 1
}

function addWarriorModifiers (attributes) {
  attributes.runSpeed += warriorModifiers.runSpeed
  attributes.attackCooldown += warriorModifiers.attackCooldown
  attributes.health += warriorModifiers.health
  attributes.healthLossRate += warriorModifiers.healthLossRate
  attributes.maxHealth += warriorModifiers.maxHealth
  attributes.magic += warriorModifiers.magic
  attributes.magicRegen += warriorModifiers.magicRegen
  attributes.maxMagic += warriorModifiers.maxMagic
  attributes.meleeDamage += warriorModifiers.meleeDamage
  attributes.rangedDamage += warriorModifiers.rangedDamage
  attributes.armor = warriorModifiers.armor
  attributes.availableArmor = Array.from(new Set(attributes.availableArmor.concat(warriorModifiers.availableArmor)))
  attributes.availableArmor = attributes.availableArmor.filter(armor => Armor.canWarriorUse(armor))
  attributes.primary = warriorModifiers.primary
  attributes.secondary = warriorModifiers.secondary
  attributes.availableEquipment = Array.from(new Set(attributes.availableEquipment.concat(warriorModifiers.availableEquipment)))
  attributes.availableEquipment = attributes.availableEquipment.filter(weapon => Weapons.canWarriorUse(weapon))
  attributes.radius += warriorModifiers.radius
}

function addArcherModifiers (attributes) {
  attributes.runSpeed += archerModifiers.runSpeed
  attributes.attackCooldown += archerModifiers.attackCooldown
  attributes.health += archerModifiers.health
  attributes.healthLossRate += archerModifiers.healthLossRate
  attributes.maxHealth += archerModifiers.maxHealth
  attributes.magic += archerModifiers.magic
  attributes.magicRegen += archerModifiers.magicRegen
  attributes.maxMagic += archerModifiers.maxMagic
  attributes.meleeDamage += archerModifiers.meleeDamage
  attributes.rangedDamage += archerModifiers.rangedDamage
  attributes.armor = archerModifiers.armor
  attributes.availableArmor = Array.from(new Set(attributes.availableArmor.concat(archerModifiers.availableArmor)))
  attributes.availableArmor = attributes.availableArmor.filter(armor => Armor.canArcherUse(armor))
  attributes.primary = archerModifiers.primary
  attributes.secondary = archerModifiers.secondary
  attributes.availableEquipment = Array.from(new Set(attributes.availableEquipment.concat(archerModifiers.availableEquipment)))
  attributes.availableEquipment = attributes.availableEquipment.filter(weapon => Weapons.canArcherUse(weapon))
  attributes.equippedArrowPrimary = archerModifiers.equippedArrowPrimary
  attributes.equippedArrowSecondary = archerModifiers.equippedArrowSecondary
  attributes.getArrowQuantity = archerModifiers.getArrowQuantity
  attributes.useArrow = archerModifiers.useArrow
  attributes.availableArrows = JSON.parse(JSON.stringify(archerModifiers.availableArrows)); // there was a bug where Player 2's arrows were increased whenever Player 1 also collected arrows, this fixes it
  attributes.radius += archerModifiers.radius
}

function addMagiModifiers (attributes) {
  attributes.runSpeed += magiModifiers.runSpeed
  attributes.attackCooldown += magiModifiers.attackCooldown
  attributes.health += magiModifiers.health
  attributes.healthLossRate += magiModifiers.healthLossRate
  attributes.maxHealth += magiModifiers.maxHealth
  attributes.magic += magiModifiers.magic
  attributes.magicRegen += magiModifiers.magicRegen
  attributes.maxMagic += magiModifiers.maxMagic
  attributes.meleeDamage += magiModifiers.meleeDamage
  attributes.rangedDamage += magiModifiers.rangedDamage
  attributes.armor = magiModifiers.armor
  attributes.availableArmor = Array.from(new Set(attributes.availableArmor.concat(magiModifiers.availableArmor)))
  attributes.availableArmor = attributes.availableArmor.filter(armor => Armor.canMagiUse(armor))
  attributes.primary = magiModifiers.primary
  attributes.secondary = magiModifiers.secondary
  attributes.availableEquipment = Array.from(new Set(attributes.availableEquipment.concat(magiModifiers.availableEquipment)))
  attributes.availableEquipment = attributes.availableEquipment.filter(weapon => Weapons.canMagiUse(weapon))
  attributes.radius += magiModifiers.radius
}

function addClericModifiers (attributes) {
  attributes.runSpeed += clericModifiers.runSpeed
  attributes.attackCooldown += clericModifiers.attackCooldown
  attributes.health += clericModifiers.health
  attributes.healthLossRate += clericModifiers.healthLossRate
  attributes.maxHealth += clericModifiers.maxHealth
  attributes.magic += clericModifiers.magic
  attributes.magicRegen += clericModifiers.magicRegen
  attributes.maxMagic += clericModifiers.maxMagic
  attributes.meleeDamage += clericModifiers.meleeDamage
  attributes.rangedDamage += clericModifiers.rangedDamage
  attributes.armor = clericModifiers.armor
  attributes.availableArmor = Array.from(new Set(attributes.availableArmor.concat(clericModifiers.availableArmor)))
  attributes.availableArmor = attributes.availableArmor.filter(armor => Armor.canClericUse(armor))
  attributes.primary = clericModifiers.primary
  attributes.secondary = clericModifiers.secondary
  attributes.availableEquipment = Array.from(new Set(attributes.availableEquipment.concat(clericModifiers.availableEquipment)))
  attributes.availableEquipment = attributes.availableEquipment.filter(weapon => Weapons.canClericUse(weapon))
  attributes.radius += clericModifiers.radius
}