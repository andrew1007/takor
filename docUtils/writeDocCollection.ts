import fs from 'fs'

(function () {
    const takorDir = '../docs/takor'
    const allText: string[] = []
    const allTakorMdFiles = fs.readdirSync(takorDir)
    for (let file of allTakorMdFiles) {
        const fileText = fs.readFileSync(`${takorDir}/${file}`, 'utf8')
        allText.push(fileText)
    }
    const collection = allText.join('\n\n')
    fs.writeFileSync(`content.md`, collection)
})()
