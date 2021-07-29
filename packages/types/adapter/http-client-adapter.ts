import { RequestAdapter, RequestWrapper } from '../core'

export default class HttpClientAdapter implements RequestAdapter {
  async request (wrapper: RequestWrapper): Promise<any> {
    console.log(`request entered ${JSON.stringify(wrapper)}`)
    return null
  }
}
