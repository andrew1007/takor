const writeTypes = (types: string) => (`
#### types
\`\`\`typescript
${types}
\`\`\`
`)

export default function (path: string) {
    const fs = require('fs')
    const text = fs.readFileSync(path, 'utf8')
    const replacedExportKeyWord = text.replace(/export /g, '')
    return writeTypes(replacedExportKeyWord)
}
