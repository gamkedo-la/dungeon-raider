WeaponNames = {
  Dagger: 'dagger',
  ShortSword: 'shortSword',
  LongSword: 'longSword',
  Axe: 'axe',
  BattleAxe: 'battleAxe',
  Mace: 'mace',
  Hammer: 'hammer',
  WarHammer: 'warHammer',
  ShortBow: 'shortBow',
  LongBow: 'longBow',
  Crossbow: 'crossbow',
  Staff: 'staff',
  Wand: 'wand',
}

const WeaponRanges = {
  Melee: 'melee',
  Short: 'short',
  Long: 'long',
}

export const dagger = {
  name: WeaponNames.Dagger,
  range: WeaponRanges.Melee,
  damage: 1, // higher is better
  speed: 1 // lower is better
}

export const shortSword = {
  name: WeaponNames.ShortSword,
  range: WeaponRanges.Melee,
  damage: 2,
  speed: 2
}

export const longSword = {
  name: WeaponNames.LongSword,
  range: WeaponRanges.Melee,
  damage: 3,
  speed: 3
}

export const axe = {
  name: WeaponNames.Axe,
  range: WeaponRanges.Melee,
  damage: 2,
  speed: 2
}

export const battleAxe = {
  name: WeaponNames.BattleAxe,
  range: WeaponRanges.Melee,
  damage: 3,
  speed: 3
}

export const mace = {
  name: WeaponNames.Mace,
  range: WeaponRanges.Melee,
  damage: 3,
  speed: 3
}

export const hammer = {
  name: WeaponNames.Hammer,
  range: WeaponRanges.Melee,
  damage: 2,
  speed: 2
}

export const warHammer = {
  name: WeaponNames.WarHammer,
  range: WeaponRanges.Melee,
  damage: 3,
  speed: 3
}

export const shortBow = {
  name: WeaponNames.ShortBow,
  range: WeaponRanges.Short,
  damage: 1,
  speed: 2
}

export const longBow = {
  name: WeaponNames.LongBow,
  range: WeaponRanges.Long,
  damage: 2,
  speed: 3
}

export const crossbow = {
  name: WeaponNames.Crossbow,
  range: WeaponRanges.Long,
  damage: 3,
  speed: 4
}

export const staff = {
  name: WeaponNames.Staff,
  range: WeaponRanges.Melee,
  damage: 1,
  speed: 2
}

// Wand range and damage are per type of spell
// export const wand = {
//   name: WeaponNames.Wand,
//   range: WeaponRanges.Melee,
//   damage: 1,
//   speed: 2
// }

export default Weapons = {
  [WeaponNames.Dagger]: dagger,
  [WeaponNames.ShortSword]: shortSword,
  [WeaponNames.LongSword]: longSword,
  [WeaponNames.Axe]: axe,
  [WeaponNames.BattleAxe]: battleAxe,
  [WeaponNames.Mace]: mace,
  [WeaponNames.Hammer]: hammer,
  [WeaponNames.WarHammer]: warHammer,
  [WeaponNames.ShortBow]: shortBow,
  [WeaponNames.LongBow]: longBow,
  [WeaponNames.Crossbow]: crossbow,
  [WeaponNames.Staff]: staff,
  // [WeaponNames.Wand]: wand,
}