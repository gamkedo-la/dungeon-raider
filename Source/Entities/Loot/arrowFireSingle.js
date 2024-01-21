import Loot from "./loot.js"
import { ArrowFireSingleImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from "../../Globals/weaponAttributes.js"

export default class ArrowFireSingle extends Loot {
  static Loot = {
    attribute: 'arrows',
    arrowType: 'Fire',
    name: WeaponNames.FireArrow,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArrowFireSingleImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...ArrowFireSingle.Loot}
  }
}
