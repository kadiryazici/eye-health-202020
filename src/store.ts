import { shallowReactive } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'
import { InvokeCommand } from './constants'

const lookingScreenDuration = 1200
const lookingAwayDuration = 20

export enum Phase {
  LookingAtScreen,
  LookingAway,
}

export interface Store {
  timer: null | number
  remainingSeconds: number
  phase: Phase
  paused: boolean
  autoStartApp: boolean
  start: () => void
  reset: () => void
}

export const store = shallowReactive<Store>({
  timer: null,
  remainingSeconds: lookingScreenDuration,
  phase: Phase.LookingAtScreen,
  paused: true,
  autoStartApp: false,
  start,
  reset,
})

function start() {
  if (store.timer) {
    store.paused = false
    return
  }

  store.timer = window.setInterval(() => {
    if (store.paused)
      return

    if (store.remainingSeconds === 3 && store.phase === Phase.LookingAtScreen) {
      invoke(InvokeCommand.PlayCountdownSound)
      appWindow.show()
    }

    if (store.remainingSeconds === 0) {
      if (store.phase === Phase.LookingAtScreen) {
        store.remainingSeconds = lookingAwayDuration
        store.phase = Phase.LookingAway
      }
      else {
        invoke(InvokeCommand.PlaySuccessSound)
        store.remainingSeconds = lookingScreenDuration
        store.phase = Phase.LookingAtScreen
        appWindow.hide()
      }

      return
    }

    store.remainingSeconds--
  }, 1000)
}

function reset() {
  store.paused = false
  store.remainingSeconds = lookingScreenDuration
  store.phase = Phase.LookingAtScreen
}
