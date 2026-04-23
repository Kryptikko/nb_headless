# Character Attributes
## Base Attributes V1 [DEPRACTATED]
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

## Statistics
- attack damage (normalzied dps)
- spell damage
- resistance or spell avoidance
- armor or physical attack avoidance 


## MVP Target Implementation [CURRENT]
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

### Armor (NOT FINAL)
A mitigation statistics aimed at mitigating alot of small attacks.
Flat reduction against physical attacks?

### Resistance (NOT FINAL)
Magic alternative to the armor

### "Shield"  (NOT FINAL)
A mitigation statistics aimed at mitigating big attacks and preventing 1 shot mechanics.
Extra healthpool that can stack ontop of yours
can have special behaviour with specific attacks

### "Ward? (NOT FINAL)
Alternative to shielding aiming to counter 1 shots mechanics.
A buff that is consumed on attack that prevents an attack to take more then x% of the targets healthpool.
Easily abused unless you get "warding fatigue" on the warded target, else with the combination of slows, ward spamming and enough healing to top off the target you can create a "invicibility" scenario

### Defense - provided by equipment (DROP)
MVP: Drop defense too complicated for players to gauge difficulty and plan around it.

#### Flat damage calculations
Damage = Attack * 64/(Defense + 65)
Diminishing returns ~ 64 defense == 50% damage reduction

#### Relative calculations
Damage = Attack * Attack/(Defense+Attack)
this provides high lvl of defense against fast (low damage range weapons) and low against hard hitting ones
Example tables

| Health | Base Damage | Speed | Armor | Damage Reduction | Hit   | EfDPS | EfHP   | TTK    |
| ------ | ----------- | ----- | ----- | ---------------- | ----- | ----- | ------ |------- |
| 100    | 10          | 1     | 15    | 60%              | 04.00 | 4.00  | 160.00 | 25.00s |
| 100    | 20          | 2     | 15    | 43%              | 11.43 | 5.71  | 142.86 | 17.50s |
| 100    | 30          | 3     | 15    | 33%              | 20.00 | 6.67  | 133.33 | 15.00s |
| 100    | 40          | 4     | 15    | 27%              | 29.09 | 7.27  | 127.27 | 13.75s |


### Weapon Attack
Max damage value should be around 64 same as defense

### Health

Health is a product of a base value (related to the level) and a CON modifier 
Base Health map @ 10 CON
Formula is Total Health = Base Health * (CON * 20)/20
having consistent behaviour with STR, where 20 Stat will double the base value

| Level | Base Health | TOTAL |
| ----- | ----------- | ----- |
| 1     | 30          | 45    |
| 2     | 40          | 60    |
| 3     | 50          | 75    |
| 4     | 60          | 90    |
| 5     | 70          | 105   |
| 6     | 85          | 128   |
| 7     | 100         | 150   |
| 8     | 115         | 173   |
| 9     | 130         | 195   |
| 10    | 145         | 218   |
| 11    | 160         | 240   |
| 12    | 175         | 263   |
| 13    | 190         | 285   |
| 14    | 200         | 300   |
| 15    | 220         | 330   |
| 16    | 240         | 360   |
| 17    | 260         | 390   |
| 18    | 280         | 420   |
| 19    | 300         | 450   |
| 20    | 320         | 480   |
