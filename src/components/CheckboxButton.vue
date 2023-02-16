<script lang="ts" setup>
import { Icons } from './Icons'

interface Props {
  enabled?: boolean
  title: string
}

interface Emits {
  (e: 'update:enabled', v: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <button
    class="checkbox-button"
    :class="{ 'checkbox-button-enabled': props.enabled }"
    @click="emit('update:enabled', !props.enabled)"
  >
    <div class="checkbox-button-status" />

    <div class="checkbox-button-title">
      {{ props.title }}
    </div>
  </button>
</template>

<style lang="scss" scoped>
.checkbox-button {
  display: inline-block;
  display: flex;
  flex-flow: row nowrap;
  background-color: var(--item-bg);
  padding: 8px;
  color: var(--white-faded);
  border-radius: 8px;
  @include focus-visible;
  position: relative;
  align-items: center;

  &-status {
    display: block;
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    border: 2px solid var(--content-bg);
    box-shadow: 0px 0px 0px 1px var(--white);
    border-radius: 3px;
    margin-right: 5px;
  }

  &-enabled {
    color: var(--white);
    background-color: var(--item-hover-bg);

    .checkbox-button-status {
      background-color: var(--white);
    }
  }

  &-title {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: currentColor;
  }

}
</style>
