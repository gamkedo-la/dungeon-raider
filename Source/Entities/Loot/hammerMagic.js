import Loot from "./loot.js"
import { WeaponHammerMagicImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponHammerMagic extends Loot {
  constructor (scene, config) {
    config.image = WeaponHammerMagicImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'weapon',
      name: WeaponNames.HammerMagic,
      value: 1
    }
  }
}
