import takor from '../src/index'
import fs from 'fs'
// @ts-ignore

const docTemplateWriter = (staticName: string) => {
    return `#### ${staticName}

##### Desc

##### type

##### Notes

##### Examples
\`\`\`javascript

\`\`\``
}

(function () {
    const takorDir = '../docs/takor'
    const takorNotDir = `../docs/takor`

    let fileCreationCount = 0

    const allStatics = Object.getOwnPropertyNames(takor)
        .filter(prop => typeof takor[prop] === 'function')
    const allTakorMdFiles = fs.readdirSync(takorDir)
    for (let staticMethod of allStatics) {
        if (!allTakorMdFiles.includes(`${staticMethod}.md`) && !allTakorMdFiles.includes(`${staticMethod}-empty.md`)) {
            console.log(`${staticMethod}.md does not exist! writing...`)
            fs.writeFileSync(`${takorDir}/${staticMethod}-empty.md`, docTemplateWriter(staticMethod))
            fileCreationCount += 1
        }
    }

    const allNotStatics = Object.keys(takor.not)
    const allNotTakorMdFiles = fs.readdirSync(takorNotDir)
    for (let staticMethod of allNotStatics) {
        if (!allNotTakorMdFiles.includes(`not-${staticMethod}.md`) && !allNotTakorMdFiles.includes(`not-${staticMethod}-empty.md`)) {
            console.log(`${staticMethod}.not.md does not exist! writing...`)
            fs.writeFileSync(`${takorNotDir}/not-${staticMethod}-empty.md`, docTemplateWriter(`not.${staticMethod}`))
            fileCreationCount += 1
        }
    }

    if (fileCreationCount === 0) {
        console.log('all files already exist')
    }
})()
