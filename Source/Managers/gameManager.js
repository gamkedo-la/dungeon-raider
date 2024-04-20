import { Player1Keys, Player2Keys, Player3Keys, Player4Keys } from "../Keys/playerPropertyKeys.js"
import InputOptionsKeys from "../Keys/inputOptionsKeys.js"
import InputEventKeys from "../Keys/inputEventKeys.js"
import InterLevel from "../Scenes/interLevelScene.js"
import SceneKeys from "../Keys/sceneKeys.js"
import Level1 from "../Scenes/GameScenes.js/level1.js"
import Level2 from "../Scenes/GameScenes.js/level2.js"
import Level3 from "../Scenes/GameScenes.js/level3.js"
import { LevelKeys } from "../Keys/sceneKeys.js"

export const GameManagerKey = 'game-manager'
export const PlayerCountKey = 'player-count'
export const CharacterCountKey = 'character-count'
export const ActiveExitKey = 'active-exit'
export const MapChangesKey = 'map-changes'
export const TileDamagedKey = 'tile-damaged'
export const TileDestroyedKey = 'tile-destroyed'

export const DestroyedKey = 'destroyed'

const gamepads = {}

export default class GameManager {
  constructor (game) {
    this.game = game

		const mapChanges = {}
    const damagedTiles = {}
    const destroyedTiles = {}
    for (const key in LevelKeys) {
			mapChanges[LevelKeys[key]] = {
				[DestroyedKey]: []
			}

      damagedTiles[LevelKeys[key]] = []
      destroyedTiles[LevelKeys[key]] = []
    }

		this.setMapChanges(mapChanges)
    this.setDamagedTiles(damagedTiles)
    this.setDestroyedTiles(destroyedTiles)
  }

  getPlayerCount () {
    return this.game.registry.get(PlayerCountKey)
  }

  setPlayerCount (playerCount) {
    this.game.registry.set(PlayerCountKey, playerCount)
  }

  getCharacterCount () {
    return this.game.registry.get(CharacterCountKey)
  }

  setCharacterCount (characterCount) {
    this.game.registry.set(CharacterCountKey, characterCount)
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

  getGamepadLabelForPad (pad) {
    return gamepads[pad.index]
  }

  addGamepad (gamepad) {
    if (!Object.values(gamepads).map(gp => gp.index).includes(gamepad.index)) {
      switch (Object.keys(gamepads).length) {
        case 0:
          gamepads[gamepad.index] = InputOptionsKeys.Gamepad1
          break
        case 1:
          gamepads[gamepad.index] = InputOptionsKeys.Gamepad2
          break
        case 2:
          gamepads[gamepad.index] = InputOptionsKeys.Gamepad3
          break
        case 3:
          gamepads[gamepad.index] = InputOptionsKeys.Gamepad4
          break
        default:
          console.warn(`GameManager.addGamepad: Too many gamepads. Ignoring gamepad ${gamepad.index}`)
          return
      }
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
    this.setCharacterCount(0)
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

  goToInterLevelScene () {
    if (this.getActiveExit().destinationLevelKey === 'credits') {
      this.game.scene.start(SceneKeys.Credits)
    } else {
      this.game.scene.add(SceneKeys.InterLevel, new InterLevel(), true)
    }
  }

  goToLevel (levelKey) {
    this.game.scene.add(levelKey, buildLevelForKey(levelKey), true)
  }

	getMapChanges() {
		return this.game.registry.get(MapChangesKey)
	}

	setMapChanges(value) {
		this.game.registry.set(MapChangesKey, value)
	}

  getDamagedTiles() {
    return this.game.registry.get(TileDamagedKey)
  }

  setDamagedTiles(value) {
    this.game.registry.set(TileDamagedKey, value)
  }

  getDestroyedTiles() {
    return this.game.registry.get(TileDestroyedKey)
  }

  setDestroyedTiles(value) {
    this.game.registry.set(TileDestroyedKey, value)
  }
	
	destroyObject(levelKey, objectId) {
		let mapChanges = this.getMapChanges()
		mapChanges[levelKey][DestroyedKey].push(objectId)
		this.setMapChanges(mapChanges)
	}

	isObjectDestroyed(levelKey, objectId) {
		return this.getMapChanges()[levelKey][DestroyedKey].includes(objectId)
	}

  damageTile (levelKey, tile) {
    const damagedTiles = this.getDamagedTiles()
    damagedTiles[levelKey].push({ x: tile.x, y: tile.y })
    this.setDamagedTiles(damagedTiles)
  }

  isTileDamaged (levelKey, tile) {
    const damagedTiles = this.getDamagedTiles()
    if (!damagedTiles[levelKey]) return false

    return this.getDamagedTiles()[levelKey].find(t => t.x === tile.x && t.y === tile.y)
  }
  
  destroyTile (levelKey, tile) {
    const damagedTiles = this.getDamagedTiles()
    damagedTiles[levelKey] = damagedTiles[levelKey].filter(t => t.x !== tile.x || t.y !== tile.y)
    this.setDamagedTiles(damagedTiles)

    const destroyedTiles = this.getDestroyedTiles()
    destroyedTiles[levelKey].push({ x: tile.x, y: tile.y })
    this.setDestroyedTiles(destroyedTiles)
  }

  isTileDestroyed (levelKey, tile) {
    return this.getDestroyedTiles()[levelKey].find(t => t.x === tile.x && t.y === tile.y)
  }
}

function buildLevelForKey (key) {
  switch (key) {
    case SceneKeys.Level1:
      return new Level1()
    case SceneKeys.Level2:
      return new Level2()
    case SceneKeys.Level3:
      return new Level3()
    default:
      console.warn(`buildLevelForKey: Invalid Level Key: ${key}. See gameManager.js`)
      return new GameLevel(key)
  }
}