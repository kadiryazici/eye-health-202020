import { Store } from 'tauri-plugin-store-api'
import { shallowReactive } from 'vue'

export interface StorageContext {
  soundsEnabled: boolean
}

const store = new Store('.storage.dat')
const storage = shallowReactive<StorageContext>({
  soundsEnabled: true,
})

export const AppStorage = {
  /**
   * Reads from storage, can be used inside computed for reactivity
   */
  get<T extends keyof StorageContext>(key: T): StorageContext[T] {
    return storage[key]
  },

  /**
   * Writes to storage and in next event loop, caches to disk
   */
  set<T extends keyof StorageContext>(key: T, value: StorageContext[T]) {
    if (value === storage[key])
      return

    storage[key] = value
    store.set(key, value).then(() => store.save())
  },
}

/**
 * Reads storage from disk and saves values to app cache.
 */
export async function cacheStorageFromDisk() {
  const values = Object.fromEntries(await store.entries())

  for (const key of Object.keys(storage)) {
    const value = values[key]

    if (value != null)
      // @ts-expect-error Type issue
      storage[key] = value
  }
}
