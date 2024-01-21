import Loot from "./loot.js"
import { FoodSmallImage } from "../../Keys/imageKeys.js"

export default class FoodSmall extends Loot {
  static Loot = {
    attribute: 'health',
    name: 'Small Food',
    value: 10
  }
  constructor (scene, config) {
    config.image = FoodSmallImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...FoodSmall.Loot}
  }
}
