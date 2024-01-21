import Loot from "./loot.js"
import { KeyImage } from "../../Keys/imageKeys.js"

export default class Key extends Loot {
  static Loot = {
    attribute: 'keys',
    name: 'Key',
    value: 1
  }
  constructor (scene, config) {
    config.image = KeyImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {...Key.Loot}
  }
}
