<template>
  <!-- 看板设置-添加状态 -->
  <el-dialog
    v-model="props.addStateVisible"
    v-if="props.addStateVisible"
    :title="IsShowNewState ? '新建状态' : '添加状态'"
    :before-close="handleCancel"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      label-position="top"
      class="state-ruleForm"
      size="large"
      status-icon
    >
      <!-- 创建新状态 -->
      <template v-if="IsShowNewState">
        <el-form-item label="状态名称" prop="StatusName">
          <el-input
            v-model="ruleForm.StatusName"
            placeholder="请输入状态名称"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
        <el-form-item>
          <el-color-picker v-model="ruleForm.labelColor" :predefine="predefineColors" />
        </el-form-item>
        <el-form-item label="目标状态" prop="targetState">
          <el-select v-model="ruleForm.targetState" style="width: 100%" filterable clearable>
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
      </template>
      <!-- 添加状态 -->
      <template v-else>
        <el-form-item label="选择状态" prop="states">
          <el-select v-model="ruleForm.states" style="width: 100%" filterable clearable>
            <el-option
              v-for="item in SelectiveState"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag :type="item.type" effect="dark" round size="small" style="margin-right: 12px">
                {{ item.label }}
              </el-tag>
              <el-tag type="info" round size="small">{{ item.desc }}</el-tag>
            </el-option>
          </el-select>
        </el-form-item>
      </template>
      <div class="flex-align-center" v-if="!IsShowNewState">
        <el-text type="info">或者</el-text>
        <el-link type="primary" :underline="false" @click="IsShowNewState = true"
          >创建新状态</el-link
        >
        <el-text type="info">，新创建的状态会自动加入全局状态库</el-text>
      </div>
      <el-form-item>
        <el-checkbox v-model="ruleForm.checked" label="允许所有状态流转至当前状态" />
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
  import { SelectiveState, TargetStateList } from '@/utils/public-data'

  const ProjectStore = useProjectStore()

  // 接收父组件传递的参数
  const props = defineProps({
    addStateVisible: Boolean,
    EditFormData: Object,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeAddState'])

  interface RuleForm {
    id: string
    states: string
    labelColor: string
    StatusName: string
    targetState: string
    checked: boolean
  }
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    id: '',
    states: '',
    StatusName: '',
    labelColor: '#409EFF',
    targetState: '',
    checked: true,
  })

  const rules = reactive<FormRules<RuleForm>>({
    // 添加状态
    states: [{ required: true, message: '请选择', trigger: 'change' }],
    // 新建状态
    StatusName: [
      { required: true, message: '状态名称不能为空', trigger: 'blur' },
      { min: 1, max: 30, message: '长度在3到30位', trigger: 'blur' },
    ],
    targetState: [{ required: true, message: '状态类型不能为空', trigger: 'change' }],
  })

  const IsShowNewState = ref(false) // 是否展示创建新状态

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
        emits('closeAddState', data)
      }
    } catch (error) {
      console.log('error submit!')
    }
  }

  // 关闭-取消
  const handleCancel = () => {
    ruleFormRef.value.resetFields()
    IsShowNewState.value = false
    emits('closeAddState', '')
  }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
//   watchEffect(() => {
//     if (props.EditFormData) {
//       ruleForm.id = props.EditFormData.id
//       ruleForm.states = props.EditFormData.states
//       ruleForm.labelColor = props.EditFormData.labelColor
//     }
//   })
</script>

<style lang="scss" scoped>
  .state-ruleForm {
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
