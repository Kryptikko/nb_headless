import _ from "lodash"

const hbox = (...args: Array<string>): string => {
  const width: number = _(args)
    .map(box => _.size(box))
    .max() || 0
  const height = _(args)
    .map(box => _.split(box, '\n').length)
    .max() || 0
  return _(args)
    .map(arg => {
      let split = _.split(arg, '\n')
      split = _.concat(split, Array(height - split.length - 1).fill(''))
      return split
    })
    .unzip()
    .map(line => _(line)
      .map(item => _.padEnd(item, width))
      .join(' ')
    ).join('\n')
}

export default hbox
