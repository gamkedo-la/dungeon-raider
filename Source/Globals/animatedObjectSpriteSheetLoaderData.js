export const DrawbridgeSpriteSheet = 'drawbridgeSpriteSheet'

export const AnimatedObjectSpriteSheets = {
  Drawbridge: DrawbridgeSpriteSheet
}

export const AnimatedObjectSpriteSheetLoaderData = [
  {
    key: AnimatedObjectSpriteSheets.Drawbridge,
    url: `../../Public/Images/${DrawbridgeSpriteSheet}.png`,
    frameConfig: {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
      endFrame: 7,
      margin: 0,
      spacing: 0
    }
  }
]