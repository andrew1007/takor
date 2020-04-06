
(async function () {
    const TAKOR_DOCS_DIRECTORY = '../docs/takor'
    const fs = require('fs')
    const QELink = '(#📦-Quick-Examples)'.toLowerCase()
    const arr = ['## Table of Contents', `* [Quick Examples]${QELink}`]
    await new Promise(resolve => {
        fs.readdir(TAKOR_DOCS_DIRECTORY, (_, files) => {
            for (let file of files) {
                const text = fs.readFileSync(`${TAKOR_DOCS_DIRECTORY}/${file}`, 'utf8')
                const name = text.split('\n')[0].replace(/[^a-zA-Z\.]/g, '')
                arr.push(name)
            }
            resolve()
        })
    })

    const toc = arr.slice(0, 2).concat(arr.slice(2).map(el => {
        return `* [${el}](#${el.replace(/\./g, '').toLowerCase()})`
    })).join('\n')
    console.log(toc)
})()
