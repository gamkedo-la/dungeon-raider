import { CreditsKey } from "../Keys/sceneKeys.js"

class Credits extends Phaser.Scene {
  constructor () {
    super(CreditsKey)

    this.creditsData = null
  }

  preload () {
    this.load.json(CreditsFileKey, "../../Public/Credits/credits.json")
  }

  create () {
    // creditsData is an Array of Objects:
    // Each Object has a "Contributor" property with a String value (the name of the contributor)
    // Each Object also a "Contributions" property which is an Array of Strings (the contributions of the contributor)
    this.creditsData = this.cache.json.get(CreditsFileKey)
  }

  update (time, delta) {
    // TODO: Update the vertical position of the credits text so that it scrolls up the screen
    // TODO: Allow the user to accelerate, reverse, and pause the credits text
    // TODO: Allow the user to return to the Title Screen
  }
}

export default Credits