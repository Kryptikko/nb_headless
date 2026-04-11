import _, { forIn } from "lodash"
import { styleText } from "node:util";
import type { Character } from "../types/Character"
import { _empty_screen_fn, SCREEN_IDS, type Screen, type WorldState } from "../types/WorldState"
import { entity_status } from "./components/character_status.ts";
import { dungeon_floor_1 } from "../data/encounters.ts";
import { entity_cast_bar } from "./components/cast_bar.ts";
import status_bar from "./components/status_bar.ts";
import { render, render_debug } from "../lib/render.ts";
import { open_screen } from "../controller/screen.ts";
import {
  game_log,
  damage_log,
  create_world,
  combat_system,
  get_component,
  query,
  WORLD_STATE,
  create_entity,
  add_component
} from "../lib/ecs.ts";
import type { Entity, World, S_WorldState, PendingDamage } from "../lib/ecs.ts";
import { character_to_entity } from "../lib/ecs.util.ts";
import { STATUS_CODES } from "node:http";
import { entity_health_bar } from "./components/health_bar.ts";

enum COMBAT_RESULT {
  ONGOING,
  ATTACKER_WIN,
  DEFENDER_WIN,
}

let _combat_state: World

type CombatState = {
  winner: COMBAT_RESULT,
  player_cache: Record<Entity, Character>
  enemy_cache: Record<Entity, Character>
}

let _local_state: CombatState = {
  winner: COMBAT_RESULT.ONGOING,
  player_cache: {},
  enemy_cache: {}
}

const _init = (state: WorldState) => {
  _combat_state = create_world();
  _combat_state = _.reduce(state.party,
    (combat_world, id: string) => {
      let eid: Entity
      const character = _.get(state.roster, id);
      [combat_world, eid] = character_to_entity(combat_world, character, "player");
      _local_state.player_cache[eid] = character
      return combat_world
    }, _combat_state)

  _combat_state = _.reduce(dungeon_floor_1.enemies,
    (combat_world, enemy) => {
      let eid: Entity
      const character = _.cloneDeep(enemy);
      [combat_world, eid] = character_to_entity(combat_world, character, "enemy");
      _local_state.enemy_cache[eid] = character
      return combat_world;
    }, _combat_state)
}

const _clear = (world: WorldState) => {
  //TODO: set winner or loser in world state
}

const _is_combat_over = (combat: World): boolean => {
  const entities = query(combat, ['S_WorldState']);
  for (const entity of entities) {
    const world_state = get_component<S_WorldState>(combat, entity, 'S_WorldState');
    return (world_state.state === WORLD_STATE.END)
  }
  return false
}

const damage_meter = () => {
  const sources = _.groupBy(damage_log, 'source') || {};
  return _(sources)
    .mapValues((value: PendingDamage[]) => {
      return _.sumBy(value, (pd: PendingDamage) => pd.damage)
    })
    .toPairs()
    .sortBy(tuple => tuple[1])
    .reverse()
    .map(([entity, damage_done], idx, obj) => {
      const max = _.maxBy(obj, item => item[1])
      const ch = _.get(_local_state.player_cache, entity) || _.get(_local_state.enemy_cache, entity)
      return [
        idx + 1,
        `: [${entity}]`,
        _.padEnd(ch.display_name, 40, ' '),
        _.pad(damage_done + "", 4, ' '),
        //@ts-ignore
        entity_health_bar(damage_done, max[1], 20)
      ].join('')
    })
    .join('\n')
}

const toggle_pause = () => {
  let entity: Entity
  const w_entity = _.first(query(_combat_state, ['S_WorldState']));
  if (!w_entity)
    return
  const component = get_component<S_WorldState>(_combat_state, w_entity, 'S_WorldState')
  if (![WORLD_STATE.PAUSE, WORLD_STATE.RUN].includes(component.state))
    return

  [_combat_state, entity] = create_entity(_combat_state);
  _combat_state = add_component(_combat_state, entity, {
    type: "Command_StatusChange",
    value: WORLD_STATE.PAUSE ? WORLD_STATE.RUN : WORLD_STATE.PAUSE
  })
  return _combat_state;
}

const _handle_input = (state: WorldState) => {
  switch (state.input.toLocaleLowerCase()) {
    case "p":
      toggle_pause()
      break;
    case "r":
      if (_is_combat_over(_combat_state)) {
        open_screen(state, SCREEN_IDS.combat_reward)
      }
      break;
    default:
      break;
  }
  state.input = ""
  return
}

const CombatScreen = (state: WorldState) => {
  // TODO: 
  // fetch encounter
  // handle input 
  // run simulation
  // render
  _handle_input(state);
  _combat_state = combat_system(_combat_state, state.delta);

  // RENDER
  const header = styleText('gray', '[Start Dungeon Group]')
  const sub_header = `=== ${dungeon_floor_1.display_name} ===`
  const footer = [
    "",
    "============================================================",
    "press 'p' to pause/resume",
    _is_combat_over(_combat_state) ? "press 'r' for rewards" : ""
  ].join('\n')
  const body: Array<string> = [];
  // const entities = query(_combat_state, ["Attributes", "TagTargetable"]);
  const len = Math.max(_.size(_local_state.enemy_cache), _.size(_local_state.player_cache))

  // render_debug(_combat_state)
  let entity: Entity
  let ch: Character
  for (let index = 0; index < len; index++) {
    let row = ""
    let srow = ""
    // get_component(_combat_state, entity, 'TagTargetable')
    entity = _.toNumber(_.get(_.keys(_local_state.player_cache), index))
    ch = _.get(_local_state.player_cache, entity)

    if (ch) {
      row += entity_status(_combat_state, entity, ch)
      srow += entity_cast_bar(_combat_state, entity)
      srow += _.padStart(status_bar(ch), 20, ' ')
    }
    row = _.padEnd(row, 46, " ")
    srow = _.padEnd(srow, 46, " ")

    entity = _.toNumber(_.get(_.keys(_local_state.enemy_cache), index))
    ch = _.get(_local_state.enemy_cache, entity)

    if (ch) {
      row += entity_status(_combat_state, entity, ch)
      srow += entity_cast_bar(_combat_state, entity)
      srow += _.padStart(status_bar(ch), 20, ' ')
    }
    body.push(row)
    body.push(srow)
  }
  const dynamic_width = _.maxBy(body, (line) => line.length)?.length || 0
  render(header);
  render(_.pad(sub_header, dynamic_width, ' ') + '\n');
  render(body.join('\n'))
  render(damage_meter())
  render(`

[Turn Log] 4/${game_log.length}`);
  _.takeRight(game_log, 4).map(log => render(log))
  render(footer)
  return state
}


const screen: Screen = {
  init: _init,
  process: CombatScreen,
  clear: _clear
}
export default screen;
