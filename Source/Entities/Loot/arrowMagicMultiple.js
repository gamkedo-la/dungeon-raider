import Loot from "./loot.js"
import { ArrowMagicMultipleImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from "../../Globals/weaponAttributes.js"

export default class ArrowMagicMultiple extends Loot {
  static Loot = {
    attribute: 'arrows',
    arrowType: 'Magic',
    name: WeaponNames.MagicArrow,
    value: 3
  }
  constructor (scene, config) {
    config.image = ArrowMagicMultipleImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArrowMagicMultiple.Loot}
  }
}
