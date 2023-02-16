import './assets/main.scss'
import 'focus-visible'

import { createApp } from 'vue'
import { isEnabled as isAutostartEnabled } from 'tauri-plugin-autostart-api'
import App from './App.vue'
import { store } from './store'
import { cacheStorageFromDisk } from './storage'

(async () => {
  window.addEventListener('contextmenu', e => e.preventDefault())
  await cacheStorageFromDisk()
  store.autoStartApp = await isAutostartEnabled()

  if (store.autoStartApp)
    store.paused = false

  store.start()

  const app = createApp(App)
  app.mount('#app')
})()
