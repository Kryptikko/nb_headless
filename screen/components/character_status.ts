import _ from "lodash"
import type { Character } from "../../types/Character"
import health_bar from "./health_bar"

export default (ch: Character) => {
  return _.padEnd(ch.display_name, 20, " ")
    + `HP ${health_bar(ch)}`
    + _.padEnd(` ${ch.hp_now}/${ch.hp_max}`, 10, " ")
}
