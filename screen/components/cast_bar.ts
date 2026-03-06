export default (cooldown: number, frame: number) => {
  let template = ""
  let precent = Math.ceil((frame / cooldown) * 10)
  for (let index = 0; index < 10; index++) {
    precent--
    template += precent > 0 ? "█" : " "
  }
  return '-' + template + '-';
}
