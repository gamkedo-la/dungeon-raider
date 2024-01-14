import Loot from "./loot.js"
import { GoldPieceImage } from "../../Keys/imageKeys.js"

export default class GoldPiece extends Loot {
  constructor (scene, config) {
    config.image = GoldPieceImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'gold',
      value: 10
    }
  }
}
