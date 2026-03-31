import _, { over } from "lodash"
// import { styleText } from "node:util";
import { SCREEN_IDS, type WorldState, type Screen, _empty_screen_fn } from '../types/WorldState';
import { open_screen } from "../controller/screen";
import { render, render_debug } from "../lib/render";
import get_equipment from "../data/items";
import type { BankItem } from "../types/Equipment";
import container from "./components/container";
import overworld from "../data/overworld";
import type { Zone } from "../types/OverWorld";

type RosterState = {
  focus: number,
}
const _state: RosterState = {
  focus: 0,
}

const _handle_input = (state: WorldState) => {
  const len = Object.keys(overworld).length;
  switch (state.input.toLocaleLowerCase()) {
    case "j":
      _state.focus = (_state.focus + 1) % len
      break;
    case "k":
      _state.focus = _state.focus == 0 ? len - 1 : (_state.focus - 1) % len
      break;
    case " ":
      // render_debug('it works')
      break;
    case "h":
      open_screen(state, SCREEN_IDS.home)
      break;
    default:
      break;
  }
  state.input = ""
  return
}

const _table_row = (item: Zone, idx: number): string => {
  // TODO: show assinged members
  return [
    (idx == _state.focus) ? '->' : '  ',
    _.padEnd(`${idx + 1}. ${item.visual} ${item.display_name}`, 48),
    _.padStart(`${item.activities.length}`, 10),
  ].join('')
}

const _item_details = (item: BankItem): string => {
  const item_tpl = get_equipment(item.item_template_id);
  return [
    container(item_tpl.display_name, '', 58),
    _.padEnd('Quantity', 20) + ": " + _.padEnd(item.quantity + "", 36),
    _.padEnd('Slot', 20) + ": " + _.padEnd(item_tpl.slot + "", 36),
    '',
    _.padEnd('Max Health', 20) + ": " + _.padEnd(item_tpl.modifiers.hp_max + "", 36),
    _.padEnd('Attack', 20) + ": " + _.padEnd(item_tpl.modifiers.att + "", 36),
    _.padEnd('Defence', 20) + ": " + _.padEnd(item_tpl.modifiers.def + "", 36),
    _.padEnd('Magic', 20) + ": " + _.padEnd(item_tpl.modifiers.mgc + "", 36),
    _.padEnd('Initiative', 20) + ": " + _.padEnd(item_tpl.modifiers.ini + "", 36),
  ].join('\n')
}

const process = (state: WorldState) => {
  const header = [
    "============================================================",
    _.pad('WORLD', 60),
    "============================================================",
    "",
  ].join('\n')

  const footer = [
    "",
    "============================================================",
    "press 'j' and 'k' to navigate ↑ and ↓",
    "press 'h' to go back to home",
  ].join('\n')
  _handle_input(state);
  let body = [
    '------------------------------------------------------------',
    '',
    _.values(overworld).map(_table_row).join('\n'),
    '',
    '------------------------------------------------------------',
    // _item_details(_.get(bank_items, _state.focus)),
  ].join('\n')

  render(header);
  render(body);
  render(footer);

  state.input = ""
}

const screen: Screen = {
  init: _empty_screen_fn,
  process,
  clear: _empty_screen_fn
}
export default screen 
