import Loot from "./loot.js"
import { WeaponBattleAxeImage } from "../../Keys/imageKeys.js"
import { WeaponNames } from '../../Globals/weaponAttributes.js'

export default class WeaponBattleAxe extends Loot {
  static Loot = {
    attribute: 'weapon',
    name: WeaponNames.BattleAxe,
    value: 1
  }
  constructor (scene, config) {
    config.image = WeaponBattleAxeImage
    super(scene, config)
    this.radius = config.radius || 16
    this.loot = {...WeaponBattleAxe.Loot}
  }
}
