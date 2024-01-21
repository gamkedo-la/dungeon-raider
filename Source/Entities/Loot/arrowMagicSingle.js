import Loot from "./loot.js"
import { ArrowMagicSingleImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from "../../Globals/weaponAttributes.js"

export default class ArrowMagicSingle extends Loot {
  static Loot = {
    attribute: 'arrows',
    arrowType: 'Magic',
    name: WeaponNames.MagicArrow,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArrowMagicSingleImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...ArrowMagicSingle.Loot}
  }
}
