interface CacheEntry<T> {
  value: T
  expiresAt: number
}

// Single-instance, in-memory TTL cache. Fine as long as the backend runs as one process on the VPS -
// swap for something shared (e.g. Redis) if it's ever scaled out.
export class TtlCache<T> {
  private readonly store = new Map<string, CacheEntry<T>>()

  constructor(private readonly ttlMs: number) {}

  get(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (entry.expiresAt < Date.now()) {
      this.store.delete(key)
      return undefined
    }

    return entry.value
  }

  set(key: string, value: T): void {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs })
  }
}
