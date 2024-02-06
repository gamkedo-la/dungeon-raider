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
  defense: 0
}

export const leatherArmor = {
  name: ArmorNames.LeatherArmor,
  speedImpact: -5,
  defense: 3
}

export const ringMail = {
  name: ArmorNames.RingMail,
  speedImpact: -10,
  defense: 5
}

export const chainMail = {
  name: ArmorNames.ChainMail,
  speedImpact: -12,
  defense: 8
}

export const halfPlate = {
  name: ArmorNames.HalfPlate,
  speedImpact: -15,
  defense: 10
}

export const plateMail = {
  name: ArmorNames.PlateMail,
  speedImpact: -20,
  defense: 15
}

export const shield = {
  name: ArmorNames.Shield,
  speedImpact: -1,
  defense: 3
}

export const helmet = {
  name: ArmorNames.Helmet,
  speedImpact: 0,
  defense: 1
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
      return plainClothes
    case ArmorNames.Cloth:
      return plainClothes
    case ArmorNames.LeatherArmor:
      return leatherArmor
    case ArmorNames.ChainMail:
      return chainMail
    case ArmorNames.RingMail:
      return ringMail
    case ArmorNames.PlateMail:
      return plateMail
    case ArmorNames.HalfPlate:
      return halfPlate
    case ArmorNames.Shield:
      return shield
    case ArmorNames.Helmet:
      return helmet
    default:
      console.warn(`Unknown armor name: ${name}`)
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