import Loot from "./loot.js"
import { ArrowFireMultipleImage } from "../../Keys/imageKeys.js"

export default class ArrowFireMultiple extends Loot {
  constructor (scene, config) {
    config.image = ArrowFireMultipleImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {
      attribute: 'arrows',
      arrowType: 'Fire',
      value: 3
    }
  }
}
