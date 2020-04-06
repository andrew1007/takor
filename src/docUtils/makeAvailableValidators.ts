import typeMatchers from '../typeMatchers'
import fs from 'fs'

(function () {
    console.log(typeMatchers)
    const keys = [...typeMatchers].map(([el]) => {
        return el && el.name ? `- \`${el.name}\` (Constructor)` : `- \`${el}\``
    })
    const uniqueNames = [...new Set(keys)]
        .filter(el => typeof el === 'string' ? !el.includes('enforce') : true)
        .join('\n')
const availableMatchersText = `#### Available Matchers

##### Description 
Out-of-the-box type validators. See examples for usage.`
    fs.writeFileSync(`./testFile.md`, `${availableMatchersText}\n${uniqueNames}\n`)
})()
