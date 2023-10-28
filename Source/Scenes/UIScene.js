import { UserInterfaceKey } from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import { CharacterUIPane } from "../Keys/imageKeys.js"
import FontLabel from "../UIElements/FontLabel.js"
import { FontFamilies, FamilyNames } from "../Keys/fontKeys.js"

class UserInterface extends Phaser.Scene {
  constructor () {
    super(UserInterfaceKey)
    this.gameManager = null
    this.uiColor = '#FFFFFF'
    this.greenPlayerColor = '#00FF00'
    this.redPlayerColor = '#FF0000'
    this.bluePlayerColor = '#0000FF'
    this.yellowPlayerColor = '#FFFF00'
    this.uiDangerColor = '#FF0000'
    this.uiFontSize = '20px'
    this.uiFontFamily = FontFamilies.MedivalSharpRegular
    this.activePlayers = null
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    // this.cameras.main.setBackgroundColor('rgba(0, 255, 0, 0.75)')
    let originX = 200
    const verticalOffset = 90
    this.add.image(originX, verticalOffset, CharacterUIPane)
    this.add.image((originX += 400), verticalOffset, CharacterUIPane)
    this.add.image((originX += 400), verticalOffset, CharacterUIPane)
    this.add.image((originX += 400), verticalOffset, CharacterUIPane)
    this.gameManager = this.game.registry.get(GameManagerKey)
    this.activePlayers = this.gameManager.getActivePlayers()
    this.cameras.main.setSize(this.cameras.main.width, 180)
    this.cameras.main.setPosition(0, this.game.canvas.height - 180)

    new FontLabel(this, {
      x: 24,
      y: 20,
      title: 'Green Character',
      fontFamily: this.uiFontFamily,
      fontSize: this.uiFontSize,
      color: this.greenPlayerColor
    })

    this.player1Health = new FontLabel(this, {
      x: 24,
      y: 45,
      title: `Health: ${this.gameManager.getCharacterAttributesForPlayer(this.activePlayers[0]).health}`,
      fontFamily: this.uiFontFamily,
      fontSize: this.uiFontSize,
      color: this.uiColor
    })

    this.player1Magic = new FontLabel(this, {
      x: 24,
      y: 70,
      title: `Magic: ${this.gameManager.getCharacterAttributesForPlayer(this.activePlayers[0]).magic}`,
      fontFamily: this.uiFontFamily,
      fontSize: this.uiFontSize,
      color: this.uiColor
    })
  }

  update (time, delta) {
    // get player health, weapons, armor, equipment, etc. from Game Manager
    const player1Attributes = this.gameManager.getCharacterAttributesForPlayer(this.activePlayers[0])
    if (player1Attributes.health <= 10) {
      this.player1Health.updateColor(this.uiDangerColor)
    }
    this.player1Health.updateTitle(`Health: ${player1Attributes.health}`)

    // if (player1Attributes.magic <= 1000) {
    //   this.player1Magic.updateColor(this.uiDangerColor)
    // }
    this.player1Magic.updateTitle(`Magic: ${player1Attributes.magic}`)

  }
}

export default UserInterface