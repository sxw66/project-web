<template>
  <div class="m-screenful">
    <svg-icon
      :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="toggle"
      class="full-screen"
      size="18"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useFullscreen } from '@vueuse/core'
  const { toggle, isFullscreen } = useFullscreen()
</script>

<style lang="scss" scoped>
  .m-screenful {
    display: flex;
    align-items: center;
    padding-right: 0;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  .transverseMenu {
    .full-screen {
      color: white;
    }
  }
</style>
