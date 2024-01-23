import Loot from "./loot.js"
import { ArmorChainMailImage } from "../../Keys/imageKeys.js"
import { ArmorNames } from '../../Globals/armorAttributes.js'

export default class ArmorChainMail extends Loot {
  static Loot = {
    attribute: 'armor',
    name: ArmorNames.ChainMail,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArmorChainMailImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArmorChainMail.Loot}
  }
}
