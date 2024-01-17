import Loot from "./loot.js"
import { ArrowNormalSingleImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from "../../Globals/weaponAttributes.js"

export default class ArrowNormalSingle extends Loot {
  constructor (scene, config) {
    config.image = ArrowNormalSingleImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'arrows',
      arrowType: 'Normal',
      name: WeaponNames.NormalArrow,
      value: 1
    }
  }
}
