import Loot from "./loot.js"
import { WeaponWarHammerImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponWarHammer extends Loot {
  constructor (scene, config) {
    config.image = WeaponWarHammerImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'weapon',
      name: WeaponNames.WarHammer,
      value: 1
    }
  }
}
