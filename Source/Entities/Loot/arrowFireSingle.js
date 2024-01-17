import Loot from "./loot.js"
import { ArrowFireSingleImage } from "../../Keys/imageKeys.js"

export default class ArrowFireSingle extends Loot {
  constructor (scene, config) {
    config.image = ArrowFireSingleImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'arrows',
      arrowType: 'Fire',
      value: 1
    }
  }
}
