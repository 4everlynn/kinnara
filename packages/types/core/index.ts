type HttpMethod = 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' |
    'get' | 'post' | 'options' | 'put' | 'patch' | 'head' | 'delete'

type RequestWrapper = {
    method?: HttpMethod,
    url?: string,
    headers?: any,
    query?: any,
    body?: any
    observable?: boolean,
}

interface RequestAdapter {
    request(wrapper: RequestWrapper): Promise<any>
}

interface Interceptor {
    has (uri: string): boolean | string
    process (uri: string, request: Promise<any>, wrapper: RequestWrapper): Promise<any>
    register (handler: {
        uri: string | RegExp,
        h: (request: RequestWrapper, response: any) => any
    }): string
    unload(uri:string):boolean
    encode (uri: string): string
}

export {
  Interceptor
}

interface HttpProxy {
    /**
     * proxy object so that it can directly make requests
     * @param routing
     */
    proxy(routing: object): any;

    /**
     * 设置 Http 请求适配器
     * @param adapter
     */
    setHttpAdapter(adapter: RequestAdapter): HttpProxy

    /**
     * 监听某个接口的调用
     * @param uri
     * @param h 处理器
     */
    subscribe (uri: string, h: (response: any) => any): string
    cancel(url:string): boolean
}

interface RequestCommand {
    get(request?: RequestWrapper): Promise<any>

    post(request?: RequestWrapper): Promise<any>

    put(request?: RequestWrapper): Promise<any>

    patch(request?: RequestWrapper): Promise<any>

    delete(request?: RequestWrapper): Promise<any>

    head(request?: RequestWrapper): Promise<any>

    options(request?: RequestWrapper): Promise<any>

    struct(request?: RequestWrapper): Promise<any>
}

type Operator<T> = T extends string ? (RequestCommand & {
    [k: string]: (...args: any[]) => RequestCommand
}) : {
    [K in keyof T]: Operator<T[K]>
}

type KinnaraProxy<T extends object> = { [K in keyof T ]: K extends string ? Operator<T[K]> : never}

type HttpUrlPluginName = '@HttpUrlPlugin'

interface KinnaraRuntimePlugin {
    name: string
    install (...args: any []): any
}

abstract class HttpUrlPlugin implements KinnaraRuntimePlugin {
    name: HttpUrlPluginName = '@HttpUrlPlugin'

    abstract install ({ url, chain }: { url: string, chain: string[] }): string
}

export {
  HttpUrlPlugin
}

export {
  HttpUrlPluginName,
  KinnaraRuntimePlugin,
  KinnaraProxy,
  Operator,
  RequestWrapper,
  RequestAdapter,
  RequestCommand,
  HttpProxy,
  HttpMethod
}
