// Exporting audio keys individually allows us to reference them individually in the game
//export const AudioKey = 'audioKey'

const AudioKeys = {
  // Including audio keys here enables the Preloader to automatically load them for us
  // expected format:
  // keyName : "mp3filename_with_no_extension"],
  // voiceoverWelcome: ["find_the_key"], 
  // FIXME: the above causes a crash - not sure why
}

export default AudioKeys