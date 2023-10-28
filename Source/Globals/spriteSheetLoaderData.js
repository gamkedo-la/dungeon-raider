export const ElvenWarriorSpriteSheet = 'elvenWarriorSpriteSheet'
export const ElvenArcherSpriteSheet = 'elvenArcherSpriteSheet'
export const ElvenMagiSpriteSheet = 'elvenMagiSpriteSheet'
export const ElvenClericSpriteSheet = 'elvenClericSpriteSheet'

export const HumanWarriorSpriteSheet = 'humanWarriorSpriteSheet'
export const HumanArcherSpriteSheet = 'humanArcherSpriteSheet'
export const HumanMagiSpriteSheet = 'humanMagiSpriteSheet'
export const HumanClericSpriteSheet = 'humanClericSpriteSheet'

export const DwarvenWarriorSpriteSheet = 'dwarvenWarriorSpriteSheet'
export const DwarvenArcherSpriteSheet = 'dwarvenArcherSpriteSheet'
export const DwarvenMagiSpriteSheet = 'dwarvenMagiSpriteSheet'
export const DwarvenClericSpriteSheet = 'dwarvenClericSpriteSheet'

export const SpriteSheets = {
  ElvenWarrior: ElvenWarriorSpriteSheet,
  ElvenArcher: ElvenArcherSpriteSheet,
  ElvenMagi: ElvenMagiSpriteSheet,
  ElvenCleric: ElvenClericSpriteSheet,
  HumanWarrior: HumanWarriorSpriteSheet,
  HumanArcher: HumanArcherSpriteSheet,
  HumanMagi: HumanMagiSpriteSheet,
  HumanCleric: HumanClericSpriteSheet,
  DwarvenWarrior: DwarvenWarriorSpriteSheet,
  DwarvenArcher: DwarvenArcherSpriteSheet,
  DwarvenMagi: DwarvenMagiSpriteSheet,
  DwarvenCleric: DwarvenClericSpriteSheet
}

export const SpriteSheetLoaderData = [
  {
    key: SpriteSheets.ElvenWarrior,
    url: `../../Public/Images/${ElvenWarriorSpriteSheet}.png`,
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

