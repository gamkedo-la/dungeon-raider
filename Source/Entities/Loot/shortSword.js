import Loot from "./loot.js"
import { WeaponShortSwordImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponShortSword extends Loot {
  constructor (scene, config) {
    config.image = WeaponShortSwordImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'weapon',
      name: WeaponNames.ShortSword,
      value: 1
    }
  }
}
