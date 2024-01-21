import Loot from "./loot.js"
import { WeaponMaceImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponMace extends Loot {
  static Loot = {
    attribute: 'weapon',
    name: WeaponNames.Mace,
    value: 1
  }
  constructor (scene, config) {
    config.image = WeaponMaceImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...WeaponMace.Loot}
  }
}
