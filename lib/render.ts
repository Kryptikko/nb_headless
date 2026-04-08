import _ from "lodash"

let buffer: Array<string> = []
let debug_buffer: Array<any> = []

export const render = (line: string) => {
  buffer.push(line)
}

export const render_buffer_clear = () => {
  buffer = []
  debug_buffer = []
}

export const render_debug = (...args: any[]) => {
  debug_buffer = _.concat(debug_buffer, ...args)
}

export const render_buffer_flush = () => {
  process.stdout.write('\x1b[2J\x1b[H'); // ANSI clear + home
  console.log(buffer.join('\n'))
  if (debug_buffer.length > 0) {

    console.log('--- DEBUG ---')
    debug_buffer.forEach(line => console.log(line))
    // alternatively use a log file that you can tail during execution
  }
  render_buffer_clear()
}
