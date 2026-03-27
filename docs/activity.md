# Activities
Guild Members partake in activities when they are playing the game.
The player can assign a guild member to an activity by using a resource (?).

Activities happen in certain areas of the Over-World.
The same activity might provide different outcomes depending on the area where its assigned.
Example: 
- Questing 
- Grinding? 
- Farming resources (mining, gathering herbs, fishing!, skinning?)

!TBD:
Members enjoy certain activities based on their needs.
Use the need based AI to navigate member preferences and the resource cost.

# Over-World
The Over-World is the interface for the player to assign activities.
It consists of regions that list the possible activities.

# Over-World Region
Over-World Regions are zones on the overworld that show certain possible activities.
Regions are made available as the player progresses through the game. 
The progression can be gated by Soft and Hard gates:
 - Soft gates are minimum level for the zone
 - Hard gates unlocks at a certain time after starting the game 
  - example 2 months after the start of a run new content is made available

Rewards for said activity and the requirments to assign members to that Activity.
Example requirments are:
 - party of size n
 - minimum level

# Over-World City
Hubs for non-combat activities like crafting (and recruitment?). Its where the Player Character resides.
Will be more relevant if we introduce guild housing.

# Combat Encounter
Combat Encounter or just Encounter is a combat scenario that involves the party while in a dungeon.
Read combat.md for more.

# Dungeon
A Dungeon run is an activity that consists of several Combat Encounters.
You need a full party of 4 Members to start a run.
When starting an Encounter the party gains know-how related to the dungeon.
If the party fails an encounter they automatically try again, they get morale hit and gain know-how.
When you successful clear an Encounter the party gets a reward and a morale boost.
After each Encounter attempt the party has a chance to trigger a interaction between members. (read interactions.md)
A run ends when the party clears all combat encounters, or a member runs out of morale and quits.
A successful run will provide the majority of rewards.

# Party Morale
A function of the tension between players.
Players leaving is an Escalation (should the player be able to Mediate/Intervene)


# Quests
TODO: 
- relevant for character specialization 

# Rewards
- equipment
- resources
  - crafting materials
  - crafting recipes
  - quest items?
  - gold
- xp
- know-how
