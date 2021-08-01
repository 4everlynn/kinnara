import { Command, RequestWrapper } from '../types'

export default class HeadCommand implements Command {
  entrypoint (headers: any): RequestWrapper {
    return {
      headers
    }
  }

    wrapper!: RequestWrapper;

    name (): string {
      return 'head'
    }
}
