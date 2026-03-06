import type { Character } from "../../types/Character";

export default (ch: Character) => {
  let hp_bar = ""
  if (ch.hp_now <= 0) hp_bar = '[          ]'
  else {
    let hp_percent = Math.ceil((ch.hp_now / ch.hp_max) * 10)
    for (let index = 0; index < 10; index++) {
      hp_percent--
      hp_bar += hp_percent > 0 ? "█" : " "
    }
    hp_bar = '[' + hp_bar + ']';
  }
  return hp_bar
}
