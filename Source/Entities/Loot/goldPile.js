import Loot from "./loot.js"
import { GoldPileImage } from "../../Keys/imageKeys.js"

export default class GoldPile extends Loot {
  static Loot = {
    attribute: 'gold',
    name: 'Gold Pile',
    value: 25
  }
  constructor (scene, config) {
    config.image = GoldPileImage
    super(scene, config)
    this.radius = config.radius || 12
    this.loot = {...GoldPile.Loot}
  }
}
