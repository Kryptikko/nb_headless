let buffer: Array<string> = []
export const render = (line: string) => {
  buffer.push(line)
}
export const clear_render_buffer = () => {
  buffer = []
}
export const get_render_buffer = () => buffer.join('\n')
