import Loot from "./loot.js"
import { WeaponAxeImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponAxe extends Loot {
  constructor (scene, config) {
    config.image = WeaponAxeImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'weapon',
      name: WeaponNames.Axe,
      value: 1
    }
  }
}
