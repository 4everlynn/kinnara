
/**
 * Resolve Circular JSON
 * and format it
 */
export class CircularFormat {
    private cache: Map<any, any> = new Map<any, any>()

    /**
     * format circular structure object to json
     * deal circular as $ref[key@hierarchy]
     * @param target circular or not circular
     */
    format (target: object): string {
      let hierarchy = 0
      const json = JSON.stringify(target, (key, value) => {
        const current = hierarchy++
        if (typeof value === 'object' && value !== null) {
          if (this.cache.has(value)) {
            try {
              return JSON.parse(JSON.stringify(value))
            } catch (err) {
              if (value === target) {
                return '$self'
              }
              return `$ref[${this.cache.get(value)}]}`
            }
          }
          this.cache.set(value, `${key}@${current}`)
        }
        return value
      }, 2)
      // clear cache
      this.cache.clear()
      return json
    }
}
