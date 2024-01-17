import Loot from "./loot.js"
import { KeyImage } from "../../Keys/imageKeys.js"

export default class FoodSmall extends Loot {
  constructor (scene, config) {
    config.image = KeyImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'keys',
      name: 'Key',
      value: 1
    }
  }
}
