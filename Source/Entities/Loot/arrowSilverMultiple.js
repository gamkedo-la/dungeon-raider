import Loot from "./loot.js"
import { ArrowSilverMultipleImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from "../../Globals/weaponAttributes.js"

export default class ArrowSilverMultiple extends Loot {
  static Loot = {
    attribute: 'arrows',
    arrowType: 'Silver',
    name: WeaponNames.SilverArrow,
    value: 3
  }
  constructor (scene, config) {
    config.image = ArrowSilverMultipleImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArrowSilverMultiple.Loot}
  }
}
