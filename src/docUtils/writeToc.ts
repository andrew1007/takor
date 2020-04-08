
export default function (validatorsPath, availableMatchersPath) {
    const fs = require('fs')
    const QELink = '(#Quick-Examples)'.toLowerCase()
    const AvailableMatchersLink = '(#available-matchers)'.toLowerCase()
    const arr = [
        '## Table of Contents',
        `* [Quick Examples]${QELink}`,
    ]
    const validators: string[] = []
    const converseValidators: string[] = []
    const matchers: string[] = []

    const matcherFiles = fs.readdirSync(availableMatchersPath)
    for (let file of matcherFiles) {
        const text: string = fs.readFileSync(`${availableMatchersPath}/${file}`, 'utf8')
        const name = text.split('\n')[0].replace(/[^a-zA-Z\.]/g, '')
        matchers.push(name)   
    }

    const files = fs.readdirSync(validatorsPath)
    for (let file of files) {
        const text: string = fs.readFileSync(`${validatorsPath}/${file}`, 'utf8')
        const name = text.split('\n')[0].replace(/[^a-zA-Z\.]/g, '')
        if (name.slice(0, 4) === 'not.') {
            converseValidators.push(name)
        } else {
            validators.push(name)
        }
    }

    const makeTocEntry = (el: string) => {
        return `  * [${el}](#${el.replace(/\./g, '').toLowerCase()})`
    }

    return [
        ...arr,
        `* [Available Matchers]${AvailableMatchersLink}`,
        ...matchers.map(makeTocEntry),
        '* Validators',
        ...validators.map(makeTocEntry),
        '* Inverse Validators',
        ...converseValidators.map(makeTocEntry),
        `* [types](#types)`
    ].join('\n').concat('\n')
}
