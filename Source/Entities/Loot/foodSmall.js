import Loot from "./loot.js"
import { FoodSmallImage } from "../../Keys/imageKeys.js"

export default class FoodSmall extends Loot {
  constructor (scene, config) {
    config.image = FoodSmallImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'health',
      value: 10
    }
  }
}
