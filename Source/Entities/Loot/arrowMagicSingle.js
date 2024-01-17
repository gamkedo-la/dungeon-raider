import Loot from "./loot.js"
import { ArrowMagicSingleImage } from "../../Keys/imageKeys.js"

export default class ArrowMagicSingle extends Loot {
  constructor (scene, config) {
    config.image = ArrowMagicSingleImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'arrows',
      arrowType: 'Magic',
      value: 1
    }
  }
}
