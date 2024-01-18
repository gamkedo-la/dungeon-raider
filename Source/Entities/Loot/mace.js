import Loot from "./loot.js"
import { WeaponMaceImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponMace extends Loot {
  constructor (scene, config) {
    config.image = WeaponMaceImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'weapon',
      name: WeaponNames.Mace,
      value: 1
    }
  }
}
