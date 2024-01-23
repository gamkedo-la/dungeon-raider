import Loot from "./loot.js"
import { ArmorShieldImage } from "../../Keys/imageKeys.js"
import { ArmorNames } from '../../Globals/armorAttributes.js'

export default class ArmorShield extends Loot {
  static Loot = {
    attribute: 'armor',
    name: ArmorNames.Shield,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArmorShieldImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArmorShield.Loot}
  }
}
