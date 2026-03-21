def process_interaction(actor_id: str, target_id: str, action_key: str, context_tag: str):
    # 1. Look up behavior deltas from config
    deltas = config["behavior_mappings"].get(action_key, {})
    
    # 2. Apply to actor & target behavior counts
    for cluster, amount in deltas.items():
        system.members[actor_id].behavior_counts[cluster] += amount
        system.members[target_id].behavior_counts[cluster] += amount * 0.6  # weaker echo

    # 3. Apply state deltas (weighted by personality fit)
    for cluster, delta_map in config["state_deltas"].items():
        for stat, val in delta_map.items():
            change = val * deltas.get(cluster, 0)
            # Apply personality modifier (optional)
            apply_to = [actor_id, target_id]
            for pid in apply_to:
                member = system.members[pid]
                if stat == "mood":
                    member.mood += change
                elif stat in ["dominance", "friendliness", "expressiveness"]:
                    setattr(member, stat, getattr(member, stat) + change * 0.3)

    # 4. Update directed relation
    rel = get_or_create_relation(actor_id, target_id)
    rel.strength += calculate_relation_delta(deltas, context_tag)
    rel.last_interaction_turn = system.current_turn

    # 5. Check thresholds & queue events
    check_and_queue_events(system, actor_id, target_id)

def decay_social_state():
    # Gentle forgetting each turn / rest
    decay = config["decay_per_turn"]
    for member in system.members.values():
        for k in member.behavior_counts:
            member.behavior_counts[k] *= decay["behavior_counts"]
        member.mood *= decay["mood"]
    for rel in system.relations.values():
        rel.strength *= decay["relation_strength"]
