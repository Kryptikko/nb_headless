# Persona
The Persona model represents the simulated person playing a character.
The Persons is defined by 
- SYMLOG values (vectors) based on the Bales/SYMLOG clusters. All values range from -1.0f to +1.0f
  - dominant - (dominant, assertive, prominent) vs (submissive, passive)
  - friendly -  (friendly, warm, cooperative) vs (unfriendly, cold, hostile)
  - compliant - (accepting authority/task structure, conforming) vs (nonconforming, rebellious, expressive)

# SYMLOG
The 3 behaviour pairs define certain archetypes of behaviour. These are the basis of our behaviour modelling.

## SYMLOG Arcetypes
Dominant-Friendly-Task (UPF) — The "Effective Leader / Organizer" cluster  

Gives suggestions, opinions, agreements; high participation
Confident posture, supportive lines
Boosts group cohesion + task success; inspires others upward; reduces tension
Rare naturally — player must model & reward it


Dominant-Friendly-Expressive (UPB) — The "Charismatic / Popular Motivator" cluster  

Jokes, solidarity, shows enthusiasm; high tension release
Energetic animations, funny quips
Creates morale spikes, temporary skill bonuses; but can distract from tasks (groupthink risk)
Fun short-term ally — channel energy or they derail


Dominant-Unfriendly-Task (UNF) — The "Authoritarian / Taskmaster" cluster  

Heavy suggestions, antagonism toward dissenters
Stern face, barked orders
Forces short-term productivity; high tension buildup → eventual mutiny or desertion
Dangerous if player pushes too hard — backfires


Submissive-Friendly-Task (DPF) — The "Loyal Follower / Conformist" cluster  

Agrees, asks for orientation/suggestions
Nodding, "Yes boss" lines
Reliable task execution; buffers player from criticism; low initiative
Easy to keep happy — but group stagnates without push


Submissive-Friendly-Expressive (DPB) — The "Dependent / Affection-Seeking" cluster  

High asks for help/orientation, shows tension
Hesitant voice, seeks approval
Drains player attention; clings to strongest figure (player or rival charismatic)
Comfort them or they flip to rebel


Submissive-Unfriendly-Nonconforming (DNB) — The "Rebel / Alienated Isolate" cluster

Antagonism, disagreement, withdrawal
Crossed arms, sarcastic remarks
Triggers fights, lowers cohesion, risks phase back to Storming; can start coalitions against player
Hardest to fix — exile, redeem, or contain?

## Clicks
Using the SYMLOG we can model the clustering of Personas and hance the dynamic forming of clicks and alliances.
Clicks are clustered based on a 2D dimention area defined by the compliant and friendly values as axis.
The 3rd dimention of dominant defines who the leader of the click is.
This way we can model a number of clicks with specific interests and model in-fighting.
Diversitiy is in fact NOT a strength. 



# Relation
The Relantion models of the view of a [Persona](##Persona) towards another Persona.
It is defined by 
  (V1)
  - Direction - actor id (the opinion of who) to target id (the opinion towards who)
  - Trust value - -1.0f to +1.0f
  - Tension value - 0.0f to 1.0f
  (V2)
  - Median Trust value
  - Median Tension value
  - Drift values

Relations values change based on [Interactions](##Interaction).

## Drift
Trust and Tension drift towards median values. 
This allows for passive de-escalation based on distance, rather then active intervention.
TODO:
What are and what effects the drift values 
What are the drift events (how often does the drift happen)

## Escalations
Once a  certain tension threshold are met an [Escalation](#Escalation) is triggered.
Escalations result in permanent consequences like. (Ex. change in the SYMLOG values of involved Persona).
Escalations might prompt player input allowing for mitigation steps.
Types of consequences:
- change trust and tension
- change median trust and tension
- reduce tension
- change SYMLOG Persona values
- add or remove Persona Tags

TODO:
Explore whats the resource cost of handling escalations, there should be a tradeoffs of handling tension in advance.

# Interaction
Interactions happens after each combat encounter (TODO Explore other places to have interactions)
Interactions are Neutral (or task oriented) and Positive or Negative (socio-emotional)
12 different symetrical types split in 3 groups and follow IPA (Interaction Personality Analysis) model.

- Neutral - Task Oriented
  (Question and Answers)
  - give suggestion <-> ask for suggestion
  - give opinion <-> ask for opinion
  - give orientation <-> ask for orientation

- Positive - Socio-emotional
  - Show Solidarity
  - Show Tension release
  - Agree

- Negative - Socio-emotional
  - Show Antagonism
  - Show Tension
  - Disagree

Neutral interactions are task oriented so they contribute to performance but increase tension.
Socio-emotional interactions are ways of reducing tension. 

# Intervention
An Intervention is an Interaction between the player and a Persona.
Intervention are triggered once a Persona reaches specific conditions. 
