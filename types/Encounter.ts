import type { Character } from "./Character"

export type CombatEncounter = {
  id: string,
  display_name: string,
  // copy loot distribution from the GD project
  enemies: Array<Character>,
  reward: Array<EncounterReward>,
}

type EncounterReward = {
  item_id: string,
  chance: number,
  amount: [number, number]
}
