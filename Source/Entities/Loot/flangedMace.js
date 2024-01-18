import Loot from "./loot.js"
import { WeaponFlangedMaceImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponFlangedMace extends Loot {
  constructor (scene, config) {
    config.image = WeaponFlangedMaceImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {
      attribute: 'weapon',
      name: WeaponNames.FlangedMace,
      value: 1
    }
  }
}
