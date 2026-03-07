const TPL_EMPTY = " "
const TPL_FULL = "█"

export default (duration: number, start_at: number, game_now: number) => {
  let template = "          "
  if (game_now > start_at && game_now < (start_at + duration)) {
    let percent = Math.ceil(((game_now - start_at) / duration) * 10)
    template = TPL_FULL.repeat(percent) + TPL_EMPTY.repeat(10 - percent)
  }
  return '-' + template + '-';
}
