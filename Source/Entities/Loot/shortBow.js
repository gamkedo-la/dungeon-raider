import Loot from "./loot.js"
import { WeaponShortBowImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponShortBow extends Loot {
  static Loot = {
    attribute: 'weapon',
    name: WeaponNames.ShortBow,
    value: 1
  }
  constructor (scene, config) {
    config.image = WeaponShortBowImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...WeaponShortBow.Loot}
  }
}
