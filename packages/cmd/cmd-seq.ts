import { Command, RequestWrapper } from '../types'
import { Kinnara } from '..'

/**
 * 指令序列，用于包装多个指令的集合操作
 */
export default class SequenceCommand implements Command {
  wrapper!: RequestWrapper

  entrypoint (seq: (chain: any) => void): RequestWrapper {
    const commands = Kinnara._cmd
    let wrapper = this.wrapper
    const proxy = new Proxy(commands, {
      get (target: any, cmd: string | symbol): any {
        const command = target[cmd]
        if (command && command.entrypoint) {
          // 注入根请求对象
          command.wrapper = wrapper
          // 设置入口点装饰器
          command.bin = (...props: any) => {
            wrapper = Object.assign(wrapper, command.entrypoint(...props))
          }
          // 返回执行入口
          return command.bin
        }
      }
    })
    seq && seq(proxy)
    return wrapper
  }

  name (): string {
    return 'seq'
  }
}
