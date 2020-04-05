#### shape

##### Desc
Asserts a specific structure of a pojo (plain old javascript object)

##### Notes
- `shape` checks only top level keys.
- Nest another `shape` to assert deeper
- Does not check for superfluous keys. Only ensures types of defined keys

##### Examples
```javascript
const assert = takor.shape({
    key: String
})
assert({key: ''}) // true


const assertNested = takor.shape({
    key: takor.shape({
        key: takor.shape({
            key1: String
        })
    })
})

assertNested({ // false
    key: {
        els: '10'
    }
})

const assertApiPayload = takor.shape({
    data: takor.arrayOf(takor.shape({
        user: takor.shape({
            phoneNumber: Number,
            firstName: String
        })
    }))
})

assertApiPayload({ // true
    data: [{
        user: {
            phoneNumber: 4024224856,
            firstName: 'john',
            lastName: 'smith' // does not check this key
        }
    }]
})
```
