# Game Design Math 
elliptical, polynomial, and hyperbolic

## Diminishing Returns Formula
Damage = Attack * C/(C+Defense)

Where C is a Scaling Constant

Example: 
@ C == 100, 100 Defense will reduce 50% damage
@ C == 100, 200 Defense will reduce ~66% damage
@ C == 100, 300 Defense will reduce 75% damage

# Game Stat design flow

## Step 1 define a relationship model to other statistics
Example Attack and Defense
- Additive
Damage = Attack - Defense
High impact, immunity problem when D >= A

- Multiplicative
Damage = Attack * (1 - Mitigation%)
Mitigation% = (D + C)/C
Where C is a Scaling Constant

- Relative
Damage = Attack * (Attack)/(Attack+Defense)


## Step 2 Define Target Behaviour
A Metric that balances out the expected Behaviour, example Time To Kill.
In our example that can be Number of attacks or dps.

## Gates
Gates or Multipliers, can be used to keep the stat in check relative to other statistics.
Example: 

## Define dummies as baseline and extremes and test


# Goals
## Damage (and Healing)
1/3 of power comes from stats + level
1/3 of power comes from equipment (weapon)
1/3 of power comes from ability base damage

## Defense - Mitigation
1/3 of power comes from base stats + level 
1/3 of power comes from stats from equipment - vit stats beyond base level
1/3 of power comes from equipment (armor pieces) - defense stat

## Defense - Avoidance
Avoidance should be 'avoided', the volatile nature of it provides
a more unpredictable and almost exclusively negative emotional response.
This type of mechanic are more useful when trying to create higher ups and downs flow in a more combat oriented games,
On paper does not fit with the tactical/strategy type games.
A happy middle-ground would be a "glance system" 

## Defense - Glance (Proposal)
Glancing happens based on a stat and a roll resulting in a partial (~50% base) mitigation of that hit.
Its a of avoidance and mitigation, allowing for less volatile defensive strategies.
It introduces 2 new stats, one that effects the rate of the glancing, and the amount of damage reduced by glancing attacks.
This system can be applied as a shield block mechanic or spell resistance instead.

## Defense - Healing
Healing output should be balanced around the damage capability of the character.
