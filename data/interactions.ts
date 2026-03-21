import { INTERACTION_TRIGGER, type Interaction } from "../types/Persona"
// examples to explore
// "Give tactical advice" → accomplishment (+1)
// "Mock failure" → conflict (+1) + friendliness ↓
// "Crack joke to lighten mood" → reinforcement (+1) + tension ↓
// # "argument", "bonding_moment", "desertion_risk", "morale_boost"

// Exact IPA 12 categories (Bales 1950/1970)
// const IPA_CATEGORIES = {
//   1: "Shows solidarity, raises other's status, gives help, reward",
//   2: "Shows tension release, jokes, laughs, shows satisfaction",  // (later versions sometimes "Dramatizes")
//   3: "Agrees, shows passive acceptance, understands, concurs, complies",
//   4: "Gives suggestion, direction implying autonomy for others",
//   5: "Gives opinion, evaluation, analysis, expresses feeling, wish",
//   6: "Gives orientation, information, repeats, clarifies, confirms",
//   7: "Asks for orientation, information, repetition, confirmation",
//   8: "Asks for opinion, evaluation, analysis, expression of feeling",
//   9: "Asks for suggestion, direction, possible ways of action",
//   10: "Disagrees, shows passive rejection, formality, withholds help",
//   11: "Shows tension, asks for help, withdraws out of field",
//   12: "Shows antagonism, deflates other's status, defends or asserts self"
// };
// Minimal, canonical drift per act (small increments; normalize -1..+1)
// const IPA_TO_SYMLOG_DRIFT = {
//   1: { positiveNegative: +0.08, upDown: +0.02 },          // solidarity → friendly + slight rise
//   2: { positiveNegative: +0.06 },                         // tension release → friendly
//   3: { positiveNegative: +0.05 },                         // agreement → friendly
//
//   4: { upDown: +0.07, forwardBackward: +0.04 },           // suggestion → dominant + structured
//   5: { upDown: +0.05, forwardBackward: +0.03 },           // opinion → somewhat dominant/structured
//   6: { upDown: +0.03 },                                   // information → slight dominant
//
//   7: { upDown: -0.05 },                                   // ask info → submissive
//   8: { upDown: -0.04 },                                   // ask opinion → submissive
//   9: { upDown: -0.06 },                                   // ask suggestion → submissive
//
//   10: { positiveNegative: -0.06, forwardBackward: -0.02 }, // disagree → unfriendly + slight nonconform
//   11: { positiveNegative: -0.04, forwardBackward: -0.05 }, // tension → unfriendly + withdrawal (backward)
//   12: { positiveNegative: -0.10, upDown: +0.08, forwardBackward: -0.04 } // antagonism → unfriendly + dominant + rebellious
// };
const interactions: Array<Interaction> = [{
  id: "unique_id",
  // most likely will need more flavour
  display_text: "QJ mi kura",
  strength: 1,
  delta: {
    tension: 0.1,
    trust: -0.1,
    dominant: 0.1,
    friendly: 0.1,
    compliant: 0.1,
  },
  // highest dominance + lowest mood
  trigger: INTERACTION_TRIGGER.BATTLE_LOSS,
  // trigger_chance: 1.0,
  condition: {
    'and': [
      { '>': [{ 'var': 'actor.tension' }, 0.5] },
      { '>': [{ 'var': 'target.tension' }, 0.5] }
    ]
  }
}]

export default interactions
