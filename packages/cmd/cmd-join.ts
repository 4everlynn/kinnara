import { Command, RequestWrapper } from '../types'

export default class JoinCommand implements Command {
  wrapper!: RequestWrapper

  /**
     * 入口
     * @param tmpl 字符串模版
     * @param props 参数
     */
  entrypoint (tmpl: TemplateStringsArray, ...props: string []): RequestWrapper {
    const builder = []
    let index = 0
    for (const it of tmpl) {
      builder.push(...[it, props[index++]])
    }
    const result = builder.join('')
    const wrapper = this.wrapper
    return {
      url: wrapper.url ? (wrapper.url += result) : result
    }
  }

  name (): string {
    return 'join'
  }
}
