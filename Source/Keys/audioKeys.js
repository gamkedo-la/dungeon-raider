// Exporting audio keys individually allows us to reference them individually in the game
export const AlertSound = 'alert_sound'
export const DefeatTheHorde = 'defeat_the_horde'
export const ExitInTime = 'exit_in_time'
export const FindTheExit = 'find_the_exit'
export const FindTheKey = 'find_the_key'
export const FindThePotion = 'find_the_potion'
export const GetTheTreasure = 'get_the_treasure'
export const Welcome = 'welcome'
export const TitleMusic = 'title_music'

const AudioKeys = {
  // Including audio keys here enables the Preloader to automatically load them for us
  [AlertSound]: {
    fileName: AlertSound,
    volume: 0.2,
    loop: false,
  },
  [DefeatTheHorde]: {
    fileName: DefeatTheHorde,
    volume: 0.5,
    loop: false,
  },
  [ExitInTime]: {
    fileName: ExitInTime,
    volume: 0.5,
    loop: false,
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
  },
  [FindThePotion]: {
    fileName: FindThePotion,
    volume: 0.5,
    loop: false,
  },
  [GetTheTreasure]: {
    fileName: GetTheTreasure,
    volume: 0.5,
    loop: false,
  },
  [Welcome]: {
    fileName: Welcome,
    volume: 0.5,
    loop: false,
  },
  [TitleMusic]: {
    fileName: TitleMusic,
    volume: 0.25,
    loop: true,
  }
}

export default AudioKeys