import fs from 'fs'

export default function (path: string) {
    let tableHeader = '|static methods| type| description |'
    let tableSeparator = '|--| -- | -- |'
    const takorNames: string[] = []
    const converseNames: string[] = []
    const type: string[] = []
    const converseType: string[] = []
    const description: string[] = []
    const converseDescription: string[] = []
    const files = fs.readdirSync(path)
    for (let file of files) {
        const text = fs.readFileSync(`${path}/${file}`, 'utf8')
        const nameText = text.split('\n')[0].replace(/[^a-zA-Z\.]/g, '')
        const typeText = text.split('\n')[2].replace('type: ', '')
        const descText = text.split('\n')[5]
        if (nameText.includes('not.')) {
            converseNames.push(nameText)
            converseType.push(typeText)
            converseDescription.push(descText)
        } else {
            takorNames.push(`${nameText}`)
            type.push(typeText)
            description.push(descText)
        }
    }

    const makeNamedLink = (name: string) => `[${name}](#${name.replace(/\./g, '').toLowerCase()})`
    const makeConverseNamedLink = (name: string) => {
        return `[${name}<nohttp>](${name.replace(/./g, '').replace(/\./g, '').toLowerCase()})`
    }

    const rows = takorNames.map((name, idx) => {
        return `|${makeNamedLink(name)}| ${type[idx]} | ${description[idx]} |`.replace(/\r/g, '')
    })
    const converseRows = converseNames.map((name, idx) => {
        return `|${makeConverseNamedLink(name)} | ${converseType[idx]} | ${converseDescription[idx]} |`.replace(/\r/g, '')
    })

    return [
        tableHeader,
        tableSeparator,
        ...rows,
        ...converseRows,
    ].join('\n')
}
