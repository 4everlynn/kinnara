import {
  Command,
  HttpMethod,
  HttpProxy,
  Interceptor,
  RequestAdapter,
  RequestCommand,
  RequestWrapper,
  StaticCommandSupport
} from '../types'
import log from '../support/support-logging'
import ApiInterceptor from './api-interceptor'

export default class Kinnara implements StaticCommandSupport, HttpProxy {
    /**
     * 全局指令存储, 公共参数，允许自定义指令自定义进行使用
     */
    public static _cmd: any = {}

    /**
     * general agent
     * @private
     */
    private _proxy: any
    /**
     * 子代理
     * @private
     */
    private _subProxies: any = {}

    /**
     * http 请求适配层
     * @private
     */
    private _adapter?: RequestAdapter

    /**
     * 指令代理，用于实现隐式装饰器模式
     * @private
     */
    private _cmdProxy: any

    private _interceptor: Interceptor

    constructor () {
      this._interceptor = new ApiInterceptor()
    }

    /**
     * proxy routing
     * @param routing
     */
    proxy (routing: any): any {
      if (!this._adapter) {
        throw new Error('You must specify a request adapter for request proxy.')
      }
      const self = this
      // 根代理 root$->leafA$->leafB$->uri
      this._proxy = new Proxy(routing, {
        get: (target: any, property: string) => {
          // 判断原始路由是否存在该属性
          if (target.hasOwnProperty(property)) {
            return self._injectSubProxy(target, property, self._subProxies)
          }
          log.error(`No related Key '${property}' is mounted on the target router`)
        }
      })
      return this._proxy
    }

    /**
     * is root node (last level)
     * @param node
     * @private
     */
    private static _isRoot (node: any): boolean {
      return typeof node !== 'object'
    }

    remove(entryPoint: string): StaticCommandSupport
    remove(cmd: Command): StaticCommandSupport
    remove (entryPoint: string | Command): StaticCommandSupport {
      return this
    }

    use (cmd: Command): StaticCommandSupport {
      Kinnara.use(cmd)
      return this
    }

    static use (Cmd: any) {
      const instance = new Cmd()
      // 安装指令
      Kinnara._cmd[instance.name()] = Cmd
    }

    /**
     * 注入子代理
     * @param rootTarget 当前字段父对象
     * @param property 当前字段名称
     * @param parent 代理节点父对象
     * @private
     */
    private _injectSubProxy (rootTarget: any, property: string, parent: any) {
      const self = this
      // 由于存储的结构为平层结构, 存储时将 Key 存储为 A$.B$.C 的格式
      // 故最后一条即为当前节点，用于获取对象实际值
      const key = property.split('$.').reverse()[0]
      // 判定是否为根节点
      if (!Kinnara._isRoot(rootTarget[key])) {
        // 初始化代理对象
        if (!parent[property]) {
          parent[property] = {}
        }
        // 初始化代理字段
        if (!parent[property]._proxy) {
          parent[property]._proxy = {}
        } else {
          // 已经初始化过即直接返回，提高性能
          return parent[property]._proxy
        }
        // 初始化代理字段
        parent[property]._proxy = new Proxy(rootTarget[key], {
          get: (t, p) => {
            // 递归代理
            return self._injectSubProxy(t, `${property}$.${p.toString()}`, parent[property])
          }
        })
        // 返回代理对象
        return parent[property]._proxy
      }
      // 此处开始为递归至根节点
      // 取出根节点的字符串
      const url = rootTarget[key]
      // last level, 底层代理，代理一个空对象
      return new Proxy({}, {
        get: (target: any, cmd) => {
          const commands = Kinnara._cmd
          let rootWrapper = { url }
          // 实例化 HTTP 客户端适配器
          if (commands.hasOwnProperty(cmd)) {
            self._cmdProxy = new Proxy(commands, {
              get: (cmdProxy, name) => {
                // 执行指令
                const command = new cmdProxy[name]()
                const root = { url: rootTarget[key] }
                // 注入根请求对象
                command.wrapper = root
                if (command && command.entrypoint) {
                  // 设置入口点装饰器
                  command.bin = (...props: any) => {
                    rootWrapper = Object.assign(root, command.entrypoint(...props))
                    const client: any = self._http(root, root.url, property)
                    return client
                  }
                }
                // 返回执行入口
                return command.bin
              }
            })
            // 返回客户端
            return self._cmdProxy[cmd]
          }
          const client: any = self._http(rootWrapper, url, property)
          // 未使用指令
          if (client[cmd]) {
            // 直接返回客户端
            return client[cmd]
          }
        }
      })
    }

    /**
     * 返回包装好的 HTTP 客户端
     * @param rootWrapper
     * @param original 原始 URI
     * @param property 请求对象路径
     * @private
     */
    private _http (rootWrapper: RequestWrapper, original: string, property: string) {
      // 局部抽取，减少重复代码
      const inject = (w: RequestWrapper, m: HttpMethod = 'GET', wrapper: boolean = false): Promise<any> | any => {
        // 请求对象封装
        const struct = {
          method: w?.method ? w.method : m,
          ...rootWrapper,
          ...w
        }
        // wrapper 模式
        if (wrapper) {
          return struct
        }

        const request = this._adapter!.request(struct)

        if (rootWrapper.observable === false) {
          return request
        }

        return this._interceptor.process(original, request, struct)
      }
      const requestWrapper: RequestCommand = {
        get: w => inject(w),
        post: w => inject(w, 'POST'),
        put: w => inject(w, 'PUT'),
        delete: w => inject(w, 'DELETE'),
        head: w => inject(w, 'HEAD'),
        patch: w => inject(w, 'PATCH'),
        options: w => inject(w, 'OPTIONS'),
        struct: w => inject(w, 'GET', true)
      }
      return requestWrapper
    }

    setHttpAdapter (adapter: RequestAdapter): HttpProxy {
      this._adapter = adapter
      return this
    }

    subscribe (uri: string | RegExp, h: (request: RequestWrapper, response: any) => any): string {
      if (uri instanceof RegExp) {
        uri = new RegExp(uri.source.replace(/{[\w-]+}/, '[\\w-]+'))
      } else {
        uri = new RegExp(uri.replace(/{[\w-]+}/, '[\\w-]+').concat('$'))
      }
      // 注册拦截器
      return this._interceptor.register({ uri, h })
    }

    cancel (key: string):boolean {
      return this._interceptor.unload(key)
    }
}
