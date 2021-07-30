import { Command, RequestWrapper } from '../types'

export default class ReplaceCommand implements Command {
    wrapper!: RequestWrapper

    entrypoint (mapper: any): RequestWrapper {
      let url = this.wrapper.url
      for (const key in mapper) {
        if (mapper.hasOwnProperty(key)) {
          url = url?.replace(`{${key}}`, mapper[key])
        }
      }
      return { url }
    }

    name (): string {
      return 'replace'
    }
}
