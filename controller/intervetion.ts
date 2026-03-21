import _ from "lodash"
import * as jsonLogic from "json-logic-js";
import type { Interaction, InteractionContext, Persona, Relation } from "../types/Persona";
import { INTERACTION_TRIGGER } from "../types/Persona";
import interactions from "../data/interactions";


const _interaction_cache: Record<INTERACTION_TRIGGER, Array<Interaction>> = {
  [INTERACTION_TRIGGER.BATTLE_LOSS]: [],
  [INTERACTION_TRIGGER.BATTLE_WIN]: [],
  [INTERACTION_TRIGGER.DUNGEON_COMPLETED]: [],
  [INTERACTION_TRIGGER.DUNGEON_FAILED]: [],
}
const _relationshio_graph: Record<string, Relation> = {}
// refactor out and use global world cache
let _cache_group: Array<Persona> = []


const _pick_one = (options: Array<Interaction>) => {
  let index = 0
  _.reduce(options, (aggr, opt) => {
    aggr[opt.id] = index + opt.trigger_chance
  }, {})
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
    const rel_target_actor = _relationshio_graph[`${context.target},${context.actor}`]
    const rel_actor_target = _relationshio_graph[`${context.actor},${context.target}`]

    const matched = _.filter(_.get(_interaction_cache, trig),
      (interaction) => jsonLogic.apply(interaction.condition, populate_context))
    console.log('Matched Interaction: ', matched)
  },
  // hmm shit
  get_interactions: (): Record<INTERACTION_TRIGGER, Array<Interaction>> => _interaction_cache,
  get_relations: (): Record<string, Relation> => _relationshio_graph,
  reset: () => { }
}
