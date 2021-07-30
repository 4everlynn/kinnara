/* eslint-disable no-undef */

import { Kinnara, RequestWrapper } from '../packages'
import { ROUTING } from './simulation-data'
import HttpClientAdapter from '../packages/types/adapter/http-client-adapter'

test('CommandTest', () => {
  const proxy = new Kinnara()
    .setHttpAdapter(new HttpClientAdapter())
    .proxy(ROUTING)

  const id = 1

  // // 加入
  proxy.placeholder.join`/{user}/${id}/2/`.get()

  // 直接映射对象
  proxy.placeholder.map((it: RequestWrapper) => ({
    url: it.url + '3',
    headers: {
      ContentType: 'application/json'
    }
  })).get()

  // 替换
  proxy.placeholder.replace({
    id
  }).get()
})
