// Exporting audio keys individually allows us to reference them individually in the game
export const AlertSound = 'alert_sound'
export const DefeatTheHorde = 'defeat_the_horde'
export const ExitInTime = 'exit_in_time'
export const FindTheExit = 'find_the_exit'
export const FindTheKey = 'find_the_key'
export const FindThePotion = 'find_the_potion'
export const GetTheTreasure = 'get_the_treasure'
export const Welcome = 'welcome'
export const GamePlayMusic = 'title_music'
export const TitleMusic = 'music_welcome_intro'
export const WelcomeMusicBody = 'music_welcome_body'
export const pickupCoinSound = 'pickup_coin'
export const pickupKeySound = 'pickup_key'
export const exitSound = 'exit_sound'
export const importantEventSound = 'important_event'

const AudioKeys = {
  // Including audio keys here enables the Preloader to automatically load them for us
  [AlertSound]: {
    fileName: AlertSound,
    volume: 0.2,
    loop: false,
    type: 'voiceover'
  },
  [DefeatTheHorde]: {
    fileName: DefeatTheHorde,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [ExitInTime]: {
    fileName: ExitInTime,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [FindTheExit]: {
    fileName: FindTheExit,
    volume: 0.5,
    loop: false,
  },
  [FindTheKey]: {
    fileName: FindTheKey,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [FindThePotion]: {
    fileName: FindThePotion,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [GetTheTreasure]: {
    fileName: GetTheTreasure,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [Welcome]: {
    fileName: Welcome,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [GamePlayMusic]: {
    fileName: GamePlayMusic,
    volume: 0.25,
    loop: true,
    type: 'music'
  },
  [TitleMusic]: {
    fileName: TitleMusic,
    volume: 0.5,
    loop: true,
    type: 'music'
  },
  [WelcomeMusicBody]: {
    fileName: WelcomeMusicBody,
    volume: 0.5,
    loop: true,
    type: 'music'
  },
  [pickupCoinSound]: {
    fileName: pickupCoinSound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
  [exitSound]: {
    fileName: exitSound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
  [pickupKeySound]: {
    fileName: pickupKeySound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
  [importantEventSound]: {
    fileName: importantEventSound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
}

export default AudioKeys