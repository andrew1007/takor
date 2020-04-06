
(async function() {
    const fs = require('fs')
    const arr = ['table of contents']
    let tableHeader = '|'
    let tableSeparator = '|'
    const takorContent: string[] = []
    const read = new Promise(resolve => {
        fs.readdir('takor', (_, files) => {
            for (let file of files) {
                const text = fs.readFileSync(`./takor/${file}`, 'utf8')
                const name = text.split('\n')[0].replace(/[^a-zA-Z]/g, '')
                arr.push(name)
                tableHeader += (`${name} |`)
                tableSeparator += (`-|`)
                takorContent.push(text)
            }
            resolve()
        })
    })

    await read
    const toc = [arr[0]].concat(arr.slice(1).map(el => `* [${el}](#${el})`)).join('\n')
    console.log(toc)
    console.log(tableHeader)
    console.log(tableSeparator)
})()
