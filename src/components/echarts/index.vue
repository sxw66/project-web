<!-- eslint-disable vue/multi-word-component-names -->
<!-- echarts图表 -->
<template>
  <div ref="RefCompEcharts" class="comp-echarts_container"></div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts'
  import {
    defineComponent,
    ref,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
    onUnmounted,
    computed,
  } from 'vue'
  //   import { useSettingStore } from '@/store/modules/setting'
  import { set } from '@vueuse/core'

  interface Iprops {
    options: any
    onClick?: boolean
    onMouseover?: any
  }

  const props = withDefaults(defineProps<Iprops>(), {
    options: {},
    onClick: false,
    onMouseover: false,
  })

  const emit = defineEmits(['updateAxisPointer', 'echarts-loaded', 'on-click', 'on-mouseover'])

  //   const SettingStore = useSettingStore()

  //不能声明为响应式对象，否在在一些场景下会报错
  let EchartsObject: any = null
  const RefCompEcharts = ref()
  const options = computed(() => props.options)

  //   const isCollapse = computed(() => !SettingStore.isCollapse)

  watch(
    () => options.value,
    (val) => {
      if (!EchartsObject) {
        return
      }
      // 在更新时setOption传入第二个参数，解决eCharts默认更新是合并更新问题
      EchartsObject.setOption(val, { replaceMerge: ['series'] })
    },
    {
      deep: true,
    },
  )

  // 收起/展开菜单 对图表进行重新布局
  //   watch(
  //     () => isCollapse.value,
  //     (newV: boolean) => {
  //       setTimeout(() => {
  //         handleResize()
  //       }, 400)
  //     },
  //   )

  onMounted(() => {
    nextTick(() => {
      initEchart()
    })
  })
  onBeforeUnmount(() => {
    destroyEcharts()
  })

  onUnmounted(() => {
    // 移除监听事件
    window.removeEventListener('resize', () => {
      handleResize()
    })
  })

  const initEchart = async () => {
    if (!options.value) {
      console.error('初始化echarts失败！未传入echarts参数')
      return
    }

    EchartsObject = await echarts.init(RefCompEcharts.value)
    // 设置图表联动方法
    EchartsObject.on('updateAxisPointer', function (event: any) {
      emit('updateAxisPointer', event, EchartsObject)
    })

    // 在更新时setOption传入第二个参数，解决eCharts默认更新是合并更新问题
    EchartsObject.setOption(options.value, { replaceMerge: ['series'] })
    if (!EchartsObject) {
      return
    }

    handleWindowResize()
    setTimeout(() => {
      emit('echarts-loaded')
    }, 1000)

    if (props.onClick) {
      EchartsObject.on('click', (e: any) => {
        emit('on-click', e)
      })
    }
    if (props.onMouseover) {
      EchartsObject.on('mouseover', (e: any) => {
        emit('on-mouseover', e)
      })
    }
  }

  // 改变图表的大小
  const handleResize = () => {
    console.log(EchartsObject, 'EchartsObject====')
    EchartsObject?.resize()
  }

  const handleWindowResize = () => {
    let timer: any = 0
    window.addEventListener('resize', () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        handleResize()
      }, 100)
    })
  }

  const destroyEcharts = () => {
    if (!EchartsObject) {
      return
    }
    EchartsObject.dispose()
    EchartsObject = null
  }

  defineExpose({
    RefCompEcharts,
    handleResize,
  })
</script>

<style lang="scss" scoped>
  .comp-echarts_container {
    width: 100%;
    height: 100%;
  }
</style>
