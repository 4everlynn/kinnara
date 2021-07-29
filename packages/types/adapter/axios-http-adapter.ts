import { RequestAdapter, RequestWrapper } from '../core'
import axios, { AxiosInstance } from 'axios'

/**
 * 提供 Axios 的适配器默认实现
 */
export default class AxiosHttpAdapter implements RequestAdapter {
    private readonly _axios: AxiosInstance | null | undefined

    constructor (instance?: AxiosInstance | null) {
      this._axios = instance
      if (!this._axios) {
        this._axios = axios
      }
    }

    request (wrapper: RequestWrapper): Promise<any> {
      if (!this._axios) {
        throw new Error('No axios instance found.')
      }
      return this._axios({
        url: wrapper.url,
        method: wrapper.method,
        data: wrapper.body,
        headers: wrapper.headers,
        params: wrapper.query
      })
    }
}
