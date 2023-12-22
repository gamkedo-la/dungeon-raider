import Loot from "./loot.js"
import { GoldFivePiecesImage } from "../../Keys/imageKeys.js"

export default class GoldFivePieces extends Loot {
  constructor (scene, config) {
    config.image = GoldFivePiecesImage
    super(scene, config)
    this.radius = config.radius || 12
    this.loot = {
      attribute: 'gold',
      value: 25
    }
  }
}
