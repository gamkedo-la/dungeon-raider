import StoreItemTypes from "../Globals/storeItemTypes.js"
import StoreItem from "../Entities/Other/storeItem.js"
import { CharacterClasses } from "../Globals/characterAttributes.js"
import ImageKeys from "../Keys/imageKeys.js"

export default class StoreManager {
  constructor (scene, mapManager, collisionManager, gameManager) {
    this.scene = scene
    this.mapManager = mapManager
    this.collisionManager = collisionManager
    this.gameManager = gameManager

    this.characterCounts = getCharacterCounts(this.gameManager)
    this.storeItems = buildStoreItems(this.scene, this.mapManager, this.characterCounts, this.gameManager, this.collisionManager)
  }
}

function getCharacterCounts (gameManager) {
  const counts = {
    [CharacterClasses.Archer]: 0,
    [CharacterClasses.Warrior]: 0,
    [CharacterClasses.Magi]: 0,
    [CharacterClasses.Cleric]: 0
  }

  const activePlayers = gameManager.getActivePlayers()
  for (const activePlayer of activePlayers) {
    const characterClass = gameManager.getCharacterClassForPlayer(activePlayer)
    counts[characterClass]++
  }

  return counts
}

function buildStoreItems (scene, mapManager, characterCounts, gameManager, collisionManager) {
  const storeItems = []

  for (const storeItemData of mapManager.store.items) {
    let allowedItems = []
    for (const allowed of Object.keys(storeItemData)) {
      if (allowed.endsWith('Allowed') && storeItemData[allowed]) {
        allowedItems.push(allowed.replace('Allowed', ''))
      }
    }

    if (characterCounts.Archer <= 0) {
      allowedItems = allowedItems.filter(item => !item.includes('arrow') || !item.includes('Bow'))
    }

    if (characterCounts.Warrior <= 0) {
      allowedItems = allowedItems.filter(item => 
        !item.includes('Sword') ||
        !item.includes('axe') || !item.includes('Axe')
      )
    }

    if (characterCounts.Magi <= 0) {
      // TODO: need to remove any magi only items
    }

    if (characterCounts.Cleric <= 0) {
      // TODO: need to remove any cleric only items
    }

    if (characterCounts.Warrior + characterCounts.Cleric <= 0) {
      allowedItems = allowedItems.filter(item =>
        !item.includes('Sword') ||
        !item.includes('hammer') || !item.includes('Hammer') ||
        !item.includes('mace') || !item.includes('Mace') ||
        !item.includes('axe') || !item.includes('Axe') || 
        !item.includes('Mail') || !item.includes('Plate') ||
        !item.includes('shield') || !item.includes('helmet'))
    }

    if (characterCounts.Magi + characterCounts.Cleric <= 0) {
      // TODO: Remove all magic (scrolls, spells, wands, etc)
    }

    const config = {
      x: storeItemData.x,
      y: storeItemData.y,
      gameManager,
      collisionManager,
      mapManager
    }
    const index = Math.floor(Math.random() * allowedItems.length)
    config.price = mapManager.store.prices[allowedItems[index] + 'Cost']
    config.storeItemType = 'store' + allowedItems[index][0].toUpperCase() + allowedItems[index].slice(1)
    config.image = getImageForStoreItemType(config.storeItemType)

    const storeItem = new StoreItem(scene, config)
    collisionManager.addEntity(storeItem)
    storeItems.push(storeItem)    
  }

  return storeItems
}

function getImageForStoreItemType (storeItemType) {
  switch (storeItemType) {
    case StoreItemTypes.Armor.ChainMail:
      return ImageKeys.ArmorChainMailImage
    case StoreItemTypes.Armor.HalfPlateMail:
      return ImageKeys.ArmorHalfPlateMailImage
    case StoreItemTypes.Armor.Helmet:
      return ImageKeys.ArmorHelmetImage
    case StoreItemTypes.Armor.LeatherArmor:
      return ImageKeys.ArmorLeatherArmorImage
    case StoreItemTypes.Armor.PlateMail:
      return ImageKeys.ArmorPlateMailImage
    case StoreItemTypes.Armor.RingMail:
      return ImageKeys.ArmorRingMailImage
    case StoreItemTypes.Armor.Shield:
      return ImageKeys.ArmorShieldImage
    case StoreItemTypes.FoodLarge:
      return ImageKeys.FoodLargeImage
    case StoreItemTypes.FoodSmall:
      return ImageKeys.FoodSmallImage
    case StoreItemTypes.Key:
      return ImageKeys.KeyImage
    case StoreItemTypes.Weapons.ArrowFireMultiple:
      return ImageKeys.ArrowFireMultipleImage
    case StoreItemTypes.Weapons.ArrowFireSingle:
      return ImageKeys.ArrowFireSingleImage
    case StoreItemTypes.Weapons.ArrowMagicMultiple:
      return ImageKeys.ArrowMagicMultipleImage
    case StoreItemTypes.Weapons.ArrowMagicSingle:
      return ImageKeys.ArrowMagicSingleImage
    case StoreItemTypes.Weapons.ArrowNormalMultiple:
      return ImageKeys.ArrowNormalMultipleImage
    case StoreItemTypes.Weapons.ArrowNormalSingle:
      return ImageKeys.ArrowNormalSingleImage
    case StoreItemTypes.Weapons.ArrowSilverMultiple:
      return ImageKeys.ArrowSilverMultipleImage
    case StoreItemTypes.Weapons.ArrowSilverSingle:
      return ImageKeys.ArrowSilverSingleImage
    case StoreItemTypes.Weapons.Axe:
      return ImageKeys.WeaponAxeImage
    case StoreItemTypes.Weapons.BattleAxe:
      return ImageKeys.WeaponBattleAxeImage
    case StoreItemTypes.Weapons.FlangedMace:
      return ImageKeys.WeaponFlangedMaceImage
    case StoreItemTypes.Weapons.Hammer:
      return ImageKeys.WeaponHammerImage
    case StoreItemTypes.Weapons.HammerMagic:
      return ImageKeys.WeaponHammerMagicImage
    case StoreItemTypes.Weapons.LongBow:
      return ImageKeys.WeaponLongBowImage
    case StoreItemTypes.Weapons.LongSword:
      return ImageKeys.WeaponLongSwordImage
    case StoreItemTypes.Weapons.Mace:
      return ImageKeys.WeaponMaceImage
    case StoreItemTypes.Weapons.ShortBow:
      return ImageKeys.WeaponShortBowImage
    case StoreItemTypes.Weapons.ShortSword:
      return ImageKeys.WeaponShortSwordImage
    case StoreItemTypes.Weapons.WarHammer:
      return ImageKeys.WeaponWarHammerImage
    case StoreItemTypes.Weapons.WarHammerMagic:
      return ImageKeys.WeaponWarHammerMagicImage
    default:
      console.error(`Unknown store item type: ${storeItemType}`)
      return null
  }
}