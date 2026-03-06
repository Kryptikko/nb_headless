import _ from "lodash"
import { COMBAT_POSITION, COMBAT_EFFECT } from './types/Character.ts'
import type { Character } from './types/Character.ts'
import combat_effects from './combat_effect'

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


type CombatEvent = {
  ability: string,
  caster: string,
  target: string,
}
const combat_stack: Array<CombatEvent> = []
// export to a ability repository

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
  let ch: Character
  let queue_head = 0
  let enemy: Array<Character>
  do {
    turn++
    queue_head = (queue_head + 1) % queue.length
    ch = _.get(queue, queue_head)
    enemy = ch.position == COMBAT_POSITION.ATTACKER ? defenders : attackers
    _(enemy)
      // TODO: change to - is valid target (check if alive and can be attacked)
      .filter((ch) => ch.hp_now > 0)
      .take(ch.ability_primary.target_count)
      .forEach((target: Character) => {
        _.forEach(ch.ability_primary.effects, (effect: COMBAT_EFFECT) => {
          // the effet fn applies the changes to the targets, should return array of los
          log.push(combat_effects[effect](ch, target, ch.ability_primary))
        })
        // combat_stack.push({
        //   ability: ch.ability_primary.id,
        //   caster: ch.id,
        //   target: target.id
        // })
      })
    result = _is_combat_over(attackers, defenders)
  } while (result == COMBAT_RESULT.ONGOING)

  return log
}
