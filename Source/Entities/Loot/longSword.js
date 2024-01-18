import Loot from "./loot.js"
import { WeaponLongSwordImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponLongSword extends Loot {
  constructor (scene, config) {
    config.image = WeaponLongSwordImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {
      attribute: 'weapon',
      name: WeaponNames.LongSword,
      value: 1
    }
  }
}
