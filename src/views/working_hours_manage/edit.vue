<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const Router = useRouter()
  const selectedName: any = ref('视图')
  const steps = [
    {
      title: '视图',
      name: '全部工单',
      icon: 'sidebar-menu',
    },
    {
      name: '待计划的工单',
      icon: 'sidebar-menu',
    },
    {
      name: '进行中的工单',
      icon: 'sidebar-menu',
    },
    {
      name: '我负责的工单',
      icon: 'sidebar-menu',
    },
    {
      name: '我提交的工单',
      icon: 'sidebar-menu',
    },
  ]
  // 侧边菜单列表选择的数据
  const handeSelected = (items: any) => {
    console.log('侧边菜单列表选择的数据', items)
    selectedName.value = items.name
  }
</script>

<template>
  <div class="app-container">
    <div class="flex test-box">
      <div class="left">
        <nav-list :steps="steps" :selectedIndex="steps.length - 1" @selected="handeSelected" />
      </div>
      <div class="right">
        <h1>示例产品</h1>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .test-box {
    height: 100%;

    .left {
      width: 240px;
      background-color: #fbfbfb;
    }

    .right {
    }
  }
</style>
