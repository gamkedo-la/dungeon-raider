import Loot from "./loot.js"
import { WeaponHammerImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponHammer extends Loot {
  constructor (scene, config) {
    config.image = WeaponHammerImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'weapon',
      name: WeaponNames.Hammer,
      value: 1
    }
  }
}
