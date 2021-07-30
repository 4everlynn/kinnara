import { Command, RequestWrapper } from '../types'

export default class MapCommand implements Command {
  entrypoint (callback: (w: RequestWrapper) => RequestWrapper): RequestWrapper {
    let tmp = JSON.parse(JSON.stringify(this.wrapper))
    tmp = callback && callback(tmp)
    return {
      ...tmp
    }
  }

    wrapper!: RequestWrapper

    name (): string {
      return 'map'
    }
}
