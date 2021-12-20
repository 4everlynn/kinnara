import { RequestAdapter, RequestWrapper } from '../core'

/**
 * 提供 Axios 的适配器默认实现
 */
export default class AxiosHttpAdapter implements RequestAdapter {
    private readonly _axios: any | null | undefined

    constructor (instance?: any | null) {
      this._axios = instance
      if (!this._axios) {
        // adapter for axios
        try {
          this._axios = require('axios')
        } catch {
          throw new Error('No axios instance found.')
        }
      }
    }

    request (wrapper: RequestWrapper): Promise<any> {
      if (!this._axios) {
        throw new Error('No axios instance found.')
      }
      return new Promise<any>((resolve, reject) => {
        this._axios({
          url: wrapper.url,
          method: wrapper.method,
          data: wrapper.body,
          headers: wrapper.headers,
          params: wrapper.query
        }).then((response: any) => {
          if (response === undefined) {
            reject(new Error('request with error.'))
          } else {
            resolve(response)
          }
        }).catch((error: Error) => reject(error))
      })
    }
}
