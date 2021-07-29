import { Command } from '../types'
import { RequestWrapper } from '../types/core'

export default class JoinCommand implements Command {
  wrapper!: RequestWrapper

  /**
     * 入口
     * @param tmpl 字符串模版
     * @param props 参数
     */
  entrypoint (tmpl: TemplateStringsArray, ...props: string []): RequestWrapper {
    const builder = []
    for (const it of tmpl) {
      if (Array.isArray(it)) {
        builder.push(...it)
      } else {
        builder.push(it)
      }
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
