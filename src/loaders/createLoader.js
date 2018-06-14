import DataLoader from 'dataloader'
import unique from '../utils/uniqueElements'
import type { Loader, DataLoaderOptions } from '../flowTypes'

function indexeResults (results, indexField, cacheKeyFn) {
  var indexedResults = new Map()
  results.forEach(res => {
    const key = typeof indexField === 'function' ? indexField(res) : res[indexField]
    indexedResults.set(cacheKeyFn(key), res)
  })
  return indexedResults
}

function normalizeRethinkDbResults (keys, indexField, cacheKeyFn) {
  return results => {
    var indexedResults = indexeResults(results, indexField, cacheKeyFn)
    return keys.map(val => {
      return indexedResults.get(cacheKeyFn(val)) || null
    })
  }
}

// Because of the following reasons, the results needs to be normalized
// For rethinkdb batch function getAll()
// 1. Order of results is not guaranteed
// 2. Non-existent keys will not return an empty record
const createLoader = (
  batchFn: Function,
  indexField: string | Function = 'id',
  cacheKeyFn: Function = key => key
) => (options?: DataLoaderOptions): Loader => {
  return new DataLoader(keys => {
    return batchFn(unique(keys)).then(
      normalizeRethinkDbResults(keys, indexField, cacheKeyFn)
    )
  }, options)
}

export default createLoader
