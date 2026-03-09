import _ from "lodash"
import type { Character } from "../../types/Character";

// 4 states, appear, highhted, cooldown, invisible
// style appear == cooldown
export default (ch: Character) => {
  let indicator = ch.status.reduce((acc, st) => acc + st.visual, "")
  return _.padEnd(indicator, 5, ' ')
}
