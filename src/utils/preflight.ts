
import testWriter from './testWriter'
import writeMissingDocFiles from './writeMissingDocFiles'
import writeReadme from '../docUtils/build'
(async () => {
    const sleep = (ms) => new Promise(resolve => {
        setTimeout(resolve, ms)
    })

    process.on('unhandledRejection', err => {
        throw err
    })

    const jest = require('jest')
    await jest.run('--detectOpenHandles --bail')
    console.log('')
    await sleep(3000)
    console.log('')
    let missingFileCount = 0
    missingFileCount += testWriter()
    missingFileCount += writeMissingDocFiles()
    if (missingFileCount > 0) {
        throw new Error(`${missingFileCount} files were written. That means you haven't written a neccesary file yet and should not push yet`)
    } else {
        console.log('=====================')
        console.log('good preflight check~')
        console.log('=====================')
        console.log('')
        await sleep(3000)
    }
    writeReadme()
    console.log('=====================')
    console.log('writing updated README.md')
    console.log('=====================')
    console.log('')
    await sleep(3000)

    console.log('=====================')
    console.log('Let\'s ship it, bbz 😎')
    console.log('=====================')
    await sleep(3000)
})()
