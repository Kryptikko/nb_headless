# RPG Power Progression: Analysis & Framework (Levels 1–20)

---

## Part 1 — What Classic RPGs Actually Did

### The Core Problem Every System Had to Solve

A level 1 hero and a level 20 hero inhabit the same world. They need to feel categorically different in power, but the game must remain engaging throughout. Too flat a curve and late-game feels like early-game with new art. Too steep a curve and early-game feels like a tutorial with no stakes.

Every JRPG of the 90s and 2000s solved this through the same underlying structure: **a primary stat that grows polynomially, a secondary defensive stat that grows slower, and a damage formula that mediates the ratio between them.**

---

### Final Fantasy VII — The Benchmark Formula

FF7's damage calculation is the most studied of the era:

```
P = ATK + (ATK + LVL) × ATK × LVL / 1024
Damage = P × M / 32 × (512 - DEF) / 512
```

Where `M` is a multiplier per ability (1–8 typically) and `DEF` is the target's defense.

**What this does:** Level contributes directly to power, not just indirectly through stat growth. A level 50 character with moderate ATK hits harder than a level 20 character with the same ATK. This made level-grinding feel rewarding even when stat increases felt small.

**The critical design insight:** The `(512 - DEF) / 512` term means defense asymptotically reduces damage but can never negate it entirely. Defense of 256 halves damage. Defense of 512 (the cap) zeroes it. This prevents the classic "tank wall" problem.

### FF9 — Level Embedded in Stats

FF9 simplified by baking level into the stat growth formula itself:

```
Damage = ATK × (1 + ATK / 256) - (DEF / 4)
```

Stat growth was steeper and more class-differentiated. Characters gained ~2–4 points per level in their primary stat, but HP grew much faster (~100–200 per level by mid-game). The result was that HP was the dominant survival buffer, not defense — a deliberate choice to keep fights shorter.

### Pokémon Gen 1 / Gen 2 — Stat Formula with Base Values

```
Stat = FLOOR( (Base + IV) × 2 × LVL / 100 ) + 5
HP  = FLOOR( (Base + IV) × 2 × LVL / 100 ) + LVL + 10
```

The `× LVL / 100` means stats scale **linearly with level** for a given species. The differentiation between Pokémon came entirely from the `Base` value (their species floor). This created a clean, predictable curve that was easy to balance but led to level-based "walls" where a five-level gap in trainer battles felt enormous.

### Baldur's Gate / D&D 2nd Edition — Bounded Accuracy's Absence

D&D 2nd Ed used THAC0 (To Hit Armor Class 0), where both attack bonus and AC scaled together. The result was a treadmill: a fighter gained +1 attack every level, but monsters also gained AC proportionally, so combat efficiency stayed roughly flat. Power was expressed through **multiple attacks per round** (gained at fixed levels) and **critical multipliers**, not raw damage. This is why D&D characters felt weak at level 1 and overpowered at level 10+.

**Key lesson:** When offense and defense scale at the same rate, combat efficiency plateaus and players feel the grind without feeling the power.

### Chrono Trigger — Gentle Polynomial + Tech Unlocks

CT used very gentle stat scaling (roughly +3–5 per level across the board) with a level range of 1–99 in theory but a practical completion range of 40–50. The real power expression was **tech unlocks** — discrete ability upgrades at fixed levels (e.g., Crono gains Luminaire at level 43). Stats alone didn't feel powerful; the moment of learning a new tech did.

**Key lesson:** Perception of power comes from discrete unlocks more than continuous stat growth. The curve should have "breakpoints."

---

## Part 2 — What Went Wrong in Classic Systems

| System | Problem |
|--------|---------|
| FF7 | Defense becomes near-irrelevant past endgame; pure ATK stacking optimal |
| FF8 | Junction system meant levels hurt you (enemies scaled with you, negating progression) |
| D&D 2nd Ed | THAC0 treadmill — level gains felt like maintenance not power |
| Pokémon Gen 1 | Linear scaling created hard level walls; no catch-up mechanic |
| Diablo 1 | No defense formula cap; armor could reduce damage to 0, trivializing content |

The most common failure: **offense and defense share the same growth rate**, producing a treadmill. The second most common: **no cap on mitigation**, producing impenetrable tanks.

---

## Part 3 — The Framework (Levels 1–20)

This framework targets a **compact 1–20 range** (D&D 5e style), suitable for a tactical RPG, dungeon crawler, or JRPG-lite. The design goals are:

1. Power should feel approximately **4× at level 10** and **10× at level 20** versus level 1
2. Defense should always feel meaningful but never feel like a wall
3. The curve should have **3 distinct phases** with different "feel"
4. Formulas should be implementable with integer arithmetic

---

### 3.1 — The Three Phases

| Phase | Levels | Character Feel | Enemy Threat |
|-------|--------|---------------|--------------|
| Foundling | 1–6 | Fragile, dependent on party synergy | One bad fight can kill a member |
| Proven | 7–13 | Confident, can solo weaker foes | Requires strategic target priority |
| Legend | 14–20 | Powerful, bends encounter rules | Only elite enemies are genuine threats |

The phase boundaries should coincide with major unlocks: a new ability tier, access to a new weapon grade, or a class transformation.

---

### 3.2 — Stat Growth Formulas

**Base Stat at Level L** (for any core stat):

```
Stat(L) = Base + Growth × (L - 1) + Bonus × FLOOR((L - 1) / 5)
```

- `Base` — starting value at level 1 (class-defined)
- `Growth` — points added per level (class-defined)
- `Bonus` — extra points at levels 5, 10, 15, 20 (milestone bump)

This produces a **piecewise-linear curve** with acceleration at every 5th level, matching the phase structure.

**Example — Warrior class:**

| Stat | Base | Growth | Bonus |
|------|------|--------|-------|
| ATK  | 12   | 3      | 4     |
| DEF  | 10   | 2      | 3     |
| MGK  | 4    | 1      | 1     |
| SPD  | 8    | 1      | 2     |

Warrior ATK at level 1 = 12. At level 10 = 12 + 9×3 + 1×4 = **43**. At level 20 = 12 + 19×3 + 3×4 = **81**.

**Example — Mage class:**

| Stat | Base | Growth | Bonus |
|------|------|--------|-------|
| ATK  | 5    | 1      | 1     |
| DEF  | 4    | 1      | 1     |
| MGK  | 14   | 4      | 5     |
| SPD  | 9    | 2      | 2     |

---

### 3.3 — HP Formula

HP uses a separate formula because it needs to grow faster to maintain survivability feel:

```
HP(L) = BaseHP + VIT × 5 × (L - 1) + FLOOR(L² / 4)
```

- `BaseHP` — class floor (e.g., Warrior: 80, Mage: 40)
- `VIT` — vitality stat (grows like other stats)
- The `L²/4` term adds acceleration: HP growth speeds up in the Legend phase

**Warrior HP curve (VIT Base=10, VIT Growth=2):**

| Level | VIT | HP |
|-------|-----|----|
| 1     | 10  | 80 |
| 5     | 18  | 450 |
| 10    | 28  | 1,465 |
| 15    | 38  | 2,975 |
| 20    | 48  | 5,080 |

This gives a roughly **63× HP multiplier** from level 1 to 20 — which feels dramatic but appropriate because enemies scale similarly.

---

### 3.4 — Damage Formula

Inspired by FF7 but cleaned up for a 1–20 range:

```
BasePower = ATK + FLOOR(ATK × LVL / 32)
Damage    = FLOOR(BasePower × AbilityMult × (1 - DEF / (DEF + 80)))
```

Breaking this down:

**`ATK + FLOOR(ATK × LVL / 32)`** — Level amplifies ATK directly. At level 1 the bonus is ~3% of ATK. At level 20 it's ~62%. This means leveling always matters, even with no stat gains.

**`(1 - DEF / (DEF + 80))`** — The defense mitigation term. The constant `80` is the "softcap anchor." When DEF equals 80, mitigation is exactly 50%. When DEF is 160, mitigation is 67%. Defense can never reach 100% mitigation — there's always residual damage.

**Mitigation table (constant = 80):**

| DEF | Damage % Received |
|-----|------------------|
| 0   | 100%             |
| 20  | 80%              |
| 40  | 67%              |
| 80  | 50%              |
| 160 | 33%              |
| 240 | 25%              |
| 320 | 20%              |

**AbilityMult:** Assign to each ability/skill. Basic attack = 1.0, strong strike = 1.5, finisher = 2.5, ultimate = 4.0.

**Sample damage — Warrior (ATK=43) vs. enemy DEF=60 at level 10:**

```
BasePower = 43 + FLOOR(43 × 10 / 32) = 43 + 13 = 56
Mitigation = 1 - 60/(60+80) = 1 - 0.429 = 0.571
Damage (basic) = FLOOR(56 × 1.0 × 0.571) = 31
Damage (strong) = FLOOR(56 × 1.5 × 0.571) = 47
```

Against a level-10 enemy with ~400 HP, this gives roughly 8–13 hits to kill — appropriate for tactical combat.

---

### 3.5 — Magic Damage Formula

Magic ignores DEF and uses a separate resistance stat (RES), but the mitigation structure is the same:

```
MagicDamage = FLOOR(MGK × SpellMult × LVL / 10 × (1 - RES / (RES + 60)))
```

The lower anchor constant (60 vs. 80 for physical) means magic is slightly more penetrating by default — fitting for a glass-cannon archetype. Increase it to 100 to make magic more resistible.

---

### 3.6 — Experience Curve

Total XP required to reach level L:

```
XP(L) = 100 × (L - 1)^2.0 + 50 × (L - 1)
```

This is a **quadratic curve**, giving:

| Level | XP to reach | XP gap from previous |
|-------|------------|---------------------|
| 2     | 150        | 150                 |
| 5     | 1,800      | 450                 |
| 10    | 8,550      | 1,000               |
| 15    | 20,300     | 1,450               |
| 20    | 37,050     | 1,900               |

The gap increases by roughly 50 XP per level — each level costs about 5% more than the last. This is slow enough to not feel punishing but prevents over-leveling through repeated easy encounters.

**Per-encounter XP yield formula:**

```
XP_reward = BaseReward × (EnemyLVL / PartyLVL)^1.5
```

If the enemy is your level: full reward. Two levels above: ~2.8× reward. Two levels below: ~0.35× reward. This soft-discourages grinding weaker enemies without hard-blocking it.

---

### 3.7 — Critical Hits

```
CritChance = 5% + (LCK / 200)     [LCK is a 0–100 stat]
CritDamage = BaseDamage × 1.5 + FLOOR(LCK / 10)
```

Critical hits scale slightly with a luck stat, giving it purpose without making it dominant. Cap `CritChance` at 40%.

---

### 3.8 — Enemy Scaling Reference

For enemies at level L, use these multipliers against the "base enemy" at level 1 (which should be tuned to be defeatable by 3 basic attacks from a level-1 Warrior):

| Level | HP mult | ATK mult | DEF mult |
|-------|---------|----------|----------|
| 1     | 1.0×    | 1.0×     | 1.0×     |
| 5     | 5×      | 2.5×     | 2×       |
| 10    | 18×     | 5×       | 3.5×     |
| 15    | 45×     | 8×       | 5×       |
| 20    | 95×     | 12×      | 7×       |

Notice HP scales much faster than ATK and DEF — intentional. Players should feel their damage output growing faster than it "should" because enemies get tankier, not deadlier. This is the opposite of FF8's mistake, where enemy ATK scaled and made leveling feel punishing.

---

## Part 4 — Putting It Together: Reference Numbers

### Full stat table — Warrior at each phase boundary

| Level | ATK | DEF | MGK | SPD | HP   |
|-------|-----|-----|-----|-----|------|
| 1     | 12  | 10  | 4   | 8   | 80   |
| 5     | 28  | 20  | 8   | 16  | 450  |
| 10    | 47  | 32  | 13  | 22  | 1465 |
| 15    | 62  | 42  | 17  | 27  | 2975 |
| 20    | 81  | 56  | 22  | 34  | 5080 |

### Damage dealt to a same-level enemy (basic attack, no crits)

| Level | Damage | Enemy HP | Hits to kill |
|-------|--------|----------|--------------|
| 1     | 8      | 70       | 9            |
| 5     | 24     | 350      | 15           |
| 10    | 31     | 1260     | 40           |
| 15    | 38     | 3150     | 83           |
| 20    | 48     | 6650     | 138          |

The "hits to kill" rising is intentional — by level 20 you use ability multipliers (×2–4) rather than basic attacks, compressing this back to 20–30 effective hits. Basic attacks become chip damage; abilities become the win condition.

---

## Part 5 — Design Principles Summary

**1. Let level amplify stats directly in the damage formula** (FF7 approach). This makes leveling feel good even when stat gains are boring.

**2. Use a diminishing-returns defense formula**, not subtraction. `DEF / (DEF + K)` always returns a value between 0 and 1 — it's self-capping and never breaks.

**3. HP grows faster than damage** in the mid-game, slower in the late game. This creates a "tanky mid-game" feel that resolves into "high-burst late-game."

**4. Put breakpoints at levels 5, 10, 15, 20** via the Bonus stat jumps. Players should notice a tangible shift in feel at each boundary, reinforced by ability unlocks.

**5. XP rewards should scale with difficulty ratio**, not just enemy level. Reward risk-taking.

**6. Separate physical and magical mitigation constants** to allow class archetypes to feel distinct without redesigning the whole formula.

**7. Never scale enemy ATK as fast as enemy HP.** The FF8 lesson: if grinding makes enemies hit harder, progression feels like a treadmill. Make enemies survive longer, not hit harder, in the mid-game.
