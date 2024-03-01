import Loot from "./loot.js"
import { WeaponStaffImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponStaff extends Loot {
  static Loot = {
    attribute: 'weapon',
    name: WeaponNames.Staff,
    value: 1
  }
  constructor (scene, config) {
    config.image = WeaponStaffImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...WeaponStaff.Loot}
  }
}
