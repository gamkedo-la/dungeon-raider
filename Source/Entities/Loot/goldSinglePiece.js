import Loot from "./loot.js"
import { GoldSinglePieceImage } from "../../Keys/imageKeys.js"

export default class GoldSinglePiece extends Loot {
  constructor (scene, config) {
    config.image = GoldSinglePieceImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'gold',
      value: 10
    }
  }
}
