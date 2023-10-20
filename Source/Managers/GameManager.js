import { CharacterClasses, Races } from "../Globals/characterAttributes.js"
import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"

export const GameManagerKey = 'game-manager'

export default class GameManager {
  constructor (game) {
    this.game = game

    // TODO: Remove this when we have a proper menu
    this.setPlayerRace(Player1Keys.Player, Races.Elf)
    this.setPlayerClass(Player1Keys.Player, CharacterClasses.Warrior)
    // END TODO
  }

  getPlayerRace (player) {
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

  setPlayerRace (player, race) {
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

  getPlayerClass (player) {
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

  setPlayerClass (player, characterClass) {
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

  getPlayerLives (player) {
    switch (player) {
      case Player1Keys.Player:
        return this.game.registry.get(Player1Keys.Lives)
      case Player2Keys.Player:
        return this.game.registry.get(Player2Keys.Lives)
      case Player3Keys.Player:
        return this.game.registry.get(Player3Keys.Lives)
      case Player4Keys.Player:
        return this.game.registry.get(Player4Keys.Lives)
    }
  }

  setPlayerLives (player, lives) {
    switch (player) {
      case Player1Keys.Player:
        this.game.registry.set(Player1Keys.Lives, lives)
        break
      case Player2Keys.Player:
        this.game.registry.set(Player2Keys.Lives, lives)
        break
      case Player3Keys.Player:
        this.game.registry.set(Player3Keys.Lives, lives)
        break
      case Player4Keys.Player:
        this.game.registry.set(Player4Keys.Lives, lives)
        break
    }
  }

  getPlayerHealth (player) {
    switch (player) {
      case Player1Keys.Player:
        return this.game.registry.get(Player1Keys.Health)
      case Player2Keys.Player:
        return this.game.registry.get(Player2Keys.Health)
      case Player3Keys.Player:
        return this.game.registry.get(Player3Keys.Health)
      case Player4Keys.Player:
        return this.game.registry.get(Player4Keys.Health)
    }
  }

  setPlayerHealth (player, health) {
    switch (player) {
      case Player1Keys.Player:
        this.game.registry.set(Player1Keys.Health, health)
        break
      case Player2Keys.Player:
        this.game.registry.set(Player2Keys.Health, health)
        break
      case Player3Keys.Player:
        this.game.registry.set(Player3Keys.Health, health)
        break
      case Player4Keys.Player:
        this.game.registry.set(Player4Keys.Health, health)
        break
    }
  }
}