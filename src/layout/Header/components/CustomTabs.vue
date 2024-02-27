<template>
  <div class="custom-tabs">
    <div
      class="custom-items"
      v-for="(tab, index) in tabs"
      :key="index"
      :class="{ active: activeIndex === index }"
      @click="handleTabClick(index)"
    >
      {{ tab.name }}
    </div>
  </div>
</template>

<script lang="ts">
  // 头部tabs 组件
  import { defineComponent, ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  interface Tab {
    name: string
    url: string
  }

  export default defineComponent({
    name: 'CustomTabs',
    props: {
      tabs: {
        type: Array as () => Tab[],
        required: true,
      },
    },
    setup(props) {
      const route = useRoute()
      const router = useRouter()
      const activeIndex: any = ref(0)

      const handleTabClick = (index: number) => {
        activeIndex.value = index
        localStorage.setItem('activeIndex', activeIndex.value)
        // console.log(' activeIndex.value', activeIndex.value)
        // console.log(' props.tabs', props.tabs)
        // console.log(' props.tabs[index]', props.tabs[index])
        // console.log(' props.tabs.length', props.tabs.length)
        if (props.tabs[index]) {
          router.push(props.tabs[index]?.url)
        } else {
          localStorage.setItem('activeIndex', 0)
          activeIndex.value = 0
          router.push(props.tabs[0].url)
        }
      }

      watch(
        () => router.currentRoute.value.path,
        (newPath) => {
          // console.log('newPath', newPath)
          const tabIndex = props.tabs.findIndex((tab) => tab.url === newPath)
          if (tabIndex !== -1) {
            activeIndex.value = tabIndex
          }
        },
      )
      // watch(route, (to, from) => {
      //   console.log('route', route)
      //   const tabIndex = props.tabs.findIndex((tab) => {
      //     console.log('tab.url', tab.url)
      //     console.log('to.name', to.name)
      //     tab.url == to.name
      //   })
      //   console.log('tabIndex', tabIndex)
      //   if (tabIndex !== -1) {
      //     activeIndex.value = tabIndex
      //   }
      // })

      onMounted(() => {
        const savedIndex = JSON.parse(localStorage.getItem('activeIndex'))
        if (savedIndex !== null) {
          activeIndex.value = savedIndex
          // 页面刷新时判断是几级路由如果是三级则刷新三级路由页面，否则刷新tab页面
          const isTab = props.tabs.findIndex((tab) => tab.url === router.currentRoute.value.path)
          if (isTab != -1) {
            handleTabClick(savedIndex)
          }
        }
      })

      return {
        activeIndex,
        handleTabClick,
      }
    },
  })
</script>

<style lang="scss" scoped>
  .custom-tabs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* height: 40px; */
    overflow-x: auto;
    overflow-y: hidden;
    box-sizing: border-box;
    .custom-items {
      padding: 14px;
      cursor: pointer;
      margin-right: 20px;
      white-space: nowrap;
      box-sizing: border-box;
    }
  }

  .custom-tabs > .active {
    color: #1890ff;
    border-bottom: 2px solid #1890ff;
  }
</style>
