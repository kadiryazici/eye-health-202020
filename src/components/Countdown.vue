<script lang="ts" setup>
import { Phase } from '../store'

interface Props {
  seconds: number
  phase: Phase
}

const props = defineProps<Props>()

function secondsString() {
  const minutes = Math.floor(props.seconds / 60)
  const seconds = Math.floor(props.seconds % 60)

  const minutesText = minutes < 10 ? `0${minutes}` : minutes.toString()
  const secondsText = seconds < 10 ? `0${seconds}` : seconds.toString()

  return `${minutesText}:${secondsText}`
}
</script>

<template>
  <div class="countdown">
    <h5 class="count">
      {{ secondsString() }}
    </h5>
    <p
      v-if="phase === Phase.LookingAway"
      class="sub-text"
    >
      Look 20 feet (6 meters) away.
    </p>
  </div>
</template>

<style lang="scss" scoped>
.countdown {
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .count {
    margin: 0 auto;
    font-size: 35px;
  }

  .sub-text {
    font-size: 13px;
    margin-top: 15px;
  }
}
</style>
