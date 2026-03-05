import type { Character } from "./Character"

export type CombatEncounter = {
  display_name: string,
  // copy loot distribution from the GD project
  enemies: Array<Character>,
  loot: Array<LootDrop>,
}
enum ITEM {
  CLUB,
  BONE,
}
type LootDrop = {
  chance: number,
  amount: number,
  item: ITEM
}
