import _, { at } from "lodash"
import { COMBAT_POSITION } from './types/Character.ts'
import type { Character } from './types/Character.ts'

// const attackers: Array<Character> = []
// const defenders: Array<Character> = []

const log: Array<string> = []
// const result = ?
enum COMBAT_RESULT {
  ONGOING,
  ATTACKER_WIN,
  DEFENDER_WIN,
}
export const _is_combat_over = (attackers: Array<Character>, defenders: Array<Character>): COMBAT_RESULT => {
  if (!_.find(attackers, att => att.hp_now > 0)) return COMBAT_RESULT.DEFENDER_WIN;
  if (!_.find(defenders, att => att.hp_now > 0)) return COMBAT_RESULT.ATTACKER_WIN;

  return COMBAT_RESULT.ONGOING
}
export const combat_simulation = (attackers: Array<Character>, defenders: Array<Character>) => {

  if (_.isEmpty(attackers) || _.isEmpty(defenders))
    return []
  _.map(attackers, att => {
    att.position = COMBAT_POSITION.ATTACKER
    return att
  });
  _.map(defenders, def => {
    def.position = COMBAT_POSITION.DEFENDER
    return def
  });
  const queue: Array<Character> = _.chain(attackers)
    .concat(defenders)
    .sortBy('ini')
    .reverse()
    .value()
  let result: COMBAT_RESULT = COMBAT_RESULT.ONGOING
  let turn = 0
  do {
    turn++
    queue.forEach((ch: Character) => {
      const enemy = ch.position == COMBAT_POSITION.ATTACKER ? defenders : attackers
      _(enemy)
        .filter((ch) => ch.hp_now > 0)
        .take(1)
        .forEach((target: Character) => {
          const damage = Math.max(target.def - ch.att, 1)
          target.hp_now -= damage
          // detect if dead
          // add damage log
          log.push(`${turn} - ${ch.display_name} hits ${target.display_name} for 💥 -${damage}!`)
        })
      result = _is_combat_over(attackers, defenders)
    })
  } while (result == COMBAT_RESULT.ONGOING)

  return log
}
