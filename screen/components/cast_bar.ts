import _ from "lodash"
import { try_get_component, type Casting, type Cooldown, type Entity, type World } from "../../lib/ecs"

const CD_TPL_EMPTY = " "
const CD_TPL_FULL = "-"
const TPL_EMPTY = "░"
const TPL_FULL = "█"
// HP 189 ▰▰▰▰▰▰▰▰▰▰▱▱  90%
// 89% HP  ████████████████████▒ 189/210
// [===========>    ] 189/210
// [██████████▍ ] 189/210
// ■■■■■□□□□□


// export const ability_cast_bar = (ctx: CombatAbilityContext) => {
//   const ability = get_ability(ctx.ability_id)
//   let template = "          "
//   let percent = _.clamp(Math.ceil((ctx.cooldown_now / ability.cooldown) * 10), 0, 10)
//   template = TPL_FULL.repeat(percent) + TPL_EMPTY.repeat(10 - percent)
// }

export const cast_bar = (duration: number, start_at: number, game_now: number) => {
  let template = "          "
  if (game_now > start_at && game_now < (start_at + duration)) {
    let percent = Math.ceil(((game_now - start_at) / duration) * 10)
    template = TPL_FULL.repeat(percent) + TPL_EMPTY.repeat(10 - percent)
  }
  return '[' + template + ']';
}

export const entity_cast_bar = (world: World, entity: Entity): string => {
  const cast = try_get_component<Casting>(world, entity, "Casting")
  const cooldown = try_get_component<Cooldown>(world, entity, "Cooldown")
  let template = "          "
  if (cooldown) {
    let percent = _.clamp(Math.ceil((cooldown.cooldown_now / cooldown.cooldown_max) * 10), 0, 10)
    template = CD_TPL_FULL.repeat(percent) + CD_TPL_EMPTY.repeat(10 - percent)
  }

  if (cast) {
    let percent = _.clamp(Math.ceil((cast.cast_now / cast.cast_max) * 10), 0, 10)
    template = TPL_FULL.repeat(percent) + TPL_EMPTY.repeat(10 - percent)
  }
  return '[' + template + ']';
}

export default cast_bar
