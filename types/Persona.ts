import type { RulesLogic } from "json-logic-js"

// SYMLOG three bipolar dimensions (exact from Bales/SYMLOG)
// const SYMLOG_DIMENSIONS = {
//   UD: 'upDown',           // + = Upward (dominant, assertive, prominent); - = Downward (submissive, passive)
//   PN: 'positiveNegative', // + = Positive (friendly, warm, cooperative); - = Negative (unfriendly, cold, hostile)
//   FB: 'forwardBackward'   // + = Forward (accepting authority/task structure, conforming); - = Backward (nonconforming, rebellious, expressive)
// };
export type Persona = {
  id: string,
  // need_action: number,
  // need_socialization: number,
  // need_mastery: number,
  // need_achievment: number,
  // need_immersion: number,
  // need_creation: number,
  // aggragate: Relation,
  base_dominant: number,
  base_friendly: number,
  base_compliant: number,
  dominant: number,
  friendly: number,
  // compliance vs expressiveness
  compliant: number,

  // IPA stat will diminish in different rates
  // TODO: figur out the good moments for this
  tension: number
  morale: number
  memory: Array<string>
  // cohesion: number// overall solidarity / interpersonal attraction
  // status_differentiation: float = 3.0 # how unequal perceived status is (low = egalitarian)
  // group status, prestige
  // # Behavioral history counters (Bales/SYMLOG clusters, per session or lifetime)
  //     "accomplishment": 0,
  //     "complementary": 0,     # questions/clarifications
  //     "reinforcement": 0,     # positive socio
  //     "tension": 0,
  //     "conflict": 0,
  //     "withdrawal": 0
}

export type Party = {
  cohesion: number
  // performance: f(cohesion)
  // salience - property of a thing that shows how have visible it is
}

export type Relation = {
  // base and current, have them drift
  // dominant: number,
  // friendly: number,
  // compliant: number,

  // are they friends
  // influence: number,
  // affluent, respect
  trust: number // -1.0f to +1.0f
  tension: number
}
export enum INTERACTION_TRIGGER {
  BATTLE_WIN,
  BATTLE_LOSS,
  DUNGEON_COMPLETED,
  DUNGEON_FAILED,
}

export type Interaction = {
  id: string
  display_text: string
  strength: number  // 0-1.0f how public this is?
  // delta: Relation // or evaluation
  delta: InteractionDelta,
  trigger: INTERACTION_TRIGGER,
  // trigger_chance: number // float 0.0 - 1.0f
  condition: RulesLogic
}

export type InteractionDelta = {
  // SYMLOG
  dominant?: number,
  friendly?: number,
  compliant?: number,
  // IPA
  trust?: number // -1.0f to +1.0f
  tension?: number
  morale?: number,
}

export type InterventionAction = {
  display_text: string
  delta: InteractionDelta,
}

export type Intervention = Interaction & {
  actons: Array<InterventionAction>
}

// query?
export type InteractionContext = {
  actor: string // should be persona id
  target: string
}
