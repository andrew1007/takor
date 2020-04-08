
import testWriter from './testWriter'
import writeMissingDocFiles from './writeMissingDocFiles'
import writeReadme from '../docUtils/build'

(() => {
    let missingFileCount = 0
    missingFileCount += testWriter()
    missingFileCount += writeMissingDocFiles()
    if (missingFileCount > 0) {
        throw new Error(`${missingFileCount} files were written. That means you haven't written a neccesary file yet`)
    } else {
        console.log('good preflight check~')
    }
    writeReadme()
    console.log('writing updated README.md')
})()
