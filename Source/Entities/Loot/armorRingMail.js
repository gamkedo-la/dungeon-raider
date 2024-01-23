import Loot from "./loot.js"
import { ArmorRingMailImage } from "../../Keys/imageKeys.js"
import { ArmorNames } from '../../Globals/armorAttributes.js'

export default class ArmorRingMail extends Loot {
  static Loot = {
    attribute: 'armor',
    name: ArmorNames.RingMail,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArmorRingMailImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArmorRingMail.Loot}
  }
}
