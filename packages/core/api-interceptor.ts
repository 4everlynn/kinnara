import { Interceptor, RequestWrapper } from '../types'

export interface ApiMarker {
  uri: string | RegExp
  h: (request: RequestWrapper, response: any) => any
  key: string,
  index: number
}

/**
 * 请求拦截器
 */
export default class ApiInterceptor implements Interceptor {
  /**
     * 存储API标记
     * @private
     */
  private _symbols: ApiMarker[] = []

  /**
   * 处理器集合
   * @private
   */
  private _markers: any = {}

  /**
   * 判断路径是否具备触发拦截器条件
   * @param uri
   */
  has (uri: string): boolean | string {
    const key = this.encode(uri)
    for (const sym of this._symbols) {
      const tmp = sym.uri
      if (tmp instanceof RegExp) {
        if (tmp.test(uri)) {
          return sym.key
        }
      }
      if (typeof tmp === 'string' && key === this.encode(tmp)) {
        return key
      }
    }
    return false
  }

  async process (uri: string, request: Promise<any>, wrapper: RequestWrapper): Promise<any> {
    const result = this.has(uri)
    if (result !== false && typeof result === 'string') {
      const response = await request
      const marker = this._markers[result] as ApiMarker
      return marker.h(wrapper, response)
    }
    return request
  }

  /**
   * 注册拦截器处理器
   * @param handler
   */
  register (handler: { uri: string; h: (request: RequestWrapper, response: any) => any }): string {
    const key = this.encode(handler.uri)
    const marker = {
      uri: handler.uri,
      h: handler.h,
      key,
      index: this._symbols.length
    }
    this._symbols.push(marker)
    this._markers[key] = marker
    return key
  }

  /**
   * 取消订阅
   * @param key
   */
  unload (key:string) :boolean {
    if (this._markers[key]) {
      const marker = this._markers[key] as ApiMarker
      delete this._markers[key]
      this._symbols.splice(marker.index, 1)
      return true
    }
    return false
  }

  /**
   * 对URI进行编码
   * @param uri
   */
  encode (uri: string): string {
    const buffer = []
    for (let i = 0; i < uri.length; i++) {
      buffer.push((uri.charCodeAt(i)).toString(16))
    }
    return buffer.join('')
  }
}
