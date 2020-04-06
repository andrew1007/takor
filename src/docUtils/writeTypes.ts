const writeTypes = (types: string) => (`
#### types
\`\`\`typescript
${types}
\`\`\`
`);

(function () {
    const fs = require('fs')
    const text = fs.readFileSync(`../src/types.ts`, 'utf8')
    const replacedExportKeyWord = text.replace(/export /g, '')
    console.log(writeTypes(replacedExportKeyWord))
})()
