import { PROFESSION, type ProfessionStatsGrowth } from "../types/Character"

const repo: Record<PROFESSION, ProfessionStatsGrowth> = {
  [PROFESSION.FIGHTER]: {
    hp_max: 20,
    att: 3,
    def: 2,
    mgc: 1,
    ini: 2,
  },
  [PROFESSION.MYSTIC]: {
    hp_max: 10,
    att: 1,
    def: 2,
    mgc: 3,
    ini: 1,
  },
}
export default repo
