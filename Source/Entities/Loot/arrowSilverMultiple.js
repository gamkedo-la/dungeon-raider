import Loot from "./loot.js"
import { ArrowSilverMultipleImage } from "../../Keys/imageKeys.js"

export default class ArrowSilverMultiple extends Loot {
  constructor (scene, config) {
    config.image = ArrowSilverMultipleImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {
      attribute: 'arrows',
      arrowType: 'Silver',
      value: 3
    }
  }
}
