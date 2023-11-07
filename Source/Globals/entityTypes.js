export const CharacterType = 'character'
export const Tile = 'tile'
export const Ogre1Type = 'ogre1'

export default {
  Character: CharacterType,
  Tile: Tile,
  Ogre1: Ogre1Type,
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