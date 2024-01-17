import Loot from "./loot.js"
import { ArrowMagicMultipleImage } from "../../Keys/imageKeys.js"

export default class ArrowMagicMultiple extends Loot {
  constructor (scene, config) {
    config.image = ArrowMagicMultipleImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {
      attribute: 'arrows',
      arrowType: 'Magic',
      value: 3
    }
  }
}
