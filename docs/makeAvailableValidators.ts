(function() {
    const typeMatchers = require('../src/typeMatchers')

    const keys = [...typeMatchers].map(([el]) => {
        console.log(el.name || 'hhello')
    })
    console.log('????')
    console.log(keys)
})()
