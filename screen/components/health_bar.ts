import type { Character } from "../../types/Character";

// 89% HP  ████████████████████▒ 189/210

const TPL_EMPTY = "░"
const TPL_FULL = "█"
export default (ch: Character) => {
  return entity_health_bar(ch.hp_now, ch.hp_max)
}

export const entity_health_bar = (now: number, max: number, len: number = 10): string => {
  let hp_bar = ""
  // if (ch.hp_now <= 0) hp_bar = '[          ]'
  if (now <= 0) hp_bar = TPL_EMPTY.repeat(len)
  else {
    let hp_percent = Math.ceil((now / max) * len)
    for (let index = 0; index < len; index++) {
      hp_percent--
      hp_bar += hp_percent >= 0 ? TPL_FULL : TPL_EMPTY
    }
    // hp_bar = '[' + hp_bar + ']';
  }
  return hp_bar
}
