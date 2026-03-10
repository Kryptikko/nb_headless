import type { CombatAbility } from "../../types/Character"
import type { WorldState } from "../../types/WorldState"

const TPL_EMPTY = " "
const TPL_FULL = "="
// const TPL_EMPTY = "░"
// const TPL_FULL = "█"
// HP 189 ▰▰▰▰▰▰▰▰▰▰▱▱  90%
// 89% HP  ████████████████████▒ 189/210
// [===========>    ] 189/210
// [██████████▍ ] 189/210
// ■■■■■□□□□□


export const ability_cast_bar = (ability: CombatAbility) => {
  let template = "          "
  let percent = Math.ceil((ability.cooldown_now / ability.cooldown) * 10)
  template = TPL_FULL.repeat(percent - 1) + TPL_EMPTY.repeat(10 - percent)
  return '[' + template + ']';

}

export const cast_bar = (duration: number, start_at: number, game_now: number) => {
  let template = "          "
  if (game_now > start_at && game_now < (start_at + duration)) {
    let percent = Math.ceil(((game_now - start_at) / duration) * 10)
    template = TPL_FULL.repeat(percent) + TPL_EMPTY.repeat(10 - percent)
  }
  return '[' + template + ']';
}

export default cast_bar
