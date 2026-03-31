public enum SymlogCluster {
    EffectiveLeader,      // UPF ≈ (0.6..1, 0.4..1, 0.4..1)
    CharismaticMotivator, // UPB ≈ (0.6..1, 0.4..1, -1..-0.4)
    Authoritarian,        // UNF ≈ (0.6..1, -1..-0.4, 0.4..1)
    LoyalConformist,      // DPF ≈ (-1..-0.4, 0.4..1, 0.4..1)
    DependentFollower,    // DPB ≈ (-1..-0.4, 0.4..1, -1..-0.4)
    AlienatedRebel,       // DNB ≈ (-1..-0.4, -1..-0.4, -1..-0.4)
    NeutralUnclear        // near center or mixed
}

public SymlogCluster GetCluster() {
    float u = symlogPosition.x, p = symlogPosition.y, f = symlogPosition.z;
    
    if (u > 0.5f && p > 0.4f && f > 0.4f) return SymlogCluster.EffectiveLeader;
    if (u > 0.5f && p > 0.4f && f < -0.4f) return SymlogCluster.CharismaticMotivator;
    if (u > 0.5f && p < -0.4f && f > 0.4f) return SymlogCluster.Authoritarian;
    if (u < -0.5f && p > 0.4f && f > 0.4f) return SymlogCluster.LoyalConformist;
    if (u < -0.5f && p > 0.4f && f < -0.4f) return SymlogCluster.DependentFollower;
    if (u < -0.5f && p < -0.4f && f < -0.4f) return SymlogCluster.AlienatedRebel;
    
    return SymlogCluster.NeutralUnclear;
}
Dominant-Friendly-Task (UPF) — The "Effective Leader / Organizer" cluster  
Dominant-Friendly-Expressive (UPB) — The "Charismatic / Popular Motivator" cluster  
Dominant-Unfriendly-Task (UNF) — The "Authoritarian / Taskmaster" cluster  
Submissive-Friendly-Task (DPF) — The "Loyal Follower / Conformist" cluster  
Submissive-Friendly-Expressive (DPB) — The "Dependent / Affection-Seeking" cluster  
Submissive-Unfriendly-Nonconforming (DNB) — The "Rebel / Alienated Isolate" cluster


Effective Leader

Gives suggestions, opinions, agreements; high participation
Confident posture, supportive lines
Boosts group cohesion + task success; inspires others upward; reduces tension
Rare naturally — player must model & reward it


Charismatic Motivator

Jokes, solidarity, shows enthusiasm; high tension release
Energetic animations, funny quips
Creates morale spikes, temporary skill bonuses; but can distract from tasks (groupthink risk)
Fun short-term ally — channel energy or they derail


Authoritarian

Heavy suggestions, antagonism toward dissenters
Stern face, barked orders
Forces short-term productivity; high tension buildup → eventual mutiny or desertion
Dangerous if player pushes too hard — backfires


Loyal Conformist

Agrees, asks for orientation/suggestions
Nodding, "Yes boss" lines
Reliable task execution; buffers player from criticism; low initiative
Easy to keep happy — but group stagnates without push


Dependent Follower

High asks for help/orientation, shows tension
Hesitant voice, seeks approval
Drains player attention; clings to strongest figure (player or rival charismatic)
Comfort them or they flip to rebel


Alienated Rebel

Antagonism, disagreement, withdrawal
Crossed arms, sarcastic remarks
Triggers fights, lowers cohesion, risks phase back to Storming; can start coalitions against player
Hardest to fix — exile, redeem, or contain?



Concrete Emergent Scenarios (Player Choices Trigger Cluster Shifts)
- Player repeatedly uses Suggestion + Solidarity commands → NPCs drift UPF → more Effective Leaders appear → group enters "Performing" phase faster (big skill/cohesion bonus).

- Player ignores tension (too much pure task push) → several NPCs slide DNB → Alienated Rebels form a clique → sudden "insubordination event" (they sabotage a mission unless player intervenes with targeted TensionRelease).
- A Charismatic Motivator NPC (UPB) gains high loyalty → starts pulling others toward UPB → fun morale events (parties, banter) but task efficiency drops → player must counter with F-pushing acts or risk group becoming "party crew" instead of effective team.
- If player acts Authoritarian (UNF style) too often → loyal conformists stay DPF, but borderline members flip to DNB → emergent "resistance cell" forms → voting blocks or desertions appear.
- Chain reaction: One Rebel criticizes player → tension spreads → Dependent Follower panics and agrees with Rebel → sudden coalition against player → new mini-crisis "Mutiny brewing – 3 turns to resolve".

- Live Cluster Labels in the 3D field diagram UI: Hover shows "Charismatic Motivator – high morale risk" or "Alienated Rebel – cohesion threat 72%".
- Cluster Shift Alerts: "NPC X drifting toward Rebel cluster — intervene?" (pop-up choice: Praise, Confront, Ignore).
- Cluster-Based Abilities: Effective Leaders auto-boost nearby members' task skill; Rebels unlock "sabotage" hidden action if tension > 0.8.
- End-of-mission Summary: "Group archetype: Balanced with 3 Effective + 2 Charismatics → +25% overall performance" vs. "Toxic mix: 4 Rebels → -40% cohesion, 2 desertions".


