import Kinnara from './core/kinnara'
import * as Commands from './cmd'

export * from './plugins'
export * from './types'
export * from './core'

// install default cmd
for (const Command of Object.values(Commands)) {
  Kinnara.use(Command)
}

export {
  Kinnara
}
