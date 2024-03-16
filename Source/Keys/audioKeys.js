// Exporting audio keys individually allows us to reference them individually in the game
export const AlertSound = 'alert_sound'
export const ArrowHit = 'arrow_attack'
export const AttackMiss = 'attack_miss'
export const CharacterDead = 'player_hurt_3'
export const CharacterHurt = 'player_hurt_4'
export const DefeatTheHorde = 'defeat_the_horde'
export const EnemyHurt = 'enemy_hit_1'
export const ExitInTime = 'exit_in_time'
export const ExitSound = 'exit_sound'
export const ExplorersMusic = 'music_explorers'
export const FindTheExit = 'find_the_exit'
export const FindTheKey = 'find_the_key'
export const FindThePotion = 'find_the_potion'
export const GetTheTreasure = 'get_the_treasure'
export const GameOverMusic = 'game_over'
export const GamePlayMusic = 'title_music'
export const ImportantEventSound = 'important_event'
export const TitleMusic = 'music_welcome_intro'
export const PauseSound = 'pause'
export const PickupCoinSound = 'pickup_coin'
export const PickupKeySound = 'pickup_key'
export const SwordClang = 'sword_clang_3'
export const Welcome = 'welcome'
export const WelcomeMusicBody = 'music_welcome_body'
export const PickUpFoodSound = 'gulp1'

const AudioKeys = {
  // Including audio keys here enables the Preloader to automatically load them for us
  [AlertSound]: {
    fileName: AlertSound,
    volume: 0.2,
    loop: false,
    type: 'voiceover'
  },
  [ArrowHit]: {
    fileName: ArrowHit,
    volume: 0.25,
    loop: false,
    type: 'sfx'
  },
  [AttackMiss]: {
    fileName: AttackMiss,
    volume: 0.25,
    loop: false,
    type: 'sfx'
  },
  [CharacterHurt]: {
    fileName: CharacterHurt,
    volume: 0.25,
    loop: false,
    type: 'sfx'
  },
  [CharacterDead]: {
    fileName: CharacterDead,
    volume: 0.25,
    loop: false,
    type: 'sfx'
  },
  [DefeatTheHorde]: {
    fileName: DefeatTheHorde,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [EnemyHurt]: {
    fileName: EnemyHurt,
    volume: 0.25,
    loop: false,
    type: 'sfx'
  },
  [ExitInTime]: {
    fileName: ExitInTime,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [ExitSound]: {
    fileName: ExitSound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
  [ExplorersMusic]: {
    fileName: ExplorersMusic,
    volume: 0.5,
    loop: true,
    type: 'music'
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
  [GameOverMusic]: {
    fileName: GameOverMusic,
    volume: 0.5,
    loop: false,
    type: 'music'
  },
  [GamePlayMusic]: {
    fileName: GamePlayMusic,
    volume: 0.25,
    loop: true,
    type: 'music'
  },
  [ImportantEventSound]: {
    fileName: ImportantEventSound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
  [PauseSound]: {
    fileName: PauseSound,
    volume: 0.25,
    loop: false,
    type: 'sfx'
  },
  [PickupCoinSound]: {
    fileName: PickupCoinSound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
  [PickupKeySound]: {
    fileName: PickupKeySound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
  [PickUpFoodSound]: {
    fileName: PickUpFoodSound,
    volume: 0.5,
    loop: false,
    type: 'sfx'
  },
  [SwordClang]: {
    fileName: SwordClang,
    volume: 0.25,
    loop: false,
    type: 'sfx'
  },
  [TitleMusic]: {
    fileName: TitleMusic,
    volume: 0.5,
    loop: true,
    type: 'music'
  },
  [Welcome]: {
    fileName: Welcome,
    volume: 0.5,
    loop: false,
    type: 'voiceover'
  },
  [WelcomeMusicBody]: {
    fileName: WelcomeMusicBody,
    volume: 0.5,
    loop: true,
    type: 'music'
  }
}

export default AudioKeys