import Loot from "./loot.js"
import { WeaponLongBowImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponLongBow extends Loot {
  static Loot = {
    attribute: 'weapon',
    name: WeaponNames.LongBow,
    value: 1
  }
  constructor (scene, config) {
    config.image = WeaponLongBowImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...WeaponLongBow.Loot}
  }
}
