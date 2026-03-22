import _ from "lodash"
import type { Relation } from "../types/Persona";
import type { WorldState } from "../types/WorldState";

const _to_id = (...args: Array<string>): string => _.join(args, ',')
const _default: Relation = {
  trust: 0,
  tension: 0,
}

export default {
  get: (world: WorldState, actor_id: string, target_id: string) => {
    return _.get(world.relation, _to_id(actor_id, target_id), { ..._default })
  },
  set: (world: WorldState, actor_id: string, target_id: string, relation: Relation) => {
    return _.set(world.relation, _to_id(actor_id, target_id), relation)
  }
}
