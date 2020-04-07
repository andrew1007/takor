import fs from 'fs'

export default function (path) {
    const allText: string[] = []
    const allTakorMdFiles = fs.readdirSync(path)
    for (let file of allTakorMdFiles) {
        const fileText = fs.readFileSync(`${path}/${file}`, 'utf8')
        allText.push(fileText)
    }
    const collection = allText.join('\n\n')
    return collection
}
