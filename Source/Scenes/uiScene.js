import { UserInterfaceKey } from "../Keys/sceneKeys.js"
import { GameManagerKey } from "../Managers/gameManager.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import { CharacterUIPane } from "../Keys/imageKeys.js"
import FontLabel from "../UIElements/fontLabel.js"
import UIAttributes from "../Globals/uiAttributes.js"
import { CharacterClasses } from "../Globals/characterAttributes.js"

class UserInterface extends Phaser.Scene {
  constructor () {
    super(UserInterfaceKey)
    this.gameManager = null
    this.activePlayerUIs = {}
  }

  preload () {
    // May not need to preload anything here since we have a Preloader scene
  }

  create () {
    // this.cameras.main.setBackgroundColor('rgba(0, 255, 0, 0.75)')
    this.cameras.main.setSize(this.cameras.main.width, 180)
    this.cameras.main.setPosition(0, this.game.canvas.height - 180)

    let originX = 200
    const verticalOffset = 90
    this.gameManager = this.game.registry.get(GameManagerKey)
    const activePlayers = this.gameManager.getActivePlayers()

    for (const player of activePlayers) {
      const labels = this.createCharacterUI(player, originX, verticalOffset)
      this.activePlayerUIs[player] = labels
      originX += 400
    }
  }

  createCharacterUI (player, frameX, frameY) {
    const playerFrame = this.add.image(frameX, frameY, CharacterUIPane)
    const leftPadding = 10
    const column2Padding = 240
    const topPadding = -5
    let playerColor = UIAttributes.Player1Color
    switch (player) {
      case Player1Keys.Player:
        playerColor = UIAttributes.Player1Color
        break
      case Player2Keys.Player:
        playerColor = UIAttributes.Player2Color
        break
      case Player3Keys.Player:
        playerColor = UIAttributes.Player3Color
        break
      case Player4Keys.Player:
        playerColor = UIAttributes.Player4Color
        break
    }

    const characterRace = this.gameManager.getCharacterRaceForPlayer(player)
    const characterClass = this.gameManager.getCharacterClassForPlayer(player)
    const characterAttributes = this.gameManager.getCharacterAttributesForPlayer(player)
    const fontSizeNumber = getFontSizeNumber(UIAttributes.UIFontSize)

    let verticalMultiplier = 1
    const lineHeight = fontSizeNumber + UIAttributes.TextLineSpacing

    const header = new FontLabel(this, {
      x: leftPadding + playerFrame.x - (playerFrame.width / 2),
      y: topPadding + verticalMultiplier++ * lineHeight,
      title: `${characterRace} ${characterClass}`,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: playerColor
    })

    const health = new FontLabel(this, {
      x: leftPadding + playerFrame.x - (playerFrame.width / 2),
      y: topPadding + verticalMultiplier * lineHeight,
      title: `Health: ${characterAttributes.health}`,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor
    })

    const gold = new FontLabel(this, {
      x: column2Padding + playerFrame.x - (playerFrame.width / 2),
      y: topPadding + verticalMultiplier++ * lineHeight,
      title: `Gold: ${formatGold(characterAttributes.loot.gold)}`,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor
    })

    let magic = null
    if (characterClass === CharacterClasses.Magi || characterClass === CharacterClasses.Cleric) {
      new FontLabel(this, {
        x: leftPadding + playerFrame.x - (playerFrame.width / 2),
        y: topPadding + verticalMultiplier++ * lineHeight,
        title: `Magic: ${characterAttributes.magic}`,
        fontFamily: UIAttributes.UIFontFamily,
        fontSize: UIAttributes.UIFontSize,
        color: UIAttributes.UIColor
      })
    }

    const keys = new FontLabel(this, {
      x: column2Padding + playerFrame.x - (playerFrame.width / 2),
      y: topPadding + verticalMultiplier * lineHeight,
      title: `Keys: ${characterAttributes.loot.keys}`,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor
    })

    const armor = new FontLabel(this, {
      x: leftPadding + playerFrame.x - (playerFrame.width / 2),
      y: topPadding + verticalMultiplier++ * lineHeight,
      title: `Armor: ${characterAttributes.armor}`,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor
    })

    const primary = new FontLabel(this, {
      x: leftPadding + playerFrame.x - (playerFrame.width / 2),
      y: topPadding + verticalMultiplier++ * lineHeight,
      title: `Primary: ${characterAttributes.weapon}`,
      fontFamily: UIAttributes.UIFontFamily,
      fontSize: UIAttributes.UIFontSize,
      color: UIAttributes.UIColor
    })

    let arrows = null
    let secondary = null
    if (characterClass === CharacterClasses.Archer) {
      let arrowsText = `${characterAttributes.equippedArrowPrimary}: ${characterAttributes.getArrowQuantity(characterAttributes.equippedArrowPrimary, characterAttributes.availableArrows)}`
      if (characterAttributes.equippedArrowSecondary) {
        arrowsText += `\n${characterAttributes.equippedArrowSecondary}: ${characterAttributes.getArrowQuantity(characterAttributes.equippedArrowSecondary, characterAttributes.availableArrows)}`
      }
      arrows = new FontLabel(this, {
        x: leftPadding + playerFrame.x - (playerFrame.width / 2),
        y: topPadding + verticalMultiplier++ * lineHeight,
        title: `Arrows (${arrowsText})`,
        fontFamily: UIAttributes.UIFontFamily,
        fontSize: UIAttributes.UIFontSize,
        color: UIAttributes.UIColor
      })
    } else {
      secondary = new FontLabel(this, {
        x: leftPadding + playerFrame.x - (playerFrame.width / 2),
        y: topPadding + verticalMultiplier++ * lineHeight,
        title: `Secondary: ${characterAttributes.secondary}`,
        fontFamily: UIAttributes.UIFontFamily,
        fontSize: UIAttributes.UIFontSize,
        color: UIAttributes.UIColor
      })
    }

    return { header, health, gold, magic, keys, armor, primary, secondary, arrows }
  }

  update (time, delta) {
    // get player health, weapons, armor, equipment, etc. from Game Manager
    for (const activePlayer in this.activePlayerUIs) {
      const playerAttributes = this.gameManager.getCharacterAttributesForPlayer(activePlayer)
      const playerUI = this.activePlayerUIs[activePlayer]
      if (playerAttributes.health <= 10) {
        playerUI.health.updateColor(UIAttributes.UIDangerColor)
      }
      playerUI.health.updateTitle(`Health: ${playerAttributes.health}`)
      playerUI.gold.updateTitle(`Gold: ${formatGold(playerAttributes.loot.gold)}`)
      playerUI.keys.updateTitle(`Keys: ${playerAttributes.loot.keys}`)

      if (playerUI.magic) {
        if (playerAttributes.magic <= 10) {
          playerUI.magic.updateColor(UIAttributes.UIDangerColor)
        }

        playerUI.magic.updateTitle(`Magic: ${playerAttributes.magic}`)
      }

      playerUI.armor.updateTitle(`Armor: ${playerAttributes.armor.name}`)
      playerUI.primary.updateTitle(`Primary: ${playerAttributes.primary.name}`)

      if (playerUI.arrows) {
        let arrowsText = `${playerAttributes.equippedArrowPrimary}: ${playerAttributes.getArrowQuantity(playerAttributes.equippedArrowPrimary, playerAttributes.availableArrows)}`
        if (playerAttributes.equippedArrowSecondary) {
            arrowsText += `\n${playerAttributes.equippedArrowSecondary}: ${playerAttributes.getArrowQuantity(playerAttributes.equippedArrowSecondary, playerAttributes.availableArrows)}`
        }

        playerUI.arrows.updateTitle(`Arrows (${arrowsText})`)
      }

      if (playerUI.secondary) {
        playerUI.secondary.updateTitle(`Secondary: ${playerAttributes.secondary.name}`)
      }
    }
  }
}

function getFontSizeNumber (fontSize) {
  return parseInt(fontSize.substring(0, fontSize.length - 2))
}

function formatGold (gold) {
  const goldString = `${gold}`
  if (goldString.length > 3) {
    // this works because we know the max gold is less than 1,000,000
    return `${goldString.substring(0, goldString.length - 3)},${goldString.substring(goldString.length - 3)}`
  } else {
    return goldString
  }
}

export default UserInterface
