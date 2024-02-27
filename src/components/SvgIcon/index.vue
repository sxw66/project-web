<template>
  <svg :class="svgClass" v-bind="$attrs" :style="iconStyle">
    <use :xlink:href="iconName"></use>
  </svg>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  const props = defineProps({
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: [Number, String],
      // default: 16,
    },
    right: {
      type: [Number, String],
    },
    left: {
      type: [Number, String],
    },
  })
  const iconName = computed(() => `#icon-${props.name}`)
  const svgClass = computed(() => {
    if (props.name) return `svg-icon icon-${props.name}`
    return 'svg-icon'
  })
  const iconStyle = computed(() => {
    const { size, color, right, left } = props
    let style: any = {}
    if (size) {
      style.width = style.height = style.lineHeight = `${size}px`
    }
    if (color) {
      style.color = color
    }
    if (right) {
      style.marginRight = right
    }
    if (left) {
      style.marginLeft = left
    }
    return style
  })
</script>
<style scoped lang="scss">
  .svg-icon {
    width: 1.3em;
    height: 1.3em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    cursor: pointer;
  }
</style>
