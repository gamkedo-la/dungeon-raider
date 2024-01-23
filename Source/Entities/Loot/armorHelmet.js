import Loot from "./loot.js"
import { ArmorHelmetImage } from "../../Keys/imageKeys.js"
import { ArmorNames } from '../../Globals/armorAttributes.js'

export default class ArmorHelmet extends Loot {
  static Loot = {
    attribute: 'armor',
    name: ArmorNames.Helmet,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArmorHelmetImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArmorHelmet.Loot}
  }
}
