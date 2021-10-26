import { CacheManager, CacheParams, ResponseCache } from '../types'

export default class ScopedCacheManager implements CacheManager {
  doCache (params: CacheParams): ResponseCache {
    return {
      path: [],
      remain: params.frequency,
      body: []
    }
  }
}
