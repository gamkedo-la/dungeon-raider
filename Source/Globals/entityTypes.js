export const CharacterType = 'character'
export const ExitType = 'exit'
export const Ogre1Type = 'ogre1'
export const Tile = 'tile'

export default {
  Character: CharacterType,
  Exit: ExitType,
  Ogre1: Ogre1Type,
  Tile: Tile,
  isEnemy
}

export function isEnemy (entity) {
  switch (entity.entityType) {
    case Ogre1Type:
      return true
    default:
      return false
  }
}