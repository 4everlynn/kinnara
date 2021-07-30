type HttpMethod = 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'PATCH' | 'HEAD' |
    'get' | 'post' | 'options' | 'put' | 'patch' | 'head'

type RequestWrapper = {
    method?: HttpMethod,
    url?: string,
    headers?: any,
    query?: any,
    body?: any
}

interface RequestAdapter {
    request(wrapper: RequestWrapper): Promise<any>
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
}

interface RequestCommand {
    get(request: RequestWrapper): Promise<any>

    post(request: RequestWrapper): Promise<any>

    put(request: RequestWrapper): Promise<any>

    patch(request: RequestWrapper): Promise<any>

    head(request: RequestWrapper): Promise<any>

    options(request: RequestWrapper): Promise<any>

    wrapper(request: RequestWrapper): Promise<any>
}

export {
  RequestWrapper,
  RequestAdapter,
  RequestCommand,
  HttpProxy,
  HttpMethod
}
