/**
 * Extend the type of proxy instructions,
 * and can flexibly expand different functional instructions based on callbacks
 */
import { RequestWrapper } from '../core'

type Command = {
    field?: any
    wrapper: RequestWrapper
    /**
     * Command name
     */
    entrypoint: (...props: any) => RequestWrapper
    /**
     * install command
     */
    name (): string
}

/**
 * extend static instructions
 */
interface StaticCommandSupport {
    use(cmd: Command): void
    remove(entryPoint: string): void
    remove(cmd: Command): void
}

export {
  Command,
  StaticCommandSupport
}
