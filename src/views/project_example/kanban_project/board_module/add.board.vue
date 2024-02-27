<template>
  <!-- 新建看板 -->
  <el-dialog
    v-model="props.boardAddVisible"
    v-if="props.boardAddVisible"
    title="新建看板"
    :before-close="handleCancel"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      label-position="top"
      class="board-ruleForm"
      size="large"
      status-icon
    >
      <el-form-item label="看板名称" prop="kanbanName">
        <el-input
          v-model="ruleForm.kanbanName"
          placeholder="请输入看板名称"
          maxlength="32"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useProjectStore } from '@/store/modules/project'
  import { updateProductKanBan, addProductKanBan } from '@/api/modules/project.ts'
  // 表格列表-等级-行业
  import { WorkItemType, industryOptions } from '@/utils/public-data'

  const ProjectStore = useProjectStore()

  // 接收父组件传递的参数
  const props = defineProps({
    boardAddVisible: Boolean,
    // EditFormData: Object,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeBoard'])

  interface RuleForm {
    id: string
    kanbanName: string
    cardColumns: string
  }
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    // id: ProjectStore.projectId,
    id: '',
    kanbanName: '',
    cardColumns: '',
  })

  const rules = reactive<FormRules<RuleForm>>({
    kanbanName: [
      { required: true, message: '请输入计划名称', trigger: 'blur' },
      { min: 1, max: 30, message: '长度在3到30位', trigger: 'blur' },
    ],
  })

  //  提交计划
  const submitForm = async () => {
    try {
      const valid = await ruleFormRef.value?.validate()
      if (!valid) {
        return
      }
      const formValue = ruleForm
      const { code, data } = formValue.id
        ? await updateProductKanBan(formValue)
        : await addProductKanBan(formValue)
      if (code === 200 && data) {
        const message = formValue.id ? '编辑成功' : '新增成功'
        ElMessage.success({
          showClose: true,
          message: message,
        })
        ruleFormRef.value.resetFields()
        emits('closeBoard', data)
      }
    } catch (error) {
      console.log('error submit!')
    }
  }

  // 关闭-取消
  const handleCancel = () => {
    ruleFormRef.value.resetFields()
    emits('closeBoard', '')
  }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  // watchEffect(() => {
  //   if (props.EditFormData) {
  //     ruleForm.id = props.EditFormData.id
  //     ruleForm.kanbanName = props.EditFormData.kanbanName
  //   }
  // })
  //   onMounted(() => {})
</script>

<style lang="scss" scoped>
  .prefix-icon {
    border-style: dashed;
    color: #cacaca;
    border-color: #cacaca;
    border-width: 1px;
    border-radius: 50%;
    line-height: 1;
  }
</style>
