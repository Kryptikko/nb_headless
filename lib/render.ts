let buffer: Array<string> = []
export const render = (line: string) => {
  buffer.push(line)
}
export const render_buffer_clear = () => {
  buffer = []
}
export const render_buffer_flush = () => {
  process.stdout.write('\x1b[2J\x1b[H'); // ANSI clear + home
  console.log(buffer.join('\n'))
  render_buffer_clear()
}
