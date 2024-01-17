import Loot from "./loot.js"
import { FoodLargeImage } from "../../Keys/imageKeys.js"

export default class FoodLarge extends Loot {
  constructor (scene, config) {
    config.image = FoodLargeImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {
      attribute: 'health',
      name: 'Large Food',
      value: 25
    }
  }
}
