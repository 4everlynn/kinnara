import { Interceptor } from '../types'

export default class ApiInterceptor implements Interceptor {
  /**
     * 存储API标记
     * @private
     */
  private _symbols: any = {}

  has (uri: string): boolean {
    return this._symbols[this.encode(uri)]
  }

  async process (uri: string, request: Promise<any>): Promise<any> {
    if (this.has(uri)) {
      const response = await request
      return this._symbols[this.encode(uri)].h(response)
    }
    return request
  }

  register (handler: { uri: string; h: (response: any) => any }): string {
    const key = this.encode(handler.uri)
    this._symbols[key] = handler
    return key
  }

  unload (uri:string) :boolean {
    if (this._symbols[uri]) {
      delete this._symbols[uri]
      return true
    }
    return false
  }

  encode (uri: string): string {
    const buffer = []
    for (let i = 0; i < uri.length; i++) {
      buffer.push((uri.charCodeAt(i)).toString(16))
    }
    return buffer.join('')
  }
}
