
(async function () {
    const TAKOR_DOCS_DIRECTORY = '../docs/takor'
    const fs = require('fs')
    let tableHeader = '|static| type| description |'
    let tableSeparator = '|--| -- | -- |'
    const takorNames: string[] = []
    const converseNames: string[] = []
    const type: string[] = []
    const converseType: string[] = []
    const description: string[] = []
    const converseDescription: string[] = []
    await new Promise(resolve => {
        fs.readdir(TAKOR_DOCS_DIRECTORY, (_, files) => {
            for (let file of files) {
                const text = fs.readFileSync(`${TAKOR_DOCS_DIRECTORY}/${file}`, 'utf8')
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
            resolve()
        })
    })

    const rows = takorNames.map((name, idx) => {
        return `|${name}| ${type[idx]} | ${description[idx]} |`
    }).join('\n')
    const converseRows = converseNames.map((name, idx) => {
        return `|${name}| ${converseType[idx]} | ${converseDescription[idx]} |`
    }).join('\n')
    console.log(tableHeader)
    console.log(tableSeparator)
    console.log(rows)
    console.log(converseRows)
})()
