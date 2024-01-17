export const ArmorNames = {
  PlainClothes: 'Plain Clothes',
  LeatherArmor: 'Leather Armor',
  RingMail: 'Ring Mail',
  ChainMail: 'Chain Mail',
  HalfPlate: 'Half Plate',
  PlateMail: 'Plate Mail',
  Shield: 'Shield',
  Helmet: 'Helmet'
}

export const plainClothes = {
  name: ArmorNames.PlainClothes,
  speedImpact: 0,
  defense: 0,
  cost: 0
}

export const leatherArmor = {
  name: ArmorNames.LeatherArmor,
  speedImpact: -1,
  defense: 1,
  cost: 10
}

export const ringMail = {
  name: ArmorNames.RingMail,
  speedImpact: -2,
  defense: 2,
  cost: 20
}

export const chainMail = {
  name: ArmorNames.ChainMail,
  speedImpact: -3,
  defense: 3,
  cost: 30
}

export const halfPlate = {
  name: ArmorNames.HalfPlate,
  speedImpact: -4,
  defense: 4,
  cost: 40
}

export const plateMail = {
  name: ArmorNames.PlateMail,
  speedImpact: -5,
  defense: 5,
  cost: 50
}

export const shield = {
  name: ArmorNames.Shield,
  speedImpact: -1,
  defense: 1,
  cost: 10
}

export const helmet = {
  name: ArmorNames.Helmet,
  speedImpact: 0,
  defense: 1,
  cost: 10
}

export function canWarriorUse (armor) {
  return true
}

export function canArcherUse (armor) {
  return armor.name === ArmorNames.PlainClothes ||
    armor.name === ArmorNames.LeatherArmor
}

export function canMagiUse (armor) {
  return armor.name === ArmorNames.PlainClothes
}

export function canClericUse (armor) {
  return true
}

export function canCharacterClassUse (characterClass, armor) {
  switch (characterClass) {
    case CharacterClasses.Warrior:
      return canWarriorUse(armor)
    case CharacterClasses.Archer:
      return canArcherUse(armor)
    case CharacterClasses.Magi:
      return canMagiUse(armor)
    case CharacterClasses.Cleric:
      return canClericUse(armor)
    default:
      return false
  }
}


export function getArmorByName (name) {
  switch (name) {
    case ArmorNames.None:
      return none
    case ArmorNames.Cloth:
      return cloth
    case ArmorNames.Leather:
      return leather
    case ArmorNames.ChainMail:
      return chainMail
    case ArmorNames.PlateMail:
      return plateMail
    case ArmorNames.Magical:
      return magical
    default:
      return none
  }
}

export default {
  PlainClothes: plainClothes,
  LeatherArmor: leatherArmor,
  RingMail: ringMail,
  ChainMail: chainMail,
  HalfPlate: halfPlate,
  PlateMail: plateMail,
  Shield: shield,
  Helmet: helmet,

  canWarriorUse,
  canArcherUse,
  canMagiUse,
  canClericUse,
  canCharacterClassUse,
  getArmorByName
}