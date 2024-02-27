<template>
  <div class="tb-header">
    <el-input
      :prefix-icon="Search"
      v-model="boardInput"
      placeholder="搜索（Ctrl+G）"
      class="inputDeep"
      @change="handeBoardInput"
      clearable
    >
    </el-input>
    <el-popover placement="bottom" title="搜索范围" :width="200" trigger="click">
      <template #reference>
        <el-button link type="primary" :icon="ArrowDown"></el-button>
      </template>
      <div class="flex-justify-between">
        <div> 编号 </div>
        <el-switch v-model="numberShow" :disabled="headlineShow" @change="handeBoardSwitch" />
      </div>
      <div class="flex-justify-between">
        <div> 标题 </div>
        <el-switch v-model="headlineShow" :disabled="numberShow" @change="handeBoardSwitch" />
      </div>
    </el-popover>
    <el-divider direction="vertical" />
  </div>
</template>

<script setup lang="ts">
  // 在子组件内处理数据交互
  import { ref, reactive, onMounted } from 'vue'
  import { ArrowDown, Search, Check, Plus } from '@element-plus/icons-vue'
  import { useProjectStore } from '@/store/modules/project'

  // 接收父组件传递的参数
  let props = defineProps({
    multipleIds: {
      type: Array,
      default: () => [],
    },
  })

  const ProjectStore = useProjectStore()
  const boardInput = ref() // 当前的看板搜素
  const numberShow = ref(true) // 编号
  const headlineShow = ref(false) // 标题

  // 开关切换
  const handeBoardSwitch = () => {
    if (numberShow.value) {
      ProjectStore.projectGather.searchState = 1
    } else if (headlineShow.value) {
      ProjectStore.projectGather.searchState = 2
    }
  }

  // 输入框
  const handeBoardInput = (val) => {
    ProjectStore.projectGather.kanbanInputModel = val
  }

</script>

<style scoped lang="scss">
  .tb-header {
    display: flex;
    align-items: center;

    .inputDeep {
      :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 0px var(--el-input-border-color, var(--el-border-color)) inset;
        cursor: default;
        .el-input__inner {
          cursor: default !important;
        }
      }
    }
  }
</style>
