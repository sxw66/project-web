<template>
  <div>
    <!-- 新建计划排期 -->
    <el-dialog
      v-model="props.dialogFormVisible"
      v-if="props.dialogFormVisible"
      width="800"
      title="新建计划"
      :before-close="handleCancel"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        label-position="top"
        class="demo-ruleForm"
        size="large"
        status-icon
      >
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="ruleForm.planName" placeholder="请输入计划名称" maxlength="30" />
        </el-form-item>
        <el-form-item label="类别" prop="planType">
          <el-tree-select
            style="width: 100%"
            v-model="ruleForm.planType"
            :data="categoryOptions"
            filterable
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item label="计划时间">
          <el-date-picker
            v-model="ruleForm.planTime"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="计划开始时间"
            end-placeholder="计划开结束时间"
            :shortcuts="shortcuts"
            format="YYYY/MM/DD"
            value-format="x"
            @blur="handeBlurDatePicker"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            style="width: 100%"
            filterable
            v-model="ruleForm.principalName"
            placeholder="选择负责人"
          >
            <template v-slot:prefix>
              <span class="prefix-icon">
                <el-icon><User /></el-icon>
              </span>
            </template>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <div>
                <el-avatar :size="22" style="background-color: rgb(154, 126, 244)">
                  {{ item.value }}
                </el-avatar>
                <span style="margin-left: 8px">{{ item.label }}</span>
              </div>
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
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, watchEffect } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { User } from '@element-plus/icons-vue'
  import { useProductStore } from '@/store/modules/product'
  import { addSchedulePages, editSchedulePages } from '@/api/modules/product'
  const ProductStore = useProductStore()

  // 接收父组件传递的参数
  const props = defineProps({
    dialogFormVisible: Boolean,
    TypeList: Array,
    EditFormData: Object,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeDialogVisible'])

  interface RuleForm {
    planKind: string
    planType: string
    planName: string
    planTime: string
    principalName: string
    startTime: string
    endTime: string
  }
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    planKind: 0,
    kindValue: ProductStore.productId,
    planType: '',
    planName: '',
    planTime: '',
    principalName: '',
    startTime: '',
    endTime: '',
  })

  const rules = reactive<FormRules<RuleForm>>({
    planName: [
      { required: true, message: '请输入计划名称', trigger: 'blur' },
      { min: 3, max: 30, message: '长度在3到30位', trigger: 'blur' },
    ],
  })
  //  类别
  const categoryOptions = ref([])
  //  负责人
  const options = [
    {
      value: '马宝国',
      label: '马宝国',
    },
    {
      value: 'GIao哥',
      label: 'GIao哥',
    },
    {
      value: '小叮当',
      label: '小叮当',
    },
  ]
  //  日期基础配置
  const shortcuts = [
    {
      text: '今天',
      value: () => {
        const start = new Date()
        const end = new Date()
        end.setDate(end.getDate() + 1)
        return [start, end]
      },
    },
    {
      text: '明天',
      value: () => {
        const start = new Date()
        const end = new Date()
        start.setDate(start.getDate() + 1)
        end.setDate(end.getDate() + 2)
        return [start, end]
      },
    },
    {
      text: '下周',
      value: () => {
        const start = new Date()
        const end = new Date()
        end.setDate(end.getDate() + 7)
        return [start, end]
      },
    },
  ]

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

  // 时间失去焦点
  const handeBlurDatePicker = () => {
    if (ruleForm.planTime.length) {
      ruleForm.startTime = ruleForm.planTime[0]
      ruleForm.endTime = ruleForm.planTime[1]
    }
  }

  //  提交计划
  const submitForm = async () => {
    try {
      const valid = await ruleFormRef.value?.validate()
      if (!valid) {
        return
      }
      const formValue = ruleForm
      const { code, data } = formValue.id
        ? await editSchedulePages(formValue)
        : await addSchedulePages(formValue)
      if (code === 200 && data) {
        const message = formValue.id ? '编辑成功' : '新增成功'
        ElMessage.success({
          showClose: true,
          message: message,
        })
        ruleFormRef.value.resetFields()
        emits('closeDialogVisible', data)
      }
    } catch (error) {
      console.log('error submit!')
    }
  }

  // 重置
  const resetRuleForm = () => {
    ruleForm.id = ''
    ruleForm.planKind = 0
    ruleForm.kindValue = ProductStore.productId
    ruleForm.planType = ''
    ruleForm.planName = ''
    ruleForm.planTime = ''
    ruleForm.principalName = ''
    ruleForm.startTime = ''
    ruleForm.endTime = ''
  }

  // 关闭-取消
  const handleCancel = () => {
    ruleFormRef.value.resetFields()
    emits('closeDialogVisible', false)
  }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  watchEffect(() => {
    if (props.TypeList.length) {
      categoryOptions.value = processData(props.TypeList)
    }
    if (props.EditFormData) {
      ruleForm.id = props.EditFormData.id
      ruleForm.startTime = props.EditFormData.startTime
      ruleForm.endTime = props.EditFormData.endTime
      ruleForm.kindValue = props.EditFormData.kindValue
      ruleForm.planName = props.EditFormData.planName
      ruleForm.planType = props.EditFormData.planType
      ruleForm.principalName = props.EditFormData.principalName
    } else {
      resetRuleForm()
    }
  })
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
