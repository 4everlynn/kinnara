/* eslint-disable no-undef */

import { Kinnara } from '../packages'
import { ROUTING } from './simulation-data'
import HttpClientAdapter from '../packages/types/adapter/http-client-adapter'

test('CommandTest', () => {
  const kinnara = new Kinnara()

  const proxy = kinnara
    .setHttpAdapter(new HttpClientAdapter())
    .proxy(ROUTING)

  // 监听某个API的调用
  kinnara.listen(ROUTING.placeholder, async (response: any) => {
    // 调用另一个API
    // const tce = await proxy.energy.tce.get()
    console.log('gggggg')
    return {
      edward: 'YOU WILL SEE THIS'
    }
  })
  // 经过侦听器
  proxy.placeholder.replace({ id: 3 }).get()
    .then((response: any) => { console.log('pass', response) })

  // 不经过侦听器
  proxy.placeholder
    .observe(false)
    .get().then((r: any) => console.log(r))

  // // 描述 API 的依赖关系
  // // @ts-ignore
  // kinnara.dep(ROUTING.placeholder, (chain: any) => {
  //   // 绑定一个其他的 API，指定关系映射的字段
  //   // noinspection TypeScriptValidateJSTypes
  //   chain(ROUTING.other,
  //     (parent: any, it: any) => parent.areaId === it.id)
  //     .as('name')
  //     .cache()
  // })
  //
  // proxy.placeholder.join`/{auth_token}`.struct()
  // proxy.placeholder.replace({ auth_token: 'token' }).struct()
  // proxy.placeholder.map((it: RequestWrapper) => it).struct()
  // proxy.placeholder.head({ ContentType: 'application/json' }).struct()
  // console.log(proxy.placeholder.seq((chain: any) => {
  //   chain.join`/{new_token}`
  //   chain.replace({ id: '1' })
  //   chain.seq((sub: any) => {
  //     sub.replace({ new_token: 'token' })
  //   })
  // }).struct())

  proxy.placeholder.join`/info`.get()

  proxy.placeholder.seq((chain: any) => {
    chain.join`/info`
    chain.replace({
      id: 1
    })
  }).get()

  proxy.placeholder.replace({
    id: 1
  }).get()
})

test('11', async () => {
  const kinnara = new Kinnara()
  kinnara.setHttpAdapter(new HttpClientAdapter())

  const API = {
    region: '/region',
    rep: '/rep/{id}',
    industry: '/industry',
    entType: {
      t: {
        a: {
          c: {
            e: {
              f: '/ent-type'
            }
          }
        }
      }
    },
    ent: '/ent'
  }

  const $kinnara = kinnara.proxy(API)

  $kinnara.listen(API.ent, async (response: any) => {
    await $kinnara.rep.replace({ id: 1 }).get({
      cache: {
        strategy: 'local',
        frequency: 50,
        scoped: true
      }
    })
    console.log(response)
    return response
  })
})
