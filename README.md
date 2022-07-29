![](https://img.shields.io/badge/fatewajs-Kinnara-red?style=for-the-badge&logo=typescript&labelColor=black ) ![](https://img.shields.io/badge/npm-v1.0.6-orange?style=for-the-badge&logo=npm&labelColor=black )  ![](https://img.shields.io/badge/gitpod-try!-gold?style=for-the-badge&logo=gitpod&labelColor=black )


- [Kinnara](#kinnara )
- [Install](#install )
- [Quick Start](#quick-start )
- [操作指令](#操作指令 )
    - [基础代码](#基础代码 )
    - [Join](#join )
    - [head](#head )
    - [replace](#replace )
    - [seq](#seq )
    - [map](#map )
    - [observe](#observe )
- [自定义操作命令](#自定义操作命令 )
- [Kinnara 中的观察者](#kinnara-中的观察者 )
    - [取消订阅](#取消订阅 )
    - [有什么用 ?](#有什么用 )

###  Kinnara


> Kinnara 是为了解决前端应用中接口路径难管理、代码重复率高等问题而实现的基于 JSProxy 的轻量级解决方案

###  Install


一般情况下，安装最新的版本即可

```bash
npm i @fatewa/kinnara
```

###  Quick Start


```js
// 定义接口路径对象
const routes = {
    v1: {
        users: '/v1/users',
        favorites: '/v1/favorites'
    }
}
  
// 实例化一个对象
const kinnara = new Kinnara()
  
const _ = kinnara
        // 设置一个 http 请求适配器
        // kinnara 提供了一个 axios 的适配器
        // 构造器传递的参数为 AxiosInstance
        .setHttpAdapter(new AxiosHttpAdapter(axios))
        // 并返回代理对象
        .proxy(routes)
  
 (async () => {
  
    // 直接使用对象 key 路径对接口进行请求
    const response = await _.v1.users.get()
  
})()
```

直接重用路由结构，直接请求接口,
支持 `自定义指令`，默认提供一套操作指令,
使用 `Kinnara`，API路径难以管理即将成为过去。

###  操作指令


我们在路径中声明的URI通常很难满足所有情况，
我们无法避免 URI 的调整
因此，`Kinnara` 提供了一个通用的、可扩展的命令接口，通过这些命令可以轻松地操作URL、Headers 和 其他属性。

####  基础代码


下文中的命令介绍代码都有这一段通用的代码，
在此声明后下文介绍命令时不再重复编写

```js
const kinnara = new Kinnara()
  
// 定义接口路径对象
const routes = {
    v1: {
        users: {
          root: '/v1/users',
          single: '/v1/users/{id}'
        }
        favorites: '/v1/favorites',
    }
  
// 得到代理对象
const _: any = kinnara
                .setHttpAdapter(new AxiosHttpAdapter(axios))
                .proxy(routing)
```

####  Join


在 URL 的右边动态地添加字符串

```js
// 动态得到的参数值
const configId = 1
  
const response = _.v1.users.root
    .join`/${configId}`
    .get()
```

得到的 URI 为 `/v1/users/1`

####  head


为单次请求添加请求头

```js
const response = _.v1.users.root
  .head({
      ContentType:'application/json',
      Origin: 'https://xxx'
  })
  .get()
```
####  replace


替换 URI 中的占位符

```js
const response = _.v1.users.single
  .replace({ id: 1 })
  .get()
```

得到的 URI 为 `/v1/users/1`

####  seq


指令序列，可以聚合多个指令执行，
用于构建复杂的 URI 操作

```js
const response = _.v1.users.single
  .seq((chain) => {
    // chain provides all the instructions for the Kinnara library
    chain.replace({ id: 1 })
    chain.join`/issues`
    chain.head({ ContentType:'application/json' })
  })
  .get()
```

得到的 URI 为 `/v1/users/1/issues`, 并且请求时会附加 `ContentType: application/json `

####  map


操作原始请求对象，并进行映射，基本上可以处理任意复杂请求，
如果目前 `Kinnara` 所提供的命令无法满足需求，则可以使用 `map`

```js
// API参数以执行自定义操作
const resposne = _.v1.users.single
  .map((it: RequestWrapper) => {
    // 调整请求url
    url: '/users',
    // 调整请求头
    headers: {},
    // 调整查询参数
    query: {},
    // 调整 body 参数
    body: {}
    // 调整是否可被观察(详情见下文)
    observable: true
  })
  .get()
  
  
// 或者你也可以直接将 map 中要返回的对象作为 get 的参数传入
const resposne = _.v1.users.single
  .get({
    // 调整请求url
    url: '/users',
    // 调整请求头
    headers: {},
    // 调整查询参数
    query: {},
    // 调整 body 参数
    body: {}
    // 调整是否可被观察(详情见下文)
    observable: true
  })
```

两种方式任选其一即可

####  observe


控制当前请求是否可被观察(见下文)

```js
_.v1.users.root
  // 设置本次请求为禁止观察
  .observe(false)
  .get()
```

###  自定义操作命令


如果上文中所提到的命令都无法满足需求，则可以自定义命令，
我们以实现 `random` 命令为例，
`random` 的作用为，在 `URI` 右边添加一个随机的整数

自定义指令的本质其实是对 RequestWrapper 对象的构建

```ts
export default class RandomCommand implements Command {
  
  /**
   * 当前已经处理完毕的结构
   */
  wrapper!: RequestWrapper
  
  /**
   * 命令的参数，这里我们设定一个系数
   */
  entrypoint (coefficient: number): RequestWrapper {
    return {
      url: `${this.wrapper.url}/${Math.random() * coefficient | 0}`
    }
  }
  
    /**
     * 命令在调用时的名称
     */
    name (): string {
      return 'random'
    }
  
}
```

使用

```ts
// 装载命令
Kinnara.use(RandomCommand)
  
// 使用自定义命令
_.v1.users.root.random(100).get()
```

###  Kinnara 中的观察者


在 URL 处于请求状态时提供订阅功能，因此您可以拦截或执行一些额外的响应处理

```js
// 监听一个接口的请求
// 第一个参数的类型为 RegExp ｜ string
// 当路径中存在占位符时，
// Kinnara 会自动将 形如 {any} 的占位符替换为 [\w-]+? 并将字符串转为正则
kinnara.subscribe(routes.v1.users.single, (request, response) => {
  // ... Do anything you want
  return {
    ...response,
    ext: '这是在订阅中新增的字段‘
  }
})
  
// After the listener
_.v1.users.single.replace({ id: 1 }).get((response) => {
  // 由于订阅时新增了此字段，在调用时，可以获取到
  const { ext } = response
})
```

如果在订阅中需要再次调用被订阅的 API，为了防止栈溢出，需在订阅的处理器中
禁用观察

```js
kinnara.subscribe(routes.v1.users.single, (request, response) => {
  
  _.v1.users.single.seq(chain => {
    chain.replace({ id: 1 })
    // 标记禁用观察，避免栈溢出
    chain.observe(false)
  }).get()
  
  return {
    ...response,
    ext: '这是在订阅中新增的字段‘
  }
})
  
_.v1.users.single.replace({ id: 1 }).get((response) => {
  // 由于订阅时新增了此字段，在调用时，可以获取到
  const { ext } = response
})
```

####  取消订阅


调用 `subscribe` 方法后，会得到一个 `key`， 取消就是通过这个 key

```ts
const key = kinnara.subscribe(any, any)
  
// 取消订阅
kinnara.cancel(key)
```

####  有什么用 ?


有了针对单个路径的观察模型，我们可以很容易地实现一条完整的请求链路,
并且这个链路是全局有效的

我们假设现在拿到了一个这样的接口文档


获取当前登录用户的角色集合
`/v1/users/roles`

Response
```js
code: 200,
// 角色 ID
data: [1, 2, 3, 4]
```

根据角色ID获取角色详情
`/v1/roles/{id}`

Response
```js
code: 200,
// 角色 ID
data: {
  name: '管理员',
  code: 'admin'
}
```

很显然，这两个接口就是存在链路关系的, 我们使用 kinnara 对接这两个接口

我们推荐以下的文件夹组织结构进行管理

```
使用 index 进行导出, 各个模块的接口
放置在各自的文件夹中进行维护
  
project
├── api
│   ├── user
│   │   ├── index.ts
│   ├── biz
│   │   ├── index.ts
│   └── index.ts
```

user/index.ts
```ts
export default {
  users: {
    root: '/users',
    roles: '/users/roles'
  }
}
```

roles/index.ts
```ts
export default {
  roles: {
    root: 'roles',
    single: '/roles/{id}'
  }
}
```

index.ts
```ts
import users from './users'
import roles from './roles'
  
  
export default {
  // 外层组织 API 版本号
  v1: { users, roles }
}
  
```

```ts
import routes from '@/api'
  
const kinnara = new Kinnara()
  
// 得到代理对象
const _: any = kinnara
                .setHttpAdapter(new AxiosHttpAdapter(axios))
                .proxy(routing)
  
  
// 订阅请求用户角色的接口
kinnara.subscribe(routes.v1.users.roles, async (request, response) => {
  const { data } = response
  const roles = []
  for (const id of data) {
    const role = await _.v1.roles.single.seq(chain => {
      chain.replace({ id })
      chain.observe(false)
    }).get()
    roles.push(roles)
  }
  return {
    ...response,
    // 保留原始请求结构，复写 data 属性
    data: roles
  }
})
```

调用

```ts
  
_.v1.users.roles.get()
  
// 得到的结果 -> [{ ...role（完整的 Role 对象） }]
  
```

当然这样的请求方式，显然是不够合理的，很容易导致 Qps 过高，
所以我们需要对请求的结果进行缓存（如果应用是面向 C 端的，这样的处理方式仍旧不合理）

```ts
  
// 缓存请求到的结果
const cache = {
  counter: 0,
  data: null
}
  
// 订阅请求用户角色的接口
kinnara.subscribe(routes.v1.users.roles, async (request, response) => {
  const { data } = response
  const roles = []
  
  if (!cache.data) {
    for (const id of data) {
      const role = await _.v1.roles.single.seq(chain => {
        chain.replace({ id })
        chain.observe(false)
      }).get()
      roles.push(roles)
    }
    cache.data = roles
  } else {
    roles = cache.data
    // 缓存的数据保留 50 次，
    // 次数超过 50 后，则再次请求, 一定程度保障数据的实时性
    if (++cache.counter > 49) {
       cache.data = null
       cache.counter = 0
    }
  }
  
  return {
    ...response,
    // 保留原始请求结构，复写 data 属性
    data: roles
  }
})
```
