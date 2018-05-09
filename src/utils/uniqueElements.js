// @flow
const unique = (array: Array<mixed>): Array<mixed> => {
  if (array.length <= 1) {
    return array
  }

  // Turn all elements into strings, including arrays
  const stringElements = array.map(key => JSON.stringify(key))

  // Get the unique elements by using an ES6 set
  const uniqueElements = [...new Set(stringElements)]

  // Turn the non-string elements back into non-strings
  return uniqueElements.map(key => {
    try {
      return JSON.parse(key)
    } catch (err) {
      return key
    }
  })
}

export default unique
