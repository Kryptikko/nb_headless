import type { CombatStatusEffet } from "../types/Character";
import { FireBoltDot } from "./abilities";

export const Burning: CombatStatusEffet = {
  id: "burning",
  source: "",
  visual: "🔥",
  ability: FireBoltDot
}
