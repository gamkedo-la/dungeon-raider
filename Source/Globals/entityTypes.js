export const CharacterType = 'character'
export const DoorType = 'door'
export const ExitType = 'exit'
export const LootArrowFireMultipleType = 'lootArrowFireMultiple'
export const LootArrowFireSingleType = 'lootArrowFireSingle'
export const LootArrowMagicMultipleType = 'lootArrowMagicMultiple'
export const LootArrowMagicSingleType = 'lootArrowMagicSingle'
export const LootArrowNormalMultipleType = 'lootArrowNormalMultiple'
export const LootArrowNormalSingleType = 'lootArrowNormalSingle'
export const LootArrowSilverMultipleType = 'lootArrowSilverMultiple'
export const LootArrowSilverSingleType = 'lootArrowSilverSingle'
export const LootAxeType = 'lootAxe'
export const LootBattleAxeType = 'lootBattleAxe'
export const LootFlangedMaceType = 'lootFlangedMace'
export const LootFoodLargeType = 'lootLargeFood'
export const LootFoodSmallType = 'lootSmallFood'
export const LootGoldPileType = 'lootGoldPile'
export const LootGoldPieceType = 'lootGoldPiece'
export const LootHammerType = 'lootHammer'
export const LootLongBowType = 'lootLongBow'
export const LootLongSwordType = 'lootLongSword'
export const LootMaceType  = 'lootMace'
export const LootShortBowType = 'lootShortBow'
export const LootShortSwordType = 'lootShortSword'
export const LootWarHammerType = 'lootWarHammer'
export const KeyType = 'key'
export const Ogre1Type = 'ogre1'
export const Tile = 'tile'
export const WeaponArrowFireMultipleType = 'weaponArrowFireMultiple'
export const WeaponArrowFireSingleType = 'weaponArrowFireSingle'
export const WeaponArrowMagicMultipleType = 'weaponArrowMagicMultiple'
export const WeaponArrowMagicSingleType = 'weaponArrowMagicSingle'
export const WeaponArrowNormalMultipleType = 'weaponArrowNormalMultiple'
export const WeaponArrowNormalSingleType = 'weaponArrowNormalSingle'
export const WeaponArrowSilverMultipleType = 'weaponArrowSilverMultiple'
export const WeaponArrowSilverSingleType = 'weaponArrowSilverSingle'
export const WeaponAxeType = 'weaponAxe'
export const WeaponBattleAxeType = 'weaponBattleAxe'
export const WeaponFlangedMaceType = 'weaponFlangedMace'
export const WeaponHammerType = 'weaponHammer'
export const WeaponLongBowType = 'weaponLongBow'
export const WeaponLongSwordType = 'weaponLongSword'
export const WeaponMaceType  = 'weaponMace'
export const WeaponShortBowType = 'weaponShortBow'
export const WeaponShortSwordType = 'weaponShortSword'
export const WeaponWarHammerType = 'weaponWarHammer'

export default {
  Character: CharacterType,
  Door: DoorType,
  Enemies: {
    Ogre1: Ogre1Type,
  },
  Exit: ExitType,
  Loot: {
    ArrowFireMultiple: LootArrowFireMultipleType,
    ArrowFireSingle: LootArrowFireSingleType,
    ArrowMagicMultiple: LootArrowMagicMultipleType,
    ArrowMagicSingle: LootArrowMagicSingleType,
    ArrowNormalMultiple: LootArrowNormalMultipleType,
    ArrowNormalSingle: LootArrowNormalSingleType,
    ArrowSilverMultiple: LootArrowSilverMultipleType,
    ArrowSilverSingle: LootArrowSilverSingleType,
    Axe: LootAxeType,
    BattleAxe: LootBattleAxeType,
    FlangedMace: LootFlangedMaceType,
    FoodLarge: LootFoodLargeType,
    FoodSmall: LootFoodSmallType,
    GoldPile: LootGoldPileType,
    GoldPiece: LootGoldPieceType,
    Hammer: LootHammerType,
    Key: KeyType,
    LongBow: LootLongBowType,
    LongSword: LootLongSwordType,
    Mace: LootMaceType,
    ShortBow: LootShortBowType,
    ShortSword: LootShortSwordType,
    WarHammer: LootWarHammerType
  },
  Tile: Tile,
  Weapons: {
    ArrowFireMultiple: WeaponArrowFireMultipleType,
    ArrowFireSingle: WeaponArrowFireSingleType,
    ArrowMagicMultiple: WeaponArrowMagicMultipleType,
    ArrowMagicSingle: WeaponArrowMagicSingleType,
    ArrowNormalMultiple: WeaponArrowNormalMultipleType,
    ArrowNormalSingle: WeaponArrowNormalSingleType,
    ArrowSilverMultiple: WeaponArrowSilverMultipleType,
    ArrowSilverSingle: WeaponArrowSilverSingleType,
    Axe: WeaponAxeType,
    BattleAxe: WeaponBattleAxeType,
    FlangedMace: WeaponFlangedMaceType,
    Hammer: WeaponHammerType,
    LongBow: WeaponLongBowType,
    LongSword: WeaponLongSwordType,
    Mace: WeaponMaceType,
    ShortBow: WeaponShortBowType,
    ShortSword: WeaponShortSwordType,
    WarHammer: WeaponWarHammerType
  },
  isEnemy,
  isGold,
  isLoot,
  isWeapon
}

export function isCharacter (entity) {
  switch (entity.entityType) {
    case CharacterType:
      return true
    default:
      return false
  }
}

export function isEnemy (entity) {
  switch (entity.entityType) {
    case Ogre1Type:
      return true
    default:
      return false
  }
}

export function isFood (entity) {
  switch (entity.entityType) {
    case LootFoodLargeType:
    case LootFoodSmallType:
      return true
    default:
      return false
  }
}

export function isGold (entity) {
  switch (entity.entityType) {
    case LootGoldPileType:
    case LootGoldPieceType:
      return true
    default:
      return false
  }
}

export function isLoot (entity) {
  switch (entity.entityType) {
    case LootArrowFireMultipleType:
    case LootArrowFireSingleType:
    case LootArrowMagicMultipleType:
    case LootArrowMagicSingleType:
    case LootArrowNormalMultipleType:
    case LootArrowNormalSingleType:
    case LootArrowSilverMultipleType:
    case LootArrowSilverSingleType:
    case LootAxeType:
    case LootBattleAxeType:
    case LootFlangedMaceType:
    case LootFoodLargeType:
    case LootFoodSmallType:
    case LootGoldPileType:
    case LootGoldPieceType:
    case LootHammerType:
    case LootLongBowType:
    case LootLongSwordType:
    case LootMaceType :
    case LootShortBowType:
    case LootShortSwordType:
    case LootWarHammerType:
    case KeyType:
      return true
    default:
      return false
  }
}

export function isWeapon (entity) {
  switch (entity.entityType) {
    case WeaponArrowFireMultipleType:
    case WeaponArrowFireSingleType:
    case WeaponArrowMagicMultipleType:
    case WeaponArrowMagicSingleType:
    case WeaponArrowNormalMultipleType:
    case WeaponArrowNormalSingleType:
    case WeaponArrowSilverMultipleType:
    case WeaponArrowSilverSingleType:
    case WeaponAxeType:
    case WeaponBattleAxeType:
    case WeaponFlangedMaceType:
    case WeaponHammerType:
    case WeaponLongBowType:
    case WeaponLongSwordType:
    case WeaponMaceType :
    case WeaponShortBowType:
    case WeaponShortSwordType:
    case WeaponWarHammerType:
      return true
    default:
      return false
  }
}