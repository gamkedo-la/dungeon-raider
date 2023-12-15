export const TileSpriteSheet = 'masterTilesetSpriteSheet'

export const TileFrames = {
  Exit: 40
}

export const TileSpriteSheetLoaderData = [
  {
    key: TileSpriteSheet,
    url: `../../Public/Images/masterTileset.png`,
    frameConfig: {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
      // endFrame: 3, // leave commented out to load all frames
      margin: 0,
      spacing: 0
    }
  }
]