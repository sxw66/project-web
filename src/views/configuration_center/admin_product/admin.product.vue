<template>
  <!-- 产品-标签管理 -->
  <div class="flex admin-product">
    <div class="left">
      <nav-list :steps="steps" @selected="handeSelected" />
    </div>
    <div class="right">
      <TbLabelManagement v-if="selectedName === '标签管理'" />
      <TbWorkItem v-if="selectedName === '工作项配置'" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineAsyncComponent, nextTick } from 'vue'
  // 标签管理
  import TbLabelManagement from './label_management/label.management.vue'
  // 工作项配置
  import TbWorkItem from './work_item/work.item.vue'

  const selectedName: any = ref('项目管理')

  const steps = ref([
    {
      title: '通用',
      name: '项目管理',
    },
    {
      name: '项目集管理',
    },
    {
      name: '标签管理',
    },
    {
      title: '流程',
      name: 'Scrum 项目',
    },
    {
      name: 'Kanban 项目',
    },
    {
      name: '瀑布项目',
    },
    {
      title: '配置',
      name: '工作项配置',
    },
    {
      name: '项目配置',
    },
    {
      name: '发布配置',
    },
    {
      title: '权限',
      name: '权限配置',
    },
  ])

  // 侧边菜单列表选择的数据
  const handeSelected = async (items: any) => {
    console.log('侧边菜单列表选择的数据', items)
    selectedName.value = items.name
  }

  onMounted(() => {})
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .admin-product {
    height: 100%;

    .left {
      min-width: 240px;
      background-color: #fbfbfb;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      overflow-y: auto;
    }

    .right {
      width: 100%;
      background: #fff;
      box-sizing: border-box;
      .el-tooltip__trigger {
        outline: none;
      }
      .filtrate-text {
        color: #999;
        margin-left: 15px;
      }
      .tb-head-product {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
