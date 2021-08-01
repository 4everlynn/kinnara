import { Command, RequestWrapper } from '../types'

/**
 * 设置单次请求中 API 是否可被观察
 */
export default class ObservableCommand implements Command {
  entrypoint (observable: boolean): RequestWrapper {
    return {
      observable
    }
  }

  name (): string {
    return 'observe'
  }
}
