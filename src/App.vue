<script setup lang="ts">
import { exit } from '@tauri-apps/api/process'
import { disable as disableAutostart, enable as enableAutostart } from 'tauri-plugin-autostart-api'
import AppButton from './components/AppButton.vue'
import Countdown from './components/Countdown.vue'
import { Icons } from './components/Icons'
import CheckboxButton from './components/CheckboxButton.vue'
import { store } from './store'
import { AppStorage } from './storage'

function handleUpdateAutostart(value: boolean) {
  if (value)
    enableAutostart()
  else
    disableAutostart()

  store.autoStartApp = value
}

function handleToggle() {
  store.paused = !store.paused
  if (!store.paused)
    store.start()
}
</script>

<template>
  <div class="chevron">
    <img
      src="/src/assets/img/chevron.png"
      height="20"
    >
  </div>
  <main id="main">
    <div class="header">
      <CheckboxButton
        :enabled="AppStorage.get('soundsEnabled')"
        title="Sounds"
        @update:enabled="value => AppStorage.set('soundsEnabled', value)"
      />
      <CheckboxButton
        :enabled="store.autoStartApp"
        title="Autostart App"
        @update:enabled="handleUpdateAutostart"
      />
    </div>
    <div class="content">
      <Countdown
        :phase="store.phase"
        :seconds="store.remainingSeconds"
      />
    </div>

    <div class="footer">
      <div class="footer-left">
        <AppButton
          square
          paddingless
          title="Pause/Resume"
          @click="handleToggle"
        >
          <Icons.Play v-if="store.paused" />
          <Icons.Pause v-else />
        </AppButton>

        <AppButton
          square
          paddingless
          title="Restart"
          @click="store.reset"
        >
          <Icons.Reload />
        </AppButton>
      </div>

      <div class="footer-right">
        <AppButton
          title="Exit app"
          style="flex-shrink: 0"
          square
          paddingless
          @click="exit(0)"
        >
          <Icons.Power />
        </AppButton>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.chevron {
  height: 20px;
  flex-shrink: 1;
  position: absolute;
  z-index: 1000;
  left: 0;
  top: 0;
  text-align: center;
  width: 100%;
}

#main {
  margin-top: 19px;
  flex-shrink: 0;
  width: 100%;
  height: var(--app-height);
  background-color: var(--content-bg);
  border: 1px solid var(--app-border);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-flow: column nowrap;

  .content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-end;

    * + * {
      margin-left: 5px;
    }
  }

  .footer {
    flex-grow: 0;
    flex-shrink: 1;
    display: flex;
    width: 100%;
    flex-flow: row nowrap;

    &-left,
    &-right {
      * + * {
        margin-left: 5px;
      }
    }

    &-right {
      margin-left: auto;
      display: flex;
      flex-flow: row nowrap;
    }
  }
}
</style>
