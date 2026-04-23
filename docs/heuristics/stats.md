# Character Attributes
## Base Attributes
TODO: rock, paper, scissors balance

## Offensive
- Strength (STR) - defines the physical damage
- Intelligence (INT) - defines spell effectiveness
- Dexterity (DEX) - defines the ability to avoid spells

## Defensive
- Constitution (CON) - defines the total health the character has
- Wisdom (WIS)
- Luck (LUC)

CON > DEX > WIS
WIS > STR > LUC
LUC > INT > CON

## Derived attributes
- attack damage (normalzied dps)
- spell damage
- resistance or spell avoidance
- armor or physical attack avoidance 


## MVP 
STR - physical damage
INT - magical damage
CON - hp pool

NOTE:
We assume infinite mana and balance around cool down and cast time
for more read up on combat

Attributes are defined by race, current specialisation and equipment
NOTE: leveling does not increase attributes

## Statistics
### Attack - defined by weapon + str modifier 
STR Modifier 
final attack = weapon damage * (20+STR/20)
where 20 is the max level (another constant can be used but for now we focus to have 20 as a top end str stat)
every 20 STR damage is doubled

### Armor 
Flat reduction against physical attacks?
### Resistancet
### "Shield" or "Ward?"
Extra healthpool that can stack ontop of yours
can have special behaviour with specific attacks

### Defense - provided by equipment
MVP: Drop the concept
Do we need defense, it creates extra complexity (% calculations are hard to take into account) that mekes it hard to gauge their strenght and combat difficulty and strategize before the fight.
Damage = Attack * 64/(Defense + 65)

Diminishing returns ~ 64 defense == 50% damage reduction
percentages are awkward to navigate by novice players but this provides a consistent damage reduction reguardless of weapon speed 

Alternative
damage = attack * Attack/(Defense+Attack)
this provides high lvl of defense against fast (low damage range weapons) and low against hard hitting ones

| Health | Base Damage | Speed | Armor | Damage Reduction | hit | EfDPS | EfHP | TTK 
| ------------- | -------------- |  -------------- | -------------- | -------------- | -------------- | -------------- | -------------- |-------------- |
| 100 | 10 | 1 | 15 | 60% | 04.00 | 4.00 | 160.00 | 25.00s |
| 100 | 20 | 2 | 15 | 43% | 11.43 | 5.71 | 142.86 | 17.50s |
| 100 | 30 | 3 | 15 | 33% | 20.00 | 6.67 | 133.33 | 15.00s |
| 100 | 40 | 4 | 15 | 27% | 29.09 | 7.27 | 127.27 | 13.75s |


this makes the damage values hard to navigate and balance

### Weapon Attack
Max damage value should be around 64 same as defense

### Health

Health is a product of a base value (related to the level) and a CON modifier 
Base Health map @ 10 CON
Formula is Total Health = Base Health * (CON * 20)/20
having consistent behaviour with STR, where 20 Stat will double the base value

| Level | Base Health | TOTAL |
| ------------- | -------------- | -------------- |
| 1  | 30 | 45
| 2  | 40 | 60
| 3  | 50 | 75
| 4  | 60 | 90
| 5  | 70 | 105
| 6  | 85 | 128
| 7  | 100 | 150
| 8  | 115 | 173
| 9  | 130 | 195
| 10 | 145 | 218
| 11 | 160 | 240
| 12 | 175 | 263
| 13 | 190 | 285
| 14 | 200 | 300
| 15 | 220 | 330
| 16 | 240 | 360
| 17 | 260 | 390
| 18 | 280 | 420
| 19 | 300 | 450
| 20 | 320 | 480
