import { Command } from '../types'
import { RequestWrapper } from '../types/core'

export default class OperationCommand implements Command {
  entrypoint (cmd: Command []): RequestWrapper {
    let builder = this.wrapper
    for (const it of cmd) {
      builder = Object.assign(builder, it.entrypoint())
    }
    return builder
  }

    wrapper!: RequestWrapper

    name (): string {
      return 'operation'
    }
}
