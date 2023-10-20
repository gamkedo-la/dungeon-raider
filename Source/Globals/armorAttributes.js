const ArmorNames = {
  PlainClothes: 'plainClothes',
  LeatherArmor: 'leatherArmor',
  RingMail: 'ringMail',
  ChainMail: 'chainMail',
  HalfPlate: 'halfPlate',
  PlateMail: 'plateMail',
  Shield: 'shield',
  Helmet: 'helmet'
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

export default Armor = {
  [ArmorNames.PlainClothes]: plainClothes,
  [ArmorNames.LeatherArmor]: leatherArmor,
  [ArmorNames.RingMail]: ringMail,
  [ArmorNames.ChainMail]: chainMail,
  [ArmorNames.HalfPlate]: halfPlate,
  [ArmorNames.PlateMail]: plateMail,
  [ArmorNames.Shield]: shield,
  [ArmorNames.Helmet]: helmet
}