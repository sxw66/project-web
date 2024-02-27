<template>
  <div class="layout-left-header">
    <svg-icon class="layout-header-icon" name="home-page" size="20" color="rgb(102, 152, 255)" />
    <span class="layout-header-title">{{ matched[0].meta.title }}</span>
  </div>
  <CustomTabs v-if="shouldShowTabs" :tabs="displayedTabs" style="margin-left: 60px" />
  <!-- 首页面包屑不要可以直接删除 🙅‍♀️ -->
  <!-- <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group>
      <el-breadcrumb-item :to="{ path: '/' }" key="home" v-if="matched[0].meta.title !== '首页'">
        <div class="breadcrumb-item">
          <span class="breadcrumb-title">首页</span>
        </div>
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in matched" :key="item.name">
        <span
          v-if="item.redirect === 'noRedirect' || index == matched.length - 1"
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb> -->
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted, watchEffect } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import CustomTabs from './CustomTabs.vue'
  import { useProjectStore } from '@/store/modules/project'

  const route = useRoute()
  const router = useRouter()
  const ProjectStore = useProjectStore()
  const advanceTabsList = ref([])

  const handleLink = (item) => {
    router.push({
      path: item.path,
    })
  }

  const matched = computed(() =>
    route.matched.filter((item) => item.meta && item.meta.title && item.meta.breadcrumb !== false),
  )
  // 过滤出符合的tabs数组
  const tabsList = computed(() => {
    return route.matched.reduce((result: any, item: any) => {
      if (item.meta && item.meta.tabs) {
        result.push(...item.meta.tabs)
      }
      return result
    }, [])
  })
  // 创建计算属性用于计算 shouldShowTabs 的值
  const shouldShowTabs = computed(() => {
    if (!hasShowRoute.value) {
      return false
    }
    return tabsList.value.length || advanceTabsList.value.length
  })

  // 创建计算属性用于计算 displayedTabs 的值
  const displayedTabs = computed(() => {
    return tabsList.value.length ? tabsList.value : advanceTabsList.value
  })
  // 过滤出路由中满足条件的Tab路由
  const hasShowRoute = computed(() => {
    const matched = route.matched
    return matched.some((record) => record.meta && record.meta.showTab === true)
  })

  watchEffect(() => {
    if (ProjectStore.projectTabs.length) {
      const normalArray = Object.values(ProjectStore.projectTabs).map((obj) => {
        const { name, url } = obj
        return { name, url }
      })
      advanceTabsList.value = normalArray
    }
  })

  onMounted(() => {
    const normalArray = Object.values(ProjectStore.projectTabs).map((obj) => {
      const { name, url } = obj
      return { name, url }
    })
    advanceTabsList.value = normalArray
  })

  console.log('======matched=======', tabsList.value)
</script>
<style lang="scss" scoped>
  .layout-left-header {
    min-width: 60px;
    display: flex;
    align-items: center;
    .layout-header-icon {
      margin-right: 8px;
    }
    .layout-header-title {
      font-size: 18px;
    }
  }
</style>
