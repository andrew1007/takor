
(async function () {
    const TAKOR_DOCS_DIRECTORY = '../docs/takor'
    const fs = require('fs')
    const arr = ['table of contents']
    let tableHeader = '|'
    let tableSeparator = '|'
    const takorContent: string[] = []
    await new Promise(resolve => {
        fs.readdir(TAKOR_DOCS_DIRECTORY, (_, files) => {
            for (let file of files) {
                const text = fs.readFileSync(`${TAKOR_DOCS_DIRECTORY}/${file}`, 'utf8')
                const name = text.split('\n')[0].replace(/[^a-zA-Z\.]/g, '')
                arr.push(name)
                tableHeader += (`${name} |`)
                tableSeparator += (`-|`)
                takorContent.push(text)
            }
            resolve()
        })
    })

    const toc = [arr[0]].concat(arr.slice(1).map(el => {
        return `* [${el}](#${el.replace(/\./g, '')})`
    })).join('\n')
    console.log(toc)
    console.log(tableHeader)
    console.log(tableSeparator)
})()
