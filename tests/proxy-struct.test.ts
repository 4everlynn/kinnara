/* eslint-disable no-undef */
// noinspection JSTestFailedLine

import { Kinnara } from '../packages'
import AxiosHttpAdapter from '../packages/types/adapter/axios-http-adapter'
import JoinCommand from '../packages/cmd/cmd-join'
import axios from 'axios'

test('ProxyStruct', async () => {
  // 安装指令
  Kinnara.use(new JoinCommand())

  const kinnara = new Kinnara()
  // 声明 API 结构
  const routing = {
    park: {
      settings: '/settings/param/page'
    }
  }
  // 声明代理对象
  const proxy: any =
        kinnara
        // 设置 HTTP 适配器
          .setHttpAdapter(new AxiosHttpAdapter(axios.create({ baseURL: 'https://dlmhg.cn:8443/api' })))
          .proxy(routing)

  // 直接使用代理对象路由结构请求接口
  const response = await proxy.park.settings.get({
    query: {
      current: 1,
      size: 100
    }
  })
  // 数据结构
  console.log(response.data)
})
