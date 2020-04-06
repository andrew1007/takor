#### not.oneOf

##### Desc
The converse [oneOf](#oneof)
##### Notes

##### Examples
```javascript
const keyIsNotNull = takor.shape({
    key: takor.not.oneOf(null)
})

keyIsNotNull(({ // true
    key: 10
}))
```