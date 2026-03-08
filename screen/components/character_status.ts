import _ from "lodash"
import type { Character } from "../../types/Character"
import health_bar from "./health_bar"

export default (ch: Character) => {
  return _.padEnd(ch.display_name, 16, " ") + `👨‍🦰 ${health_bar(ch)}` + _.padEnd(` ${ch.hp_now}/${ch.hp_max}`, 8, " ")
}
