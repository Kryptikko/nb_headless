export enum SCREEN_IDS {
  home,
  dungeon_combat,
}
type ScreenFn = (state: WorldState) => void;

export type WorldState = {
  delta: number,
  current: SCREEN_IDS, // TODO: make it an enum
  selection: string,
  context: Object // dont know yet
}

