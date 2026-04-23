# Combat Gameplay

Combat or Combat Encounter

## Abstract
As a leader the player does not directly take part in combat himself, rather he experiences it vicariously through the Members he assigns.
The Member struggles and growth is what reinforces the para social bond between NPCs and the Player.
The combat is then represented as an auto-battle between the Members and Enemy NPCs in pre-defined enemy compositions.

## Board
Characters are split in 2 opposing group, 1 or more characters per group.
TODO: explore 4 or 5 max members per player group, where raids will be a set of at least 2 player groups.

## Board Positions
Example 1
Player Groups have 6 possible positions for their characters. They are split between a "front-line" and a "back-line".
┌───────┬───────┬───────┐
│       │       │       │
│   1   │   2   │   3   │ front-line
│       │       │       │
┼───────┼───────┼───────┤
│       │       │       │
│   4   │   5   │   6   │ back-line
│       │       │       │
└───────┼───────┼───────┘

Example 2
┌─────┬─────┬─────┬─────┐
│     │     │     │     │
│  1  │  2  │  3  │  4  │
│     │     │     │     │
└─────┴─────┴─────┴─────┘
front-line  | back-line 

## Target Selection
Unless abilities have specific conditions.
Single target abilities hit a "main target", that is defined by the number of the character position.
Ability alternative targeting strategies are:
- cleave - hits the main target and character next to it.
- backstab - hits the last target (attack hits 6 to 1 positions index)
- line aoe - hits the main target and everyone in the main target line (front or back).
- aoe - hits all enemies
- random - hits randomly
- random line - hits randomly in a specific line (front or back)

## Combat Duration
Combat duration should be between 20-40 seconds (median 30s), so it does not drag out.

### Combat End
Combat Ends when all members of one side of the board are dead.

### Enrage Mechanics
Enrage mechanics that hard cap the combat duration.
Example: At a minute of combat duration, enemies "enrage" starting to do 5 times more damage.

### Combat Loss
When the Members lose a combat scenario, they gain a small amount of character experience? (based on their cohesion).
The tension between the Personas increases and they get to try again until the tension does not reach a threashold,
when the group disbands.
Tension stats persist through a dungeon run (read more in ./dunegon.md).
//TODO: explore tension vs morale as a balance statistic

## Combat Cost
When clearing a combat, member tension is increased, the amount depends on player cohesion and whether the combat is won or lost.

## Combat Difficulty
What and how many enemies participate (and what are the rewards from them?) are a function of the "Difficulty score", that allows for a certain "budget". Each enemy type has a Difficulty Rating and the sum of them should be ~ the difficutly rating of the Combat encounter. (this might allow for some variation in situations, explore for more detail)

## Combat Reward
Rewards depend on the underlying activity that triggered the combat encounter.

## Member Cohesion
## Member Tension (Morale)
## Combat Events
Specific conditions enable Events to happen during (more specific) or at the end of a combat encounter
Examples of incombat events:
- lock in - a member enters the "flow state"
  - increased performance
- rage - a member performance drops because hes upset about another dying.
  - lowers everyones cohesion, spikes tension
  - debuffs perfomance for the duraiton of the encounter
Combat Persona events buffs should differ from character abilities (they should be mostly % modifiers)
