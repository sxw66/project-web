<template>
  <!-- 看板设置-添加流转状态 -->
  <el-dialog
    v-model="props.addFlowVisible"
    v-if="props.addFlowVisible"
    title="添加状态流转"
    :before-close="handleCancel"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      label-position="top"
      class="flow-ruleForm"
      size="large"
      status-icon
    >
      <el-form-item label="流转名称">
        <el-input
          v-model="ruleForm.FlowName"
          placeholder="请输入流转名称"
          maxlength="32"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="起始状态" prop="initialState">
        <el-select v-model="ruleForm.initialState" style="width: 100%" filterable clearable>
          <el-option
            v-for="item in TargetStateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="flex-align-center">
              <div class="target_icon" :style="{ backgroundColor: item.bg }"></div>
              <div> {{ item.label }} </div>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目标状态" prop="targetState">
        <el-select v-model="ruleForm.targetState" style="width: 100%" filterable clearable>
          <el-option
            v-for="item in draggableListState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <el-tag :type="item.type" round effect="dark">{{ item.label }}</el-tag>
          </el-option>
        </el-select>
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
  import { draggableListState, TargetStateList } from '@/utils/public-data'

  const ProjectStore = useProjectStore()

  // 接收父组件传递的参数
  const props = defineProps({
    addFlowVisible: Boolean,
    EditFormData: Object,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeAddFlow'])

  interface RuleForm {
    id: string
    FlowName: string
    initialState: string
    targetState: string
  }
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    id: '',
    FlowName: '',
    initialState: '',
    targetState: '',
  })

  const rules = reactive<FormRules<RuleForm>>({
    targetState: [{ required: true, message: '起始状态不能为空', trigger: 'change' }],
    initialState: [{ required: true, message: '目标状态不能为空', trigger: 'change' }],
  })

  //  提交计划
  const submitForm = async () => {
    try {
      const valid = await ruleFormRef.value?.validate()
      if (!valid) {
        return
      }
      const formValue = ruleForm
      console.log('formValue!', formValue)
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
        emits('closeAddFlow', data)
      }
    } catch (error) {
      console.log('error submit!')
    }
  }

  // 关闭-取消
  const handleCancel = () => {
    ruleFormRef.value.resetFields()
    emits('closeAddFlow', '')
  }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  watchEffect(() => {
    // if (props.EditFormData) {
    //   ruleForm.id = props.EditFormData.id
    //   ruleForm.states = props.EditFormData.states
    //   ruleForm.labelColor = props.EditFormData.labelColor
    // }
  })
</script>

<style lang="scss" scoped>
  .flow-ruleForm {
    box-sizing: border-box;
  }
  .el-select-dropdown__item {
    margin: 10px 0;
  }
  .flex-align-center {
    .target_icon {
      border-radius: 2px;
      height: 12px;
      width: 12px;
      margin-right: 5px;
    }
  }
</style>
