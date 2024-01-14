export const CharacterType = 'character'
export const LootFoodLargeType = 'lootLargeFood'
export const LootFoodSmallType = 'lootSmallFood'
export const LootGoldPileType = 'lootGoldPile'
export const LootGoldPieceType = 'lootGoldPiece'
export const LootArrowNormalMultipleType = 'lootArrowNormalMultiple'
export const LootArrowNormalSingleType = 'lootArrowNormalSingle'
export const KeyType = 'key'
export const DoorType = 'door'
export const ExitType = 'exit'
export const Ogre1Type = 'ogre1'
export const Tile = 'tile'

export default {
  Character: CharacterType,
  Exit: ExitType,
  FoodLarge: LootFoodLargeType,
  FoodSmall: LootFoodSmallType,
  GoldFivePieces: LootGoldPileType,
  GoldSinglePiece: LootGoldPieceType,
  ArrowNormalMultiple: LootArrowNormalMultipleType,
  ArrowNormalSingle: LootArrowNormalSingleType,
  Key: KeyType,
  Door: DoorType,
  Ogre1: Ogre1Type,
  Tile: Tile,
  isEnemy,
  isGold,
  isLoot,
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
    case LootFoodLargeType:
    case LootFoodSmallType:
    case LootGoldPileType:
    case LootGoldPieceType:
    case KeyType:
    case LootArrowNormalSingleType:
    case LootArrowNormalMultipleType:
      return true
    default:
      return false
  }
}