import Loot from "./loot.js"
import { ArrowNormalMultipleImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from "../../Globals/weaponAttributes.js"

export default class ArrowNormalMultiple extends Loot {
  static Loot = {
    attribute: 'arrows',
    arrowType: 'Normal',
    name: WeaponNames.NormalArrow,
    value: 3
  }
  constructor (scene, config) {
    config.image = ArrowNormalMultipleImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArrowNormalMultiple.Loot}
  }
}
