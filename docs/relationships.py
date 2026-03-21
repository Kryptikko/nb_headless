# Global / Game state (one instance)
class PartySocialSystem:
    current_turn: int = 0
    members: dict[str, PartyMember]          # key = unique id / name
    relations: dict[tuple[str, str], Relation]  # (from_id, to_id) → directed
    group_morale: float = 0.0                # aggregate (-100..+100)
    event_queue: list[EmergentEvent] = []    # pending drama / buffs to display

# Single party member (recruit / companion)
class PartyMember:
    id: str                     # unique, e.g. "alina_001"
    name: str
    profession: str
    level: int
    combat_stats: dict          # atk, def, mag, ini, max_hp...
    
    # Personality baselines (data-driven, loaded from JSON)
    base_dominance: float       #  -1.0 .. +1.0
    base_friendliness: float
    base_expressiveness: float
    
    # Current state (evolves)
    mood: float = 0.0           # -100 hostile/depressed → +100 loyal/eager
    dominance: float            # current position on SYMLOG Up-Down
    friendliness: float
    expressiveness: float
    
    # Behavioral accumulation (Bales/SYMLOG clusters)
    behavior_counts: dict = {   # reset periodically or decay slowly
        "accomplishment": 0,            # task progress, suggestions
        "complementary": 0,             # questions, seeking info
        "reinforcement": 0,             # agreement, solidarity, jokes
        "tension": 0,                   # anxiety, asking for help
        "conflict": 0,                  # disagreement, criticism
        "withdrawal": 0                 # passivity, silence
    }
    
    traits_unlocked: set[str]   # e.g. "hot_headed", "peacemaker" (unlocked by ratios)

# Directed relationship (A feels toward B)
class Relation:
    strength: float = 0.0       # -100 enemy → +100 soulmate / loyal
    trust: float = 0.0
    respect: float = 0.0
    last_interaction_turn: int = -1
    memory: list[dict] = []     # optional sparse log, e.g.
                                # {"turn":42, "cluster":"conflict", "delta":-12, "context":"after_loss"}

# Emergent event (queued for display / effect)
class EmergentEvent:
    type: str                   # "argument", "bonding_moment", "desertion_risk", "morale_boost"
    involved: list[str]         # member ids
    description: str            # flavor text for TUI
    effects: dict               # e.g. {"mood_delta": -20, "relation_delta": -15, ...}
    probability: float          # or deterministic threshold
    triggered_turn: int

