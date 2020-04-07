
(function () {
    const writeToc = require('./writeToc.ts').default
    const writeTable = require('./writeTable').default
    const createDocCollection = require('./createDocCollection').default
    const writeTypes = require('./writeTypes').default
    const fs = require('fs')
    const writeAvailableMatchers = require('./writeAvailableMatchers').default

    const TYPES_FILE_PATH = `./src/types.ts`
    const DOCS_FILE_PATH = './src/docs/takor'
    const INTRO_FILE_PATH = './src/docs/intro'

    const toc = writeToc(DOCS_FILE_PATH)
    const table = writeTable(DOCS_FILE_PATH)
    const docCollection = createDocCollection(DOCS_FILE_PATH)
    const introCollection = createDocCollection(INTRO_FILE_PATH)
    const types = writeTypes(TYPES_FILE_PATH)
    const availableMatchers = writeAvailableMatchers()
    const combined = [
        introCollection,
        toc,
        table,
        availableMatchers,
        docCollection,
        types,
    ].join('\n')

    fs.writeFileSync(`./README.md`, combined)
})()
