// Exporting atlas keys individually allows us to reference them individually in the game
export const PlayerSpriteSheet = 'playerSpriteSheet'
export const PlayerSpriteSheetData = 'playerSpriteSheetData'

const AtlasKeys = {
  // Including atlas keys here enables the Preloader to automatically load them for us
  PlayerSpriteSheet: {
    image: PlayerSpriteSheet,
    data: PlayerSpriteSheetData
  }
}

export default AtlasKeys