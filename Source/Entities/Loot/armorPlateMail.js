import Loot from "./loot.js"
import { ArmorPlateMailImage } from "../../Keys/imageKeys.js"
import { ArmorNames } from '../../Globals/armorAttributes.js'

export default class ArmorPlateMail extends Loot {
  static Loot = {
    attribute: 'armor',
    name: ArmorNames.PlateMail,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArmorPlateMailImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArmorPlateMail.Loot}
  }
}
