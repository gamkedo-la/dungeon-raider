export const Ogre1SpriteSheet = 'ogre1SpriteSheet'
export const Skeleton1SpriteSheet = 'skeleton1SpriteSheet'
export const Demon1SpriteSheet = 'demon1SpriteSheet'

export const EnemySpriteSheets = {
  Ogre1: Ogre1SpriteSheet,
  Skeleton1: Skeleton1SpriteSheet,
  Demon1: Demon1SpriteSheet
}

export const EnemySpriteSheetLoaderData = [
  {
    key: EnemySpriteSheets.Ogre1,
    url: `../../Public/Images/${Ogre1SpriteSheet}.png`,
    frameConfig: {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
      // endFrame: 3, // leave commented out to load all frames
      margin: 0,
      spacing: 2
    }
  },
  {
    key: EnemySpriteSheets.Skeleton1,
    url: `../../Public/Images/${Skeleton1SpriteSheet}.png`,
    frameConfig: {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
      // endFrame: 3, // leave commented out to load all frames
      margin: 0,
      spacing: 2
    }
  },
  {
    key: EnemySpriteSheets.Demon1,
    url: `../../Public/Images/${Demon1SpriteSheet}.png`,
    frameConfig: {
      frameWidth: 32,
      frameHeight: 32,
      startFrame: 0,
      // endFrame: 3, // leave commented out to load all frames
      margin: 0,
      spacing: 2
    }
  }
]