<template>
  <!-- 新建工作项配置 -->
  <el-dialog
    v-model="props.workItemAddVisible"
    v-if="props.workItemAddVisible"
    title="新建工作项配置"
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
      <el-form-item label="标签名称" prop="labelName">
        <el-input
          v-model="ruleForm.labelName"
          placeholder="请输入标签名称"
          maxlength="32"
          show-word-limit
        />
      </el-form-item>
      <el-form-item>
        <el-color-picker v-model="ruleForm.labelColor" :predefine="predefineColors" />
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
  import { ref, reactive, onMounted, computed, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useProjectStore } from '@/store/modules/project'
  import { updateItemLabelist, addItemLabelist } from '@/api/modules/project.ts'

  const ProjectStore = useProjectStore()

  // 接收父组件传递的参数
  const props = defineProps({
    workItemAddVisible: Boolean,
    EditFormData: Object,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeLabel'])

  interface RuleForm {
    id: string
    labelName: string
    labelColor: string
    creater: string
    createName: string
    isDel: number
    createTime: string
  }
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    // id: ProjectStore.projectId,
    id: '',
    labelName: '',
    labelColor: '#409EFF',
    creater: '',
    createName: '',
    isDel: 0,
    createTime: '',
  })

  const rules = reactive<FormRules<RuleForm>>({
    labelName: [
      { required: true, message: '请输入标签名称', trigger: 'blur' },
      { min: 1, max: 30, message: '长度在3到30位', trigger: 'blur' },
    ],
  })

  const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
  ])

  //  提交计划
  const submitForm = async () => {
    try {
      const valid = await ruleFormRef.value?.validate()
      if (!valid) {
        return
      }
      const formValue = ruleForm
      const { code, data } = formValue.id
        ? await updateItemLabelist(formValue)
        : await addItemLabelist(formValue)
      if (code === 200 && data) {
        const message = formValue.id ? '编辑成功' : '新增成功'
        ElMessage.success({
          showClose: true,
          message: message,
        })
        ruleFormRef.value.resetFields()
        emits('closeLabel', data)
      }
    } catch (error) {
      console.log('error submit!')
    }
  }

  // 关闭-取消
  const handleCancel = () => {
    ruleFormRef.value.resetFields()
    emits('closeLabel', '')
  }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  watchEffect(() => {
    if (props.EditFormData) {
      ruleForm.id = props.EditFormData.id
      ruleForm.labelName = props.EditFormData.labelName
      ruleForm.labelColor = props.EditFormData.labelColor
    }
  })
</script>

<style lang="scss" scoped></style>
