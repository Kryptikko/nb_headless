import _ from "lodash"
import * as jsonLogic from "json-logic-js";
import type { Interaction, InteractionContext, Intervention, Persona, Relation } from "../types/Persona";
import { INTERACTION_TRIGGER } from "../types/Persona";


const _intervention_cache: Record<INTERACTION_TRIGGER, Array<Interaction>> = {
  [INTERACTION_TRIGGER.BATTLE_LOSS]: [],
  [INTERACTION_TRIGGER.BATTLE_WIN]: [],
  [INTERACTION_TRIGGER.DUNGEON_COMPLETED]: [],
  [INTERACTION_TRIGGER.DUNGEON_FAILED]: [],
}
const _relationshio_graph: Record<string, Relation> = {}
// refactor out and use global world cache
let _cache_group: Array<Persona> = []

export default {
  init: (inter: Array<Intervention>) => {
    inter.forEach((intervention) => {
      _intervention_cache[intervention.trigger].push(intervention)
    })
  },
  init_group: (group: Array<Persona>) => {
    //TODO check if it exists
    //TODO exclude self relation
    _cache_group = group
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
  trigger: (trig: INTERACTION_TRIGGER, context: InteractionContext) => {
    // use a dict
    const populate_context = {
      actor: _.find(_cache_group, mem => mem.id == context.actor),
      target: _.find(_cache_group, mem => mem.id == context.target),
    }
    // const rel_target_actor = _relationshio_graph[`${context.target},${context.actor}`]
    // const rel_actor_target = _relationshio_graph[`${context.actor},${context.target}`]

    const matched = _.filter(_.get(_intervention_cache, trig),
      (interaction) => jsonLogic.apply(interaction.condition, populate_context))
    console.log('Matched Interaction: ', matched)
  },
  // hmm shit
  get_interactions: (): Record<INTERACTION_TRIGGER, Array<Interaction>> => _intervention_cache,
  get_relations: (): Record<string, Relation> => _relationshio_graph,
  reset: () => { }
}
