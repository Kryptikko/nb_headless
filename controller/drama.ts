import _ from "lodash"
import * as jsonLogic from "json-logic-js";
import type { Interaction, InteractionDelta, Persona, Relation } from "../types/Persona";
import { INTERACTION_TRIGGER } from "../types/Persona";
// import interactions from "../data/interactions";


const INTERACTION_TRIGGER_CHANCE = 0.3
const _interaction_cache: Record<INTERACTION_TRIGGER, Array<Interaction>> = {
  [INTERACTION_TRIGGER.BATTLE_LOSS]: [],
  [INTERACTION_TRIGGER.BATTLE_WIN]: [],
  [INTERACTION_TRIGGER.DUNGEON_COMPLETED]: [],
  [INTERACTION_TRIGGER.DUNGEON_FAILED]: [],
}
const _relationshio_graph: Record<string, Relation> = {}
// refactor out and use global world cache
let _cache_group: Record<string, Persona> = {}

const _apply_delta_to_relation = (delta: InteractionDelta, relation_id: string) => {
  const relation = _.get(_relationshio_graph, relation_id);
  // TODO: clamp values
  relation.tension += _.clamp(delta.tension || 0, 0, 1)
  relation.trust += _.clamp(delta.trust || 0, 0, 1)
  _.set(_relationshio_graph, relation_id, relation)
}

const _apply_delta = (delta: InteractionDelta, actor_id: string, target_id: string) => {
  const atot = [actor_id, target_id].join(',')
  const ttoa = [target_id, actor_id].join(',')
  _apply_delta_to_relation(delta, atot)
  _apply_delta_to_relation(delta, ttoa)
  // recalculate tension
  _.get(_cache_group, actor_id).memory.push('New Interaction record')
  _.get(_cache_group, target_id).memory.push('New Interaction record')
}

export default {
  init: (inter: Array<Interaction>) => {
    inter.forEach((interaction) => {
      _interaction_cache[interaction.trigger].push(interaction)
    })
  },
  init_group: (group: Array<Persona>) => {
    //TODO check if it exists
    //TODO exclude self relation
    _cache_group = _.keyBy(group, 'id')
    _.reduce(group, (aggr, persona, _all) => {
      _.forEach(group, (target: Persona) => {
        if (persona.id == target.id)
          return;
        const relation = _.get(aggr, [persona.id, target.id].join(','), {
          trust: 0,
          tension: 0,
        })
        _.set(aggr, [persona.id, target.id].join(','), relation)
      })
      return aggr
    }, _relationshio_graph)
  },
  // To clusters of both Actor & Partner
  // To mood, dominance/friendliness/expressiveness axes
  // To relation strength/trust/respect (bidirectional or asymmetric)
  trigger: (trig: INTERACTION_TRIGGER, force_trigger: boolean = false) => {
    if (_.random(0, 1) < INTERACTION_TRIGGER_CHANCE && force_trigger == false)
      return;
    var [actor, target] = _(_cache_group).values().shuffle().take(2).value()
    const populate_context = { actor, target };
    const matched = _.filter(_.get(_interaction_cache, trig),
      (interaction) => jsonLogic.apply(interaction.condition, populate_context))
    if (matched.length == 0) {
      console.log('No Interactions available for this trigger')
      return;
    }
    const interaction = _(matched).shuffle().first()
    console.log('Matched Interaction: ', interaction)
    // @ts-ignore
    _apply_delta(interaction.delta, actor.id, target.id)
  },
  // hmm shit
  get_interactions: (): Record<INTERACTION_TRIGGER, Array<Interaction>> => _interaction_cache,
  get_relations: (): Record<string, Relation> => _relationshio_graph,
  reset: () => { }
}
