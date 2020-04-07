
export default function (path) {
    const fs = require('fs')
    const QELink = '(#Quick-Examples)'.toLowerCase()
    const AvailableMatchersLink = '(#available-matchers)'.toLowerCase()
    const arr = [
        '## Table of Contents',
        `* [Quick Examples]${QELink}`,
        `* [Available Matchers]${AvailableMatchersLink}`
    ]
    const files = fs.readdirSync(path)
    for (let file of files) {
        const text = fs.readFileSync(`${path}/${file}`, 'utf8')
        const name = text.split('\n')[0].replace(/[^a-zA-Z\.]/g, '')
        arr.push(name)
    }

    return arr.slice(0, 2).concat(arr.slice(2).map(el => {
        return `* [${el}](#${el.replace(/\./g, '').toLowerCase()})`
    })).join('\n').concat('\n')
}
