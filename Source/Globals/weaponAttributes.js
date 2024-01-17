const WeaponNames = {
  None: 'None',
  Fists: 'Fists',
  Dagger: 'Dagger',
  ShortSword: 'Short Sword',
  LongSword: 'Long Sword',
  Axe: 'Axe',
  BattleAxe: 'Battle Axe',
  FlangedMace: 'Flanged Mace',
  Mace: 'Mace',
  Hammer: 'Hammer',
  HammerMagic: 'Magic Hammer',
  WarHammer: 'War Hammer',
  WarHammerMagic: 'Magic War Hammer',
  ShortBow: 'Short Bow',
  LongBow: 'Long Bow',
  Crossbow: 'Crossbow',
  Staff: 'Staff',
  Wand: 'Wand',
  MagicArrow: 'Magic Arrow',
  MagicQuiver: 'Magic Quiver',
  FireBall: 'Fireball',
  Heal: 'Heal',
  HealAll: 'Heal All',
  TurnUndead: 'Turn Undead',
  DestroyUndead: 'Destroy Undead',
  NormalArrows: 'Normal Arrows',
  SilverArrows: 'Silver Arrows',
  FireArrows: 'Fire Arrows',
  MagicArrows: 'Magic Arrows'
}

const WeaponRanges = {
  Melee: 'Melee',
  Short: 'Short',
  Long: 'Long',
}

export const none = {
  name: WeaponNames.None,
  range: WeaponRanges.Melee,
  damage: 0, // higher is better
  speed: 0, // lower is better
  attack: (weaponData, weaponUser, facing) => {} // do nothing
}

export const fists = {
  name: WeaponNames.Fists,
  range: WeaponRanges.Melee,
  damage: 1,
  speed: 1,
  attack: meleeAttack
}

export const dagger = {
  name: WeaponNames.Dagger,
  range: WeaponRanges.Melee,
  damage: 2,
  speed: 1,
  attack: meleeAttack
}

export const shortSword = {
  name: WeaponNames.ShortSword,
  range: WeaponRanges.Melee,
  damage: 3,
  speed: 2,
  attack: meleeAttack
}

export const longSword = {
  name: WeaponNames.LongSword,
  range: WeaponRanges.Melee,
  damage: 4,
  speed: 3,
  attack: meleeAttack
}

export const axe = {
  name: WeaponNames.Axe,
  range: WeaponRanges.Melee,
  damage: 3,
  speed: 2,
  attack: meleeAttack
}

export const battleAxe = {
  name: WeaponNames.BattleAxe,
  range: WeaponRanges.Melee,
  damage: 4,
  speed: 3,
  attack: meleeAttack
}

export const mace = {
  name: WeaponNames.Mace,
  range: WeaponRanges.Melee,
  damage: 3,
  speed: 2,
  attack: meleeAttack
}

export const flangedMace = {
  name: WeaponNames.FlangedMace,
  range: WeaponRanges.Melee,
  damage: 4,
  speed: 3,
  attack: meleeAttack
}

export const hammer = {
  name: WeaponNames.Hammer,
  range: WeaponRanges.Melee,
  damage: 3,
  speed: 2,
  attack: meleeAttack
}

export const hammerMagic = {
  name: WeaponNames.HammerMagic,
  range: WeaponRanges.Melee,
  damage: 4,
  speed: 2,
  attack: meleeAttack
}

export const warHammer = {
  name: WeaponNames.WarHammer,
  range: WeaponRanges.Melee,
  damage: 4,
  speed: 3,
  attack: meleeAttack
}

export const WarHammerMagic = {
  name: WeaponNames.WarHammerMagic,
  range: WeaponRanges.Melee,
  damage: 5,
  speed: 3,
  attack: meleeAttack
}

export const shortBow = {
  name: WeaponNames.ShortBow,
  range: WeaponRanges.Short,
  damage: 2,
  speed: 2,
  attack: rangedAttack
}

export const longBow = {
  name: WeaponNames.LongBow,
  range: WeaponRanges.Long,
  damage: 3,
  speed: 3,
  attack: rangedAttack
}

export const crossbow = {
  name: WeaponNames.Crossbow,
  range: WeaponRanges.Long,
  damage: 4,
  speed: 4,
  attack: rangedAttack
}

export const staff = {
  name: WeaponNames.Staff,
  range: WeaponRanges.Melee,
  damage: 2,
  speed: 2,
  attack: rangedAttack
}

export const normalArrows = {
  name: WeaponNames.NormalArrows,
  range: WeaponRanges.Long,
  damage: 0,
  speed: 0
}

export const silverArrows = {
  name: WeaponNames.SilverArrows,
  range: WeaponRanges.Long,
  damage: 0,
  speed: 0
}

export const fireArrows = {
  name: WeaponNames.FireArrows,
  range: WeaponRanges.Long,
  damage: 1,
  speed: 0
}

export const magicArrows = {
  name: WeaponNames.MagicArrows,
  range: WeaponRanges.Long,
  damage: 2,
  speed: 0
}

// Wand range and damage are per type of spell
// export const wand = {
//   name: WeaponNames.Wand,
//   range: WeaponRanges.Melee,
//   damage: 1,
//   speed: 2
// }

export const magicArrow = {
  name: WeaponNames.MagicArrow,
  range: WeaponRanges.Long,
  damage: 3,
  speed: 5,
  magicCost: 5
}

export const magicQuiver = {
  name: WeaponNames.MagicQuiver,
  range: WeaponRanges.Long,
  damage: 5,
  speed: 7,
  magicCost: 10
}

export const fireBall = {
  name: WeaponNames.FireBall,
  range: WeaponRanges.Long,
  damage: 10,
  speed: 10,
  magicCost: 20
}

export const heal = {
  name: WeaponNames.Heal,
  range: WeaponRanges.Melee,
  damage: -20,
  speed: 5,
  magicCost: 5
}

export const healAll = {
  name: WeaponNames.HealAll,
  range: WeaponRanges.Melee,
  damage: -50,
  speed: 10,
  magicCost: 20
}

export const turnUndead = {
  name: WeaponNames.TurnUndead,
  range: WeaponRanges.Short,
  damage: 10,
  speed: 5,
  magicCost: 10
}

export const destroyUndead = {
  name: WeaponNames.DestroyUndead,
  range: WeaponRanges.Short,
  damage: 20,
  speed: 10,
  magicCost: 20
}

export function isSpell (weapon) {
  return weapon.name === WeaponNames.MagicArrow ||
    weapon.name === WeaponNames.MagicQuiver ||
    weapon.name === WeaponNames.FireBall ||
    weapon.name === WeaponNames.Heal ||
    weapon.name === WeaponNames.HealAll ||
    weapon.name === WeaponNames.TurnUndead ||
    weapon.name === WeaponNames.DestroyUndead
}

export function isArrow (weapon) {
  return weapon.name === WeaponNames.NormalArrows ||
    weapon.name === WeaponNames.SilverArrows ||
    weapon.name === WeaponNames.FireArrows ||
    weapon.name === WeaponNames.MagicArrows
}

export function isMelee (weapon) {
  return weapon.range === WeaponRanges.Melee
}

export function isShortRange (weapon) {
  return weapon.range === WeaponRanges.Short
}

export function isLongRange (weapon) {
  return weapon.range === WeaponRanges.Long
}

export function isRanged (weapon) {
  return isShortRange(weapon) || isLongRange(weapon)
}

export function isEdgedWeapon (weapon) {
  return weapon.name === WeaponNames.Dagger ||
    weapon.name === WeaponNames.ShortSword ||
    weapon.name === WeaponNames.LongSword ||
    weapon.name === WeaponNames.Axe ||
    weapon.name === WeaponNames.BattleAxe ||
    isArrow(weapon)
}

export function isBluntWeapon (weapon) {
  return weapon.name === WeaponNames.Mace ||
    weapon.name === WeaponNames.FlangedMace ||
    weapon.name === WeaponNames.Hammer ||
    weapon.name === WeaponNames.HammerMagic ||
    weapon.name === WeaponNames.WarHammer ||
    weapon.name === WeaponNames.WarHammerMagic ||
    weapon.name === WeaponNames.Staff
}

export function isTwoHanded (weapon) {
  return weapon.name === WeaponNames.ShortBow ||
    weapon.name === WeaponNames.LongBow ||
    weapon.name === WeaponNames.Crossbow ||
    weapon.name === WeaponNames.WarHammer ||
    weapon.name === WeaponNames.WarHammerMagic ||
    weapon.name === WeaponNames.BattleAxe ||
    weapon.name === WeaponNames.Staff
}

export function isOneHanded (weapon) {
  return !isTwoHanded(weapon)
}

export function canWarriorUse (weapon) {
  return weapon.name === WeaponNames.None ||
    weapon.name === WeaponNames.Fists ||
    weapon.name === WeaponNames.ShortSword ||
    weapon.name === WeaponNames.LongSword ||
    weapon.name === WeaponNames.Axe ||
    weapon.name === WeaponNames.BattleAxe ||
    weapon.name === WeaponNames.Mace ||
    weapon.name === WeaponNames.FlangedMace ||
    weapon.name === WeaponNames.Hammer ||
    weapon.name === WeaponNames.HammerMagic ||
    weapon.name === WeaponNames.WarHammer ||
    weapon.name === WeaponNames.WarHammerMagic ||
    weapon.name === WeaponNames.Dagger
}

export function canArcherUse (weapon) {
  return weapon.name === WeaponNames.None ||
    weapon.name === WeaponNames.Fists ||
    weapon.name === WeaponNames.ShortBow ||
    weapon.name === WeaponNames.LongBow ||
    weapon.name === WeaponNames.Crossbow ||
    weapon.name === WeaponNames.NormalArrows ||
    weapon.name === WeaponNames.SilverArrows ||
    weapon.name === WeaponNames.FireArrows ||
    weapon.name === WeaponNames.MagicArrows
}

export function canMagiUse (weapon) {
  return weapon.name === WeaponNames.None ||
    weapon.name === WeaponNames.Fists ||
    weapon.name === WeaponNames.MagicArrow ||
    weapon.name === WeaponNames.MagicQuiver ||
    weapon.name === WeaponNames.FireBall ||
    weapon.name === WeaponNames.Staff ||
    weapon.name === WeaponNames.Dagger ||
    weapon.name === WeaponNames.Wand
}

export function canClericUse (weapon) {
  return weapon.name === WeaponNames.None ||
    weapon.name === WeaponNames.Fists ||
    weapon.name === WeaponNames.Heal ||
    weapon.name === WeaponNames.HealAll ||
    weapon.name === WeaponNames.TurnUndead ||
    weapon.name === WeaponNames.DestroyUndead ||
    isBluntWeapon(weapon)
}

export function canCharacterClassUse (characterClass, weapon) {
  switch (characterClass) {
    case CharacterClasses.Warrior:
      return canWarriorUse(weapon)
    case CharacterClasses.Archer:
      return canArcherUse(weapon)
    case CharacterClasses.Magi:
      return canMagiUse(weapon)
    case CharacterClasses.Cleric:
      return canClericUse(weapon)
    default:
      return false
  }
}

export function meleeAttack(weapon, user, facing) {
  console.log('Melee Attack')
}

export function rangedAttack(weapon, user, facing) {
  console.log('Ranged Attack')
}

export default {
  None: none,
  Fists: fists,
  Dagger: dagger,
  ShortSword: shortSword,
  LongSword: longSword,
  Axe: axe,
  BattleAxe: battleAxe,
  Mace: mace,
  FlangedMace: flangedMace,
  Hammer: hammer,
  HammerMagic: hammerMagic,
  WarHammer: warHammer,
  WarHammerMagic: WarHammerMagic,
  ShortBow: shortBow,
  LongBow: longBow,
  Crossbow: crossbow,
  Staff: staff,
  // Wand: wand,
  MagicArrow: magicArrow,
  MagicQuiver: magicQuiver,
  FireBall: fireBall,
  Heal: heal,
  HealAll: healAll,
  TurnUndead: turnUndead,
  DestroyUndead: destroyUndead,
  NormalArrows: normalArrows,
  SilverArrows: silverArrows,
  FireArrows: fireArrows,
  MagicArrows: magicArrows,

  isSpell,
  isArrow,
  isMelee,
  isShortRange,
  isLongRange,
  isRanged,
  isEdgedWeapon,
  isBluntWeapon,
  isTwoHanded,
  isOneHanded,
  canWarriorUse,
  canArcherUse,
  canMagiUse,
  canClericUse,
  canCharacterClassUse
}