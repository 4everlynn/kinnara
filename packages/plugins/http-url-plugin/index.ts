import { HttpUrlPlugin, HttpUrlPluginName } from '../../types'

export default class LinkedHttpUrlPlugin implements HttpUrlPlugin {
    private readonly _linked: boolean = false

    constructor ({ link }: { link: boolean }) {
      if (link) {
        this._linked = link
      }
    }

    install ({ url, chain }: ({ url: string; chain: string[] })): string {
      if (!this._linked) {
        const tmp = [...chain]
        delete tmp[tmp.length - 1]
        return `/${tmp.join('/').replace(/\/$/, '')}${url}`
      }
      return `/${chain.join('/')}${url}`
    }

    name: HttpUrlPluginName = '@HttpUrlPlugin'
}
