
(async function () {
    const TAKOR_DOCS_DIRECTORY = '../docs/takor'
    const fs = require('fs')
    let tableHeader = '|static|'
    let tableSeparator = '|--|'
    const takorNames: string[] = []
    const converseNames: string[] = []
    await new Promise(resolve => {
        fs.readdir(TAKOR_DOCS_DIRECTORY, (_, files) => {
            for (let file of files) {
                const text = fs.readFileSync(`${TAKOR_DOCS_DIRECTORY}/${file}`, 'utf8')
                const name = text.split('\n')[0].replace(/[^a-zA-Z\.]/g, '')
                if (name.includes('not.')) {
                    converseNames.push(name)
                } else {
                    takorNames.push(`${name}`)
                }
            }
            resolve()
        })
    })

    const rows = takorNames.map(name => {
        return `|${name}|`
    }).join('\n')
    const converseRows = converseNames.map(name => {
        return `|${name}|`
    }).join('\n')
    console.log(tableHeader)
    console.log(tableSeparator)
    console.log(rows)
    console.log(converseRows)
})()
