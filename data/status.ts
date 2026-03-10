import type { CombatEffect } from "../types/Character";
import { FireBoltDot } from "./abilities";

export const Burning: CombatEffect = {
  id: "burning",
  source: "",
  visual: "🔥",
  ability: FireBoltDot
}
// 2 implementations damage and stat modifier
// direct damage
// dot damage
// offensive stat modifier
// heal 
// buff
