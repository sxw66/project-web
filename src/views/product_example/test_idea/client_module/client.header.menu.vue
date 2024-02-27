<template>
  <div class="tb-header">
    <el-button text size="small" :icon="Operation" @click="dialogVisible = true"
      >设置类别</el-button
    >
    <el-dialog v-model="dialogVisible" title="添加至类别" width="30%">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
        <el-form-item label="类别" prop="moduleId">
          <el-tree-select
            style="width: 100%"
            v-model="ruleForm.moduleId"
            :data="categoryOptions"
            filterable
            :render-after-expand="false"
            @node-click="handeNodeClick"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-button text size="small" :icon="Delete" @click="handleDelete">删除</el-button>
  </div>
</template>

<script setup lang="ts">
  // 在子组件内处理数据交互
  import { ref, reactive, onMounted, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ArrowDown, Search, Delete, Operation, Plus } from '@element-plus/icons-vue'
  import { delCustomerPages, updateCustomerPages } from '@/api/modules/product'
  import { useProductStore } from '@/store/modules/product'

  // 接收父组件传递的参数
  let props = defineProps({
    multipleIds: {
      type: Array,
      default: () => [],
    },
    TypeList: {
      type: Array,
      default: () => [],
    },
  })
  // 分发事件给父组件
  const emit = defineEmits(['handeDeleteSuccess', 'handeCategorySettingSuccess'])

  const ProductStore = useProductStore()
  const ruleFormRef = ref(null)
  const dialogVisible = ref(false)
  // 类别
  const categoryOptions = ref([])

  const ruleForm = reactive({
    id: '',
    productId: ProductStore.productId,
    moduleId: '',
    moduleName: '',
  })

  const rules = reactive({
    moduleId: [
      {
        required: true,
        message: '类别不能为空',
        trigger: 'change',
      },
    ],
  })
  // 选择类别
  const handeNodeClick = (rows: unknown) => {
    ruleForm.moduleName = rows.label
  }
  // 类别提交
  const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    try {
      await formEl.validate()
      const allIds = props.multipleIds.map((item) => item.id)
      ruleForm.id = allIds.join(',')
      const { code, data } = await updateCustomerPages(ruleForm)
      if (code === 200 && data) {
        ElMessage({
          type: 'success',
          message: '更新成功',
        })
        dialogVisible.value = false
        emit('handeCategorySettingSuccess', data)
      }
    } catch (error) {
      console.log('error submit!', error.fields)
    }
  }

  // 删除
  const handleDelete = () => {
    if (props.multipleIds.length > 0) {
      const message =
        props.multipleIds.length > 1
          ? `确认删除选择的 <span class="custom-highlight">${props.multipleIds.length}</span> 个客户吗?`
          : `确认删除选择的 <span class="custom-highlight">${props.multipleIds[0].customerName}</span> 个客户吗?`
      const additionalMessage = `<p> 删除客户将同时删除客户中的用户，删除后将无法在此产品中提交工单，历史数据依然保留。</p>`
      ElMessageBox.confirm(`${message}<br>${additionalMessage}`, '确认删除', {
        confirmButtonText: '确定',
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
  // 使用递归的方式来处理这种数据格式，将原始数据转换为所需的格式。
  const processData = (data) => {
    const processedData = []
    data.forEach((item) => {
      const processedItem = {
        value: item.id,
        label: item.moduleName,
        children: [],
      }
      if (item.subList && item.subList.length > 0) {
        processedItem.children = processData(item.subList)
      }
      processedData.push(processedItem)
    })
    return processedData
  }

  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  watchEffect(() => {
    if (props.TypeList.length) {
      categoryOptions.value = processData(props.TypeList)
    }
  })
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
  }
</style>
<style scoped lang="scss">
  .tb-header {
    display: flex;
    align-items: center;
  }
  .seacrh-dropdown {
    max-height: 280px;
    min-height: 60px;
    overflow-y: auto;
  }
</style>
