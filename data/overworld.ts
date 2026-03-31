import type { Zone } from "../types/OverWorld"


const repo: Record<string, Zone> = {
  "Plains": {
    display_name: "Plains",
    description: "Peaceful grasslands.",
    visual: "🌾",
    activities: [
      { name: "Explore the Fields", action: "explore" },
      { name: "Hunt Small Game", action: "hunt" },
      { name: "Rest at Campfire", action: "rest" },
      { name: "Travel to Next Area", action: "travel" }
    ]
  },

  "Forest": {
    display_name: "Forest",
    description: "Some Forest.",
    visual: "🌲",
    activities: [
      { name: "Forage for Herbs", action: "forage" },
      { name: "Hunt Wildlife", action: "hunt" },
      { name: "Enter Goblin Cave", action: "dungeon" },
      { name: "Travel to Next Area", action: "travel" }
    ]
  },

  "Mountains": {
    display_name: "Mountains",
    description: "Rugged mountains with dwarven ruins.",
    visual: "⛰️ ",
    activities: [
      { name: "Mine for Ore", action: "mine" },
      { name: "Climb to the Summit", action: "climb" },
      { name: "Enter Ancient Ruins", action: "dungeon" },
      { name: "Travel to Next Area", action: "travel" }
    ]
  },

  "Town Hub": {
    display_name: 'Town Hub',
    description: "Bustling riverside town with market and tavern.",
    visual: "🏘️ ",
    activities: [
      { name: "Visit Market", action: "shop" },
      { name: "Go to Tavern", action: "tavern" },
      { name: "Talk to Townsfolk", action: "quest" },
      { name: "Rest at Inn", action: "rest" },
      { name: "Travel to Next Area", action: "travel" }
    ]
  }
}

export default repo
