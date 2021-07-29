/**************************************************************************
 *  SUPPORT-LOGGING - VERSION 1.0
 *  FOR FLUENT_MYSTRACE_PLUGIN
 *  If it is not necessary, we do not recommend
 *  to modify this file, it will take effect globally,
 *  and it will replace the original function of the console
 *  and export a log instance object for operation.
 *  We designed five levels of logs such as debug, info, warn, error, and fatal
 *  according to the specification.
 *  @group hydrajs
 *  @author 4evelynn
 *  @maintainer 4everlynn
 *  @create 2020/11/06
 ***************************************************************************/

/**
 * 日志操作的接口
 */
interface Logging {
    /**
     * 输出 debug 级别的 log
     */
    debug(format: string, ...args: any []): void

    /**
     * 输出 info 级别的 log
     */
    info(format: string, ...args: any []): void

    /**
     * 输出 warn 级别的 log
     */
    warn(format: string, ...args: any []): void

    /**
     * 输出 error 级别的 log
     */
    error(format: string, ...args: any []): void

    /**
     * 输出 fatal 级别的 log
     */
    fatal(format: string, ...args: any []): void

    /**
     * 是否启用 log
     */
    enable(trigger: boolean): void

    /**
     * 启用日志的级别
     */
    level(level: 'DEBUG' | 'debug' | 'INFO' | 'info' | 'WARN' | 'warn' | 'ERROR' | 'error' | 'FATAL' | 'fatal'): void
}

/**
 * 将对象的 key 转为 css3 风格的字符串
 */
const obj2Style = (obj: any) => {
  const lowerCase2Line = (key: string) => {
    const buffer = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < key.length; i++) {
      if (/[A-Z]/.test(`${key[i]}`)) {
        buffer.push('-')
        buffer.push(`${key[i]}`.toLowerCase())
      } else {
        buffer.push(key[i])
      }
    }
    return buffer.join('')
  }
  const builder = []
  for (const key of Object.keys(obj)) {
    builder.push(`${lowerCase2Line(key)}: ${obj[key]}`)
  }

  return builder.join(';')
}

/**
 * 描述日志的颜色
 */
interface LogStyle {
    base: object,

    extends(style: object): LogStyle

    style(): string

    overwrite(style: object): LogStyle
}

class SmartLogStyle implements LogStyle {
    base: object

    constructor (base?: object) {
      this.base = Object.assign({
        color: 'white',
        fontWeight: 'bold',
        padding: '2px 5px',
        margin: '6px 0'
      }, base)
    }

    extends (style: object): LogStyle {
      return new SmartLogStyle(style)
    }

    style () {
      return obj2Style(this.base)
    }

    overwrite (style: object): LogStyle {
      const logStyle = new SmartLogStyle(style)
      logStyle.base = style
      return logStyle
    }
}

const LOG_MSG_STYLE = {
  background: 'transparent',
  color: 'black'
}

const baseStyle = new SmartLogStyle()

class SmartLogging implements Logging {
    /**
     * 是否启用日志
     * @private
     */
    private _isEnable: boolean
    /**
     * 启用的日志级别
     * @private
     */
    private _activeLevel: string
    /**
     * 映射日志级别
     */
    private _mapLevel: any = {
      DEBUG: 4,
      INFO: 3,
      WARN: 2,
      ERROR: 1,
      FATAL: 0
    }

    constructor () {
      // 默认为 INFO 级别
      this._activeLevel = 'INFO'
      // 默认启用
      this._isEnable = true
    }

    /**
     * 当前是否允许打印
     */
    _cloudLogging (level: string) {
      if (!this._isEnable) {
        return false
      }
      return this._mapLevel[level] <= this._mapLevel[this._activeLevel]
    }

    info (format: string, ...args: any[]): void {
      if (!this._cloudLogging('INFO')) {
        return
      }

      console.log('%c INFO %c '.concat(format),
        baseStyle.extends({ background: '#17acff', borderRadius: '3px' }).style(),
        baseStyle.overwrite({ ...LOG_MSG_STYLE, color: '#17acff' }).style(),
        ...args)
    }

    debug (format: string, ...args: any[]): void {
      if (!this._cloudLogging('DEBUG')) {
        return
      }

      console.log('%c DEBUG %c '.concat(format),
        baseStyle.extends({ background: '#05c3af', borderRadius: '3px' }).style(),
        baseStyle.overwrite({ ...LOG_MSG_STYLE, color: '#05c3af' }).style(),
        ...args)
    }

    error (format: string, ...args: any[]): void {
      if (!this._cloudLogging('ERROR')) {
        return
      }

      console.log('%c ERROR %c '.concat(format),
        baseStyle.extends({ background: '#ff1745', borderRadius: '3px' }).style(),
        baseStyle.overwrite({ ...LOG_MSG_STYLE, color: '#ff1745' }).style(),
        ...args)
    }

    fatal (format: string, ...args: any[]): void {
      if (!this._cloudLogging('FATAL')) {
        return
      }

      console.trace('%c FATAL %c '.concat(format),
        baseStyle.extends({ background: '#ff17c5', borderRadius: '3px' }).style(),
        baseStyle.overwrite({ ...LOG_MSG_STYLE, color: '#ff17c5' }).style(),
        ...args)
    }

    warn (format: string, ...args: any[]): void {
      if (!this._cloudLogging('WARN')) {
        return
      }

      console.log('%c WARN %c '.concat(format),
        baseStyle.extends({ background: '#ff9717', borderRadius: '3px' }).style(),
        baseStyle.overwrite({ ...LOG_MSG_STYLE, color: '#ff9717' }).style(),
        ...args)
    }

    enable (trigger: boolean): void {
      this._isEnable = trigger
    }

    level (level: 'DEBUG' | 'debug' | 'INFO' | 'info' | 'WARN' | 'warn' | 'ERROR' | 'error' | 'FATAL' | 'fatal'): void {
      this._activeLevel = level.toUpperCase()
    }
}

const log = new SmartLogging()
export default log
