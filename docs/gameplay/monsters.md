# Monsters

## Difficulty Rank
Monsters are split in difficulty ranks:
- minion - hp x0.5
- normal - x1
- elite - x2
- boss - x4 (to x6? test)

TODO: define ranges?

## Monster archetypes (templates)
Monster archetypes define their stats example
- Warrior - + vit, - int
- Rogue - - vit, + str
- Mage = - str , + int

## Scaling monsters
aka. Monster Statistics are a function of level + difficulty ranks + archetype modifier
The base stats are e function of the difficulty rank * level 
Then the stats are modified by the archetype
Abilities are manually attached per mob (TODO: allow for per mob type overrides to adjust for strong or weak spells)

Allow for game designers to adjust monster scaling and archetype mods

## XP values 
XP values are based on the monster level + difficulty rank

## Monster Compositions as puzzle elements
## Bosses
## Drop Tables
Monster drops tables are a sum of the zone drop table + individual drop tables

## Spoil Drop Tables
Spoil drop tables behave identically to the normal ones but are only accessible through the rogues spoil (TBD) abilitiy.

## Defining monsters
