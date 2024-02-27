<template>
  <div class="schedule-edit-table-hd">
    <el-button text size="small" :icon="Delete" @click="handleDelete">移除</el-button>
  </div>
</template>

<script setup lang="ts">
  // 在子组件内处理数据交互
  import { ref, reactive, onMounted, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ArrowDown, Search, Delete, Operation, Plus } from '@element-plus/icons-vue'
  import { delCustomerPages, updateCustomerPages } from '@/api/modules/product'

  // 接收父组件传递的参数
  let props = defineProps({
    multipleIds: {
      type: Array,
      default: () => [],
    },
  })
  // 分发事件给父组件
  const emit = defineEmits(['handeDeleteSuccess'])

  // 删除
  const handleDelete = () => {
    if (props.multipleIds.length > 0) {
      const message =
        props.multipleIds.length > 1
          ? `确认移除选择的 <span class="custom-highlight">${props.multipleIds.length}</span> 个需求吗?`
          : `确认移除需求 <span class="custom-highlight">${props.multipleIds[0].principalName}</span>吗?`
      const additionalMessage = `<p> 移除后可重新选择需求。</p>`
      ElMessageBox.confirm(`${message}<br>${additionalMessage}`, '确认删除', {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirmBtnClass',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: true,
        customClass: 'messageStyle',
      }).then(async () => {
        const allIds = props.multipleIds.map((item) => item.id)
        const result = await delCustomerPages(allIds)
        if (result.code === 200 && result.data) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          emit('handeDeleteSuccess', true)
        }
      })
    }
  }

  onMounted(() => {
    console.log('multipleIds', props.multipleIds)
  })
</script>

<style lang="scss">
  .messageStyle {
    .custom-highlight {
      color: #ff7575;
      background-color: #ff757526;
      padding: 0 10px;
      border-radius: 3px;
    }
    .confirmBtnClass {
      color: #fff;
      background-color: #ff7575;
      border-color: #ff7575;
    }
  }
</style>
<style scoped lang="scss">
  .schedule.edit.table.hd {
    display: flex;
    align-items: center;
  }
</style>
