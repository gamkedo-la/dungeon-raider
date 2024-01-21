import Loot from "./loot.js"
import { ArrowFireMultipleImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from "../../Globals/weaponAttributes.js"

export default class ArrowFireMultiple extends Loot {
  static Loot = {
    attribute: 'arrows',
    arrowType: 'Fire',
    name: WeaponNames.FireArrow,
    value: 3
  }
  constructor (scene, config) {
    config.image = ArrowFireMultipleImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArrowFireMultiple.Loot}
  }
}
