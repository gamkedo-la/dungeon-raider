import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import InputEventKeys from "../Keys/inputEventKeys.js"

export const GameManagerKey = 'game-manager'
export const PlayerCountKey = 'player-count'
export const ActiveExitKey = 'active-exit'

export default class GameManager {
  constructor (game) {
    this.game = game

    // TODO: Remove this once the Character Create Screen is implemented
    createDebugCharacter(this)
  }

  getPlayerCount () {
    return this.game.registry.get(PlayerCountKey)
  }

  setPlayerCount (playerCount) {
    this.game.registry.set(PlayerCountKey, playerCount)
  }

  getPlayerForInputOption (inputOption) {
    switch (inputOption) {
      case Player1Keys.Input:
        return Player1Keys.Player
      case Player2Keys.Input:
        return Player2Keys.Player
      case Player3Keys.Input:
        return Player3Keys.Player
      case Player4Keys.Input:
        return Player4Keys.Player
      default:
        return null
    }
  }

  getInputEventForPlayer (player) {
    switch (this.getInputForPlayer(player)) {
      case InputOptionsKeys.WASD:
        return InputEventKeys.onWASD
      case InputOptionsKeys.Arrows:
        return InputEventKeys.onArrows
      case InputOptionsKeys.Gamepad1:
        return InputEventKeys.onGamepad1
      case InputOptionsKeys.Gamepad2:
        return InputEventKeys.onGamepad2
      case InputOptionsKeys.Gamepad3:
        return InputEventKeys.onGamepad3
      case InputOptionsKeys.Gamepad4:
        return InputEventKeys.onGamepad4
      default:
        return null
    }
  }

  setInputForNextPlayer (inputOption) {
    if (!this.game.registry.get(Player1Keys.Active)) {
      this.setActivePlayer(Player1Keys.Player, inputOption, true)
      return Player1Keys.Player
    } else if (!this.game.registry.get(Player2Keys.Active)) {
      this.setActivePlayer(Player2Keys.Player, inputOption, true)
      return Player2Keys.Player
    } else if (!this.game.registry.get(Player3Keys.Active)) {
      this.setActivePlayer(Player3Keys.Player, inputOption, true)
      return Player3Keys.Player
    } else if (!this.game.registry.get(Player4Keys.Active)) {
      this.setActivePlayer(Player4Keys.Player, inputOption, true)
      return Player4Keys.Player
    } else {
      return false
    }
  }

  getActivePlayers () {
    const activePlayers = []
    if (this.game.registry.get(Player1Keys.Active)) {
      activePlayers.push(Player1Keys.Player)
    }
    if (this.game.registry.get(Player2Keys.Active)) {
      activePlayers.push(Player2Keys.Player)
    }
    if (this.game.registry.get(Player3Keys.Active)) {
      activePlayers.push(Player3Keys.Player)
    }
    if (this.game.registry.get(Player4Keys.Active)) {
      activePlayers.push(Player4Keys.Player)
    }
    return activePlayers
  }

  setActivePlayer (player, input, isActive = true) {
    switch (player) {
      case Player1Keys.Player:
        this.game.registry.set(Player1Keys.Active, isActive)
        if(input !== undefined) this.game.registry.set(Player1Keys.Input, input)
        break
      case Player2Keys.Player:
        this.game.registry.set(Player2Keys.Active, isActive)
        if(input !== undefined) this.game.registry.set(Player2Keys.Input, input)
        break
      case Player3Keys.Player:
        this.game.registry.set(Player3Keys.Active, isActive)
        if(input !== undefined) this.game.registry.set(Player3Keys.Input, input)
        break
      case Player4Keys.Player:
        this.game.registry.set(Player4Keys.Active, isActive)
        if(input !== undefined) this.game.registry.set(Player4Keys.Input, input)
        break
    }
  }

  getInputForPlayer (player) {
    switch (player) {
      case Player1Keys.Player:
        return this.game.registry.get(Player1Keys.Input)
      case Player2Keys.Player:
        return this.game.registry.get(Player2Keys.Input)
      case Player3Keys.Player:
        return this.game.registry.get(Player3Keys.Input)
      case Player4Keys.Player:
        return this.game.registry.get(Player4Keys.Input)
    }
  }

  setInputForPlayer (player, input) {
    switch (player) {
      case Player1Keys.Player:
        this.game.registry.set(Player1Keys.Input, input)
        break
      case Player2Keys.Player:
        this.game.registry.set(Player2Keys.Input, input)
        break
      case Player3Keys.Player:
        this.game.registry.set(Player3Keys.Input, input)
        break
      case Player4Keys.Player:
        this.game.registry.set(Player4Keys.Input, input)
        break
    }
  }

  getCharacterRaceForPlayer (player) {
    switch (player) {
      case Player1Keys.Player:
        return this.game.registry.get(Player1Keys.Race)
      case Player2Keys.Player:
        return this.game.registry.get(Player2Keys.Race)
      case Player3Keys.Player:
        return this.game.registry.get(Player3Keys.Race)
      case Player4Keys.Player:
        return this.game.registry.get(Player4Keys.Race)
    }
  }

  setCharacterRaceForPlayer (player, race) {
    switch (player) {
      case Player1Keys.Player:
        return this.game.registry.set(Player1Keys.Race, race)
      case Player2Keys.Player:
        return this.game.registry.set(Player2Keys.Race, race)
      case Player3Keys.Player:
        return this.game.registry.set(Player3Keys.Race, race)
      case Player4Keys.Player:
        return this.game.registry.set(Player4Keys.Race, race)
    }
  }

  getCharacterClassForPlayer (player) {
    switch (player) {
      case Player1Keys.Player:
        return this.game.registry.get(Player1Keys.Class)
      case Player2Keys.Player:
        return this.game.registry.get(Player2Keys.Class)
      case Player3Keys.Player:
        return this.game.registry.get(Player3Keys.Class)
      case Player4Keys.Player:
        return this.game.registry.get(Player4Keys.Class)
    }
  }

  setCharacterClassForPlayer (player, characterClass) {
    switch (player) {
      case Player1Keys.Player:
        return this.game.registry.set(Player1Keys.Class, characterClass)
      case Player2Keys.Player:
        return this.game.registry.set(Player2Keys.Class, characterClass)
      case Player3Keys.Player:
        return this.game.registry.set(Player3Keys.Class, characterClass)
      case Player4Keys.Player:
        return this.game.registry.set(Player4Keys.Class, characterClass)
    }
  }

  getCharacterAttributesForPlayer (player) {
    switch (player) {
      case Player1Keys.Player:
        return this.game.registry.get(Player1Keys.Attributes)
      case Player2Keys.Player:
        return this.game.registry.get(Player2Keys.Attributes)
      case Player3Keys.Player:
        return this.game.registry.get(Player3Keys.Attributes)
      case Player4Keys.Player:
        return this.game.registry.get(Player4Keys.Attributes)
    }
  }

  setCharacterAttributesForPlayer (player, attributes) {
    switch (player) {
      case Player1Keys.Player:
        this.game.registry.set(Player1Keys.Attributes, attributes)
        break
      case Player2Keys.Player:
        this.game.registry.set(Player2Keys.Attributes, attributes)
        break
      case Player3Keys.Player:
        this.game.registry.set(Player3Keys.Attributes, attributes)
        break
      case Player4Keys.Player:
        this.game.registry.set(Player4Keys.Attributes, attributes)
        break
    }
  }

  getPlayerKeysForPlayer (player) {
    switch (player) {
      case Player1Keys.Player:
        return Player1Keys
      case Player2Keys.Player:
        return Player2Keys
      case Player3Keys.Player:
        return Player3Keys
      case Player4Keys.Player:
        return Player4Keys
    }
  }

  clearPlayerData (player) {
    this.setActivePlayer(player, null, false)
    this.setInputForPlayer(player, null)
    this.setCharacterRaceForPlayer(player, null)
    this.setCharacterClassForPlayer(player, null)
    this.setCharacterAttributesForPlayer(player, null)
  }

  clearAllPlayerData () {
    this.setPlayerCount(0)
    this.clearPlayerData(Player1Keys.Player)
    this.clearPlayerData(Player2Keys.Player)
    this.clearPlayerData(Player3Keys.Player)
    this.clearPlayerData(Player4Keys.Player)
  }

  getActiveExit () {
    return this.game.registry.get(ActiveExitKey)
  }

  setActiveExit (exit) {
    const activeExit = this.getActiveExit()
    if (!activeExit) {
      this.game.registry.set(ActiveExitKey, exit)
    }
  }

  clearActiveExit () {
    this.game.registry.set(ActiveExitKey, null)
  }

  getDestinationLevelKey () {
    return this.getActiveExit()?.destinationLevelKey
  }
}

function createDebugCharacter (gameManager) {
  // TODO: All of this must be managed on the Title and/or Character Create Screen(s). Remove this and the whole function when we can do it properly
  gameManager.setActivePlayer(Player1Keys.Player, InputOptionsKeys.Gamepad1, true)
  gameManager.setActivePlayer(Player2Keys.Player, InputOptionsKeys.Arrows, true)
  // gameManager.setActivePlayer(Player3Keys.Player, null, false)
  // gameManager.setActivePlayer(Player4Keys.Player, null, false)
  // END TODO
}