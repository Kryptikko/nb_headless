import _ from "lodash"
import { styleText } from "node:util";
import { SCREEN_IDS, type WorldState, type Screen, _empty_screen_fn } from '../types/WorldState';
import { open_screen } from "../controller/screen";
import { render, render_debug } from "../lib/render";
import type { BankItem } from "../types/Equipment";
import { dungeon_floor_1 } from "../data/encounters";
import type { Character } from "../types/Character";
import { WatchDirectoryFlags } from "typescript";
import { bank_add_item } from "../controller/equipment";
import get_equipment from "../data/item_templates";


const _handle_input = (state: WorldState) => {
  switch (state.input.toLocaleLowerCase()) {
    case "h":
      open_screen(state, SCREEN_IDS.home)
      break;
    case "r":
      open_screen(state, SCREEN_IDS.dungeon_combat)
      break;

    default:
      break;
  }
  state.input = ""
  return
}

type RewardState = {
  reward_items: Array<BankItem>,
  reward_xp: number,
}
const _state: RewardState = {
  reward_items: [],
  reward_xp: 0,
}

const _success = (world: WorldState): string => {
  // bank_add(world, reward.item_id, _.random(reward.amount[0], reward.amount[1]))
  return 'rewards'
}

const _failure = (world: WorldState): string => {
  return 'rewards'
}

const _init = (world: WorldState) => {
  dungeon_floor_1.reward.forEach(reward => {
    if (_.random(0, 1, true) < reward.chance) {
      const item = {
        item_template_id: reward.item_id,
        quantity: _.random(reward.amount[0], reward.amount[1])
      }
      _state.reward_items.push(item)
      bank_add_item(world, item)
    }
  })
  dungeon_floor_1.enemies.forEach((character: Character) => {
    // TODO: xp is a function of the defeated characters levels
    _state.reward_xp = character.level * 10
  })
  world.party.forEach((id) => {
    const party_member = _.get(world.roster, id)
    party_member.xp += _state.reward_xp
    // TODO: character levelups
  })
}

const _clear = (world: WorldState) => {
  _state.reward_items = []
  _state.reward_xp = 0
}

const _item_row = () => {
  return _state.reward_items.map((item: BankItem, idx: number) => {
    const item_template = get_equipment(item.item_template_id)
    return [
      _.padEnd(`${idx}. ${item_template.display_name}`, 55) + _.padStart("" + item.quantity, 5),
      styleText('italic', `"${item_template.display_description}"`)
    ].join('\n')
  }).join('\n')
}

const process = (state: WorldState) => {
  const header = [
    "============================================================",
    _.pad('🏆  VICTORY  🏆', 60),
    "============================================================",
    "Location: " + dungeon_floor_1.display_name,
    ""
  ].join('\n')

  const footer = [
    "",
    "============================================================",
    "press 'h' to go back to home",
    "press 'r' to go retry",
  ].join('\n')
  _handle_input(state);
  let body = [
    `Item                                                     Qty`,
    '------------------------------------------------------------',
    '',
    _item_row(),
    '',
    '------------------------------------------------------------',
  ].join('\n')

  render(header);
  render(body);
  render(footer);

  state.input = ""
}

const screen: Screen = {
  init: _init,
  process,
  clear: _clear
}

export default screen 
