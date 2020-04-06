#### pojo

##### Desc
Not a validator. It is a raw function that if a value is a pojo. Use [shape](#shape) to specify a pojo shape

##### Notes
Intended use is as an argument for validators

##### Examples
```javascript
takor.pojo({}) // true
takor.pojo(10) // false
```
