import _, { max } from "lodash"
//https://en.wikipedia.org/wiki/Box-drawing_characters
// └ 
// ┘
// ┐
// ┌

export default (body: string, header?: string, min_width: number = 0): string => {
  const lines = body.split(`\n`);
  const max_width = _.chain(lines).map(line => line.length).concat(header?.length || 0, min_width).max().value()

  const head = '┌' + _.padEnd(header, max_width, '─') + '┐'
  const foot = '└' + '─'.repeat(max_width) + '┘'

  var result = _.chain(lines)
    .map(line => _.padEnd(line, max_width, " "))
    .map(line => `│${line}│`)
    .unshift(head)
    .push(foot)
    .join(`\n`)
    .value()
  return result;
}
