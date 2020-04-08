import takor from '../index'
import fs from 'fs'
// @ts-ignore

const docTemplateWriter = (staticName: string) => {
    return `import takor from '../..'
    
describe('takor.${staticName}', () => {
    it('runs without throwing', () => {
        const asserter = takor.${staticName}(takor.any)
        expect(() => asserter(10)).not.toThrow()
    })
})
`
}

(function () {
    const testsDir = './src/__tests__/takor'
    const testsNotDir = `./src/__tests__/takor.not`
    const takorMatcherDir = `./src/__tests__/matchers`

    let fileCreationCount = 0

    const allStatics = Object.getOwnPropertyNames(takor)
        .filter(prop => {
            if (typeof takor[prop] === 'function') {
                return typeof takor[prop]() === 'function'
            } else {
                return false
            }
        })
    const allTakorTestFiles = fs.readdirSync(testsDir)
    for (let staticMethod of allStatics) {
        if (!allTakorTestFiles.includes(`${staticMethod}.test.ts`) && !allTakorTestFiles.includes(`${staticMethod}-empty.test.ts`)) {
            console.log(`${staticMethod}.test.ts does not exist! writing...`)
            fs.writeFileSync(`${testsDir}/${staticMethod}-empty.test.ts`, docTemplateWriter(staticMethod))
            fileCreationCount += 1
        }
    }

    const allNotStatics = Object.keys(takor.not)
    const allNotTakorMdFiles = fs.readdirSync(testsNotDir)
    for (let staticMethod of allNotStatics) {
        if (!allNotTakorMdFiles.includes(`not.${staticMethod}.test.ts`) && !allNotTakorMdFiles.includes(`not.${staticMethod}-empty.test.ts`)) {
            console.log(`not.${staticMethod}.test.ts does not exist! writing...`)
            fs.writeFileSync(`${testsNotDir}/not.${staticMethod}-empty.test.ts`, docTemplateWriter(`not.${staticMethod}`))
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
        if (!allMatcherMdFiles.includes(`${staticMethod}.test.ts`) && !allMatcherMdFiles.includes(`${staticMethod}-empty.test.ts`)) {
            console.log(`${staticMethod}.test.ts does not exist! writing...`)
            fs.writeFileSync(`${takorMatcherDir}/${staticMethod}-empty.test.ts`, docTemplateWriter(staticMethod))
            fileCreationCount += 1
        }
    }

    if (fileCreationCount === 0) {
        console.log('all files already exist')
    }
})()
