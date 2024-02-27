<template>
  <div class="flex members-box">
    <!--产品管理列表 【回收站】 -->
    <div class="left">
      <div class="bin-title">产品设置</div>
      <nav-list :steps="steps" :selectedIndex="0" @selected="handeSelected" />
    </div>
    <div class="right">
      <h1>{{ selectedName }}</h1>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  const selectedName: any = ref('产品成员')
  const steps = [
    {
      title: '通用',
      name: '产品成员',
    },
    {
      name: '标签管理',
    },
    {
      name: '自动化规则',
    },
    {
      name: '回收站',
    },
    {
      title: '产品',
      name: '产品组件',
    },
    {
      name: '工单类型',
    },
    {
      name: '渠道设置',
    },
    {
      name: '渠道设置',
    },
    {
      title: '需求',
      name: '竞品',
    },
    {
      title: '设置',
      name: '基本信息',
    },
    {
      name: '高级设置',
    },
  ]
  // 侧边菜单列表选择的数据
  const handeSelected = (items: any) => {
    console.log('侧边菜单列表选择的数据', items)
    selectedName.value = items.name
  }
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .members-box {
    height: calc(100vh - 120px);

    .left {
      width: 240px;
      background-color: #fbfbfb;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      overflow-y: auto;
      .bin-title {
        color: #333;
        font-size: 15px;
        padding: 0 20px;
        min-height: 48px;
        align-items: center;
        display: flex;
        border-bottom: 1px solid #eee;
      }
    }

    .right {
      width: 100%;
      background: #fff;
    }
  }
</style>
