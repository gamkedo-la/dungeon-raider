export const CharacterType = 'character'
export const FoodLargeType = 'largeFood'
export const FoodSmallType = 'smallFood'
export const GoldFivePiecesType = 'fiveGoldPieces'
export const GoldSinglePieceType = 'singleGoldPiece'
export const ArrowNormalMultipleType = 'arrowNormalMultiple'
export const ArrowNormalSingleType = 'arrowNormalSingle'
export const KeyType = 'key'
export const ExitType = 'exit'
export const Ogre1Type = 'ogre1'
export const Tile = 'tile'

export default {
  Character: CharacterType,
  Exit: ExitType,
  FoodLarge: FoodLargeType,
  FoodSmall: FoodSmallType,
  GoldFivePieces: GoldFivePiecesType,
  GoldSinglePiece: GoldSinglePieceType,
  ArrowNormalMultiple: ArrowNormalMultipleType,
  ArrowNormalSingle: ArrowNormalSingleType,
  Key: KeyType,
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
    case FoodLargeType:
    case FoodSmallType:
      return true
    default:
      return false
  }
}

export function isGold (entity) {
  switch (entity.entityType) {
    case GoldFivePiecesType:
    case GoldSinglePieceType:
      return true
    default:
      return false
  }
}

export function isLoot (entity) {
  switch (entity.entityType) {
    case FoodLargeType:
    case FoodSmallType:
    case GoldFivePiecesType:
    case GoldSinglePieceType:
    case KeyType:
    case ArrowNormalSingleType:
    case ArrowNormalMultipleType:
      return true
    default:
      return false
  }
}