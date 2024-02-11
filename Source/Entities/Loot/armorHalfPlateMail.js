import Loot from "./loot.js"
import { ArmorHalfPlateImage } from "../../Keys/imageKeys.js"
import { ArmorNames } from '../../Globals/armorAttributes.js'

export default class ArmorHalfPlate extends Loot {
  static Loot = {
    attribute: 'armor',
    name: ArmorNames.HalfPlate,
    value: 1
  }
  constructor (scene, config) {
    config.image = ArmorHalfPlateImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...ArmorHalfPlate.Loot}
  }
}
