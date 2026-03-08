import type { Character } from "../../types/Character";

// 89% HP  ████████████████████▒ 189/210

const TPL_EMPTY = "▱"
const TPL_FULL = "▰"
export default (ch: Character) => {
  let hp_bar = ""
  if (ch.hp_now <= 0) hp_bar = '[          ]'
  else {
    let hp_percent = Math.ceil((ch.hp_now / ch.hp_max) * 10)
    for (let index = 0; index < 10; index++) {
      hp_percent--
      hp_bar += hp_percent >= 0 ? TPL_FULL : TPL_EMPTY
    }
    hp_bar = '[' + hp_bar + ']';
  }
  return hp_bar
}
