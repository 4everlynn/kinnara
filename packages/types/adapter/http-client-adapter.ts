import { RequestAdapter, RequestWrapper } from '../core'

export default class HttpClientAdapter implements RequestAdapter {
  async request (wrapper: RequestWrapper): Promise<any> {
    console.log(wrapper)
    // console.log(`request entered ${JSON.stringify(wrapper)}`)
    return { code: 200, msg: 'ok' }
  }
}
