import Loot from "./loot.js"
import { GoldPileImage } from "../../Keys/imageKeys.js"

export default class GoldPile extends Loot {
  constructor (scene, config) {
    config.image = GoldPileImage
    super(scene, config)
    this.radius = config.radius || 12
    this.loot = {
      attribute: 'gold',
      name: 'Gold Pile',
      value: 25
    }
  }
}
