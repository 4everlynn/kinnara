type HttpMethod = 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'PATCH' | 'HEAD' |
    'get' | 'post' | 'options' | 'put' | 'patch' | 'head'

type strategy = 'session' | 'local'

type CacheParams = {
    strategy: strategy,
    frequency: number
}

type RequestWrapper = {
    method?: HttpMethod,
    url?: string,
    headers?: any,
    query?: any,
    body?: any
    observable?: boolean,
    cache?: CacheParams | Number
}

interface RequestAdapter {
    request(wrapper: RequestWrapper): Promise<any>
}

interface Interceptor {
    has (uri: string): boolean
    process (uri: string, request: Promise<any>): Promise<any>
    register (handler: {
        uri: string,
        h: (response: any) => any
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
    listen (uri: string, h: (response: any) => any): string
    cancel(url:string): boolean
}

interface RequestCommand {
    get(request: RequestWrapper): Promise<any>

    post(request: RequestWrapper): Promise<any>

    put(request: RequestWrapper): Promise<any>

    patch(request: RequestWrapper): Promise<any>

    head(request: RequestWrapper): Promise<any>

    options(request: RequestWrapper): Promise<any>

    struct(request: RequestWrapper): Promise<any>
}

export {
  RequestWrapper,
  RequestAdapter,
  RequestCommand,
  HttpProxy,
  HttpMethod
}
