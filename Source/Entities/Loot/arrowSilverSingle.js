import Loot from "./loot.js"
import { ArrowSilverSingleImage } from "../../Keys/imageKeys.js"

export default class ArrowSilverSingle extends Loot {
  constructor (scene, config) {
    config.image = ArrowSilverSingleImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'arrows',
      arrowType: 'Silver',
      value: 1
    }
  }
}
