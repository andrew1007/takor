import takor from '../index'
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
    const takorDir = './src/docs/takor'
    const takorNotDir = `./src/docs/takor`
    const takorMatcherDir = `./src/docs/funcMatcher`
    let fileCreationCount = 0

    const allStaticValidators = Object.getOwnPropertyNames(takor)
        .filter(prop => {
            if (typeof takor[prop] === 'function') {
                return typeof takor[prop]() === 'function'
            } else {
                return false
            }
        })
    const allValidatorTakorMdFiles = fs.readdirSync(takorDir)
    for (let staticMethod of allStaticValidators) {
        if (!allValidatorTakorMdFiles.includes(`${staticMethod}.md`) && !allValidatorTakorMdFiles.includes(`${staticMethod}-empty.md`)) {
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

    const allStaticMatchers = Object.getOwnPropertyNames(takor)
    .filter(prop => {
        if (typeof takor[prop] === 'function') {
            return !(typeof takor[prop]() === 'function')
        } else {
            return false
        }
    })
    const allMatcherMdFiles = fs.readdirSync(takorMatcherDir)
    for (let staticMethod of allStaticMatchers) {
        if (!allMatcherMdFiles.includes(`${staticMethod}.md`) && !allMatcherMdFiles.includes(`${staticMethod}-empty.md`)) {
            console.log(`${staticMethod}.md does not exist! writing...`)
            fs.writeFileSync(`${takorMatcherDir}/${staticMethod}-empty.md`, docTemplateWriter(staticMethod))
            fileCreationCount += 1
        }
    }
    if (fileCreationCount === 0) {
        console.log('all files already exist')
    }
})()
