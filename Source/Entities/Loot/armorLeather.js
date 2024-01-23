import Loot from "./loot.js"
import { ArmorLeatherImage } from "../../Keys/imageKeys.js"
import { ArmorNames } from '../../Globals/armorAttributes.js'

export default class ArmorLeather extends Loot {
  static Loot = {
    attribute: 'armor',
    name: ArmorNames.Leather,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArmorLeatherImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArmorLeather.Loot}
  }
}
