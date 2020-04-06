
(async function () {
    const TAKOR_DOCS_DIRECTORY = '../docs/takor'
    const fs = require('fs')
    let tableHeader = '|static|Description|'
    let tableSeparator = '|--|--|'
    const takorNames: string[] = []
    const converseNames: string[] = []
    const description: string[] = []
    const converseDescription: string[] = []
    await new Promise(resolve => {
        fs.readdir(TAKOR_DOCS_DIRECTORY, (_, files) => {
            for (let file of files) {
                const text = fs.readFileSync(`${TAKOR_DOCS_DIRECTORY}/${file}`, 'utf8')
                const name = text.split('\n')[0].replace(/[^a-zA-Z\.]/g, '')
                const desc = text.split('\n')[3]
                if (name.includes('not.')) {
                    converseNames.push(name)
                    converseDescription.push(desc)
                } else {
                    takorNames.push(`${name}`)
                    description.push(desc)
                }
            }
            resolve()
        })
    })

    const rows = takorNames.map((name, idx) => {
        return `|${name}| ${description[idx]} |`
    }).join('\n')
    const converseRows = converseNames.map((name, idx) => {
        return `|${name}| ${converseDescription[idx]} |`
    }).join('\n')
    console.log(tableHeader)
    console.log(tableSeparator)
    console.log(rows)
    console.log(converseRows)
})()
