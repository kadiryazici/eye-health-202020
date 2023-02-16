<script lang="ts" setup>
interface Props {
  paddingless?: boolean
  square?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  paddingless: false,
  square: false,
})
</script>

<template>
  <button
    class="button"
    :class="{
      'button-paddingless': paddingless,
      'button-square': square,
    }"
  >
    <div class="button-content">
      <slot />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.button {
  height: 35px;
  font-size: 14px;
  padding: 8px 12px;
  border: 1px solid var(--item-border-color);
  background-color: var(--item-bg);
  position: relative;
  overflow: hidden;
  color: var(--white);
  border-radius: 8px;
  @include focus-visible;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &-paddingless, &-square {
    padding: 0px;
  }

  &-square {
    display: inline-flex;
    height: 35px;
    width: 35px;
    align-items: center;
    justify-content: center;
  }

  &:active {
    background-color: var(--item-hover-bg);
  }
}
</style>
