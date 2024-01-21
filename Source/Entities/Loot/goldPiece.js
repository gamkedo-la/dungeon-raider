import Loot from "./loot.js"
import { GoldPieceImage } from "../../Keys/imageKeys.js"

export default class GoldPiece extends Loot {
  static Loot = {
    attribute: 'gold',
    name: 'Gold Piece',
    value: 10
  }
  constructor (scene, config) {
    config.image = GoldPieceImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...GoldPiece.Loot}
  }
}
