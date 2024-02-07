import Weapon from '../Entities/Weapons/weapon.js'
import { WeaponFistsType, WeaponDaggerType, WeaponShortSwordType, WeaponWarHammerMagicType, WeaponWarHammerType, WeaponHammerMagicType } from './entityTypes.js'
import { WeaponHammerType, WeaponFlangedMaceType, WeaponMaceType, WeaponBattleAxeType, WeaponAxeType, WeaponLongSwordType } from './entityTypes.js'

export const WeaponNames = {
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
  DestroyUndead: 'Destroy Undead'
}

export const ArrowNames = {
  NormalArrows: 'Normal Arrows',
	SilverArrows: 'Silver Arrows',
	FireArrows: 'Fire Arrows',
	MagicArrows: 'Magic Arrows'
}

export const Arrows = {
	'Normal': {
		name: ArrowNames.NormalArrows,
		damage: 25,
		speed: 400,
		radius: 12
	},
	'Silver': {},
	'Fire': {},
	'Magic': {}
}

const WeaponRanges = {
  Melee: 'Melee',
  Short: 'Short',
  Long: 'Long',
}

export const none = new Weapon({
  name: WeaponNames.None,
  range: WeaponNames.None,
  damage: 0, // higher is better
  speed: 0 // lower is better
})

export const fists = new Weapon({
  name: WeaponNames.Fists,
  range: WeaponRanges.Melee,
  damage: 10,
  speed: 400,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponFistsType
})

export const dagger = new Weapon({
  name: WeaponNames.Dagger,
  range: WeaponRanges.Melee,
  damage: 25,
  speed: 400,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponDaggerType
})

export const shortSword = new Weapon({
  name: WeaponNames.ShortSword,
  range: WeaponRanges.Melee,
  damage: 30,
  speed: 200,
	size: new Phaser.Math.Vector2(32, 48),
	entityType: WeaponShortSwordType
})

export const longSword = new Weapon({
  name: WeaponNames.LongSword,
  range: WeaponRanges.Melee,
  damage: 40,
  speed: 600,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponLongSwordType
})

export const axe = new Weapon({
  name: WeaponNames.Axe,
  range: WeaponRanges.Melee,
  damage: 30,
  speed: 500,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponAxeType
})

export const battleAxe = new Weapon({
  name: WeaponNames.BattleAxe,
  range: WeaponRanges.Melee,
  damage: 40,
  speed: 600,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponBattleAxeType
})

export const mace = new Weapon({
  name: WeaponNames.Mace,
  range: WeaponRanges.Melee,
  damage: 30,
  speed: 500,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponMaceType
})

export const flangedMace = new Weapon({
  name: WeaponNames.FlangedMace,
  range: WeaponRanges.Melee,
  damage: 40,
  speed: 600,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponFlangedMaceType
})

export const hammer = new Weapon({
  name: WeaponNames.Hammer,
  range: WeaponRanges.Melee,
  damage: 30,
  speed: 500,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponHammerType
})

export const hammerMagic = new Weapon({
  name: WeaponNames.HammerMagic,
  range: WeaponRanges.Melee,
  damage: 40,
  speed: 400,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponHammerMagicType
})

export const warHammer = new Weapon({
  name: WeaponNames.WarHammer,
  range: WeaponRanges.Melee,
  damage: 40,
  speed: 600,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponWarHammerType
})

export const WarHammerMagic = new Weapon({
  name: WeaponNames.WarHammerMagic,
  range: WeaponRanges.Melee,
  damage: 50,
  speed: 500,
	size: new Phaser.Math.Vector2(32, 32),
	entityType: WeaponWarHammerMagicType
})

export const shortBow = new Weapon({
  name: WeaponNames.ShortBow,
  range: WeaponRanges.Short,
  damage: -10,
  speed: 100
})

export const longBow = new Weapon({
  name: WeaponNames.LongBow,
  range: WeaponRanges.Long,
  damage: 10,
  speed: 200
})

export const crossbow = new Weapon({
  name: WeaponNames.Crossbow,
  range: WeaponRanges.Long,
  damage: 30,
  speed: 800
})

export const staff = new Weapon({
  name: WeaponNames.Staff,
  range: WeaponRanges.Melee,
  damage: 20,
  speed: 400
})

// Wand range and damage are per type of spell
// export const wand = {
//   name: WeaponNames.Wand,
//   range: WeaponRanges.Melee,
//   damage: 1,
//   speed: 2
// }

export const magicArrow = new Weapon({
  name: WeaponNames.MagicArrow,
  range: WeaponRanges.Long,
  damage: 30,
  speed: 400,
  magicCost: 5
})

export const magicQuiver = new Weapon({
  name: WeaponNames.MagicQuiver,
  range: WeaponRanges.Long,
  damage: 50,
  speed: 7,
  magicCost: 10
})

export const fireBall = new Weapon({
  name: WeaponNames.FireBall,
  range: WeaponRanges.Long,
  damage: 100,
  speed: 10,
  magicCost: 20
})

export const heal = new Weapon({
  name: WeaponNames.Heal,
  range: WeaponRanges.Melee,
  damage: -40,
  speed: 5,
  magicCost: 5
})

export const healAll = new Weapon({
  name: WeaponNames.HealAll,
  range: WeaponRanges.Melee,
  damage: -100,
  speed: 10,
  magicCost: 20
})

export const turnUndead = new Weapon({
  name: WeaponNames.TurnUndead,
  range: WeaponRanges.Short,
  damage: 100,
  speed: 5,
  magicCost: 10
})

export const destroyUndead = new Weapon({
  name: WeaponNames.DestroyUndead,
  range: WeaponRanges.Short,
  damage: 200,
  speed: 10,
  magicCost: 20
})

export function getDistanceForRange (range) {
	switch (range) {
		case WeaponRanges.Melee:
			return 32
		case WeaponRanges.Short:
			return 320
		case WeaponRanges.Long:
			return 640
	}
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

export function usesArrows (weapon) {
	return weapon.name === WeaponNames.ShortBow ||
		weapon.name === WeaponNames.LongBow ||
		weapon.name === WeaponNames.Crossbow
}

export function isEdgedWeapon (weapon) {
  return weapon.name === WeaponNames.Dagger ||
    weapon.name === WeaponNames.ShortSword ||
    weapon.name === WeaponNames.LongSword ||
    weapon.name === WeaponNames.Axe ||
    weapon.name === WeaponNames.BattleAxe
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
    weapon.name === WeaponNames.Crossbow
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

export function getWeaponByName (name) {
  switch (name) {
    case WeaponNames.None:
      return none
    case WeaponNames.Fists:
      return fists
    case WeaponNames.Dagger:
      return dagger
    case WeaponNames.ShortSword:
      return shortSword
    case WeaponNames.LongSword:
      return longSword
    case WeaponNames.Axe:
      return axe
    case WeaponNames.BattleAxe:
      return battleAxe
    case WeaponNames.Mace:
      return mace
    case WeaponNames.FlangedMace:
      return flangedMace
    case WeaponNames.Hammer:
      return hammer
    case WeaponNames.HammerMagic:
      return hammerMagic
    case WeaponNames.WarHammer:
      return warHammer
    case WeaponNames.WarHammerMagic:
      return WarHammerMagic
    case WeaponNames.ShortBow:
      return shortBow
    case WeaponNames.LongBow:
      return longBow
    case WeaponNames.Crossbow:
      return crossbow
    case WeaponNames.Staff:
      return staff
    case WeaponNames.MagicArrow:
      return magicArrow
    case WeaponNames.MagicQuiver:
      return magicQuiver
    case WeaponNames.FireBall:
      return fireBall
    case WeaponNames.Heal:
      return heal
    case WeaponNames.HealAll:
      return healAll
    case WeaponNames.TurnUndead:
      return turnUndead
    case WeaponNames.DestroyUndead:
      return destroyUndead
    default:
      return none
  }

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

  isSpell,
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
  canCharacterClassUse,
  getWeaponByName
}