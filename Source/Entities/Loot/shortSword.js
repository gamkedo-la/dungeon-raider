import Loot from "./loot.js"
import { WeaponShortSwordImage } from "../../Keys/imageKeys.js"

export default class WeaponShortSword extends Loot {
  constructor (scene, config) {
    config.image = WeaponShortSwordImage
    super(scene, config)
    this.radius = config.radius || 8
    this.loot = {
      attribute: 'arrows',
      arrowType: 'Silver',
      value: 1
    }
  }
}
