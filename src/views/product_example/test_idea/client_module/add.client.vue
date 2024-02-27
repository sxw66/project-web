<template>
  <!-- 新建客户 -->
  <el-dialog
    v-model="props.dialogFormVisible"
    v-if="props.dialogFormVisible"
    title="新建客户"
    :before-close="handleCancel"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      label-position="top"
      class="client-ruleForm"
      size="large"
      status-icon
    >
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="ruleForm.customerName"
          placeholder="请输入计划名称"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="品牌标识">
        <!-- <UploadCropper />   预留图片上传组件-->
        <el-upload
          class="upload-demo"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          multiple
          :limit="3"
        >
          <div style="display: flex; align-items: center">
            <el-avatar src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />
            <el-text type="primary" style="margin-left: 10px">点击上传</el-text>
            <el-text type="info">（仅支持JPG、PNG格式图片，建议80x80）</el-text>
          </div>
        </el-upload>
      </el-form-item>
      <div class="layout-form-item">
        <el-form-item label="类别" class="item-half">
          <el-tree-select
            style="width: 100%"
            v-model="ruleForm.moduleId"
            :data="categoryOptions"
            filterable
            :render-after-expand="false"
            @node-click="handeNodeClick"
          />
        </el-form-item>
        <el-form-item label="等级" prop="level" class="item-half">
          <el-select v-model="ruleForm.level" style="width: 100%">
            <el-option
              v-for="item in operationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <el-tag :key="item.label" :color="item.color" effect="light" round>
                {{ item.label }}
              </el-tag>
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="layout-form-item">
        <el-form-item label="行业" prop="industry" class="item-half">
          <el-select v-model="ruleForm.industry" style="width: 100%">
            <el-option
              v-for="item in industryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规模" prop="scale" class="item-half">
          <el-input type="number" v-model="ruleForm.scale" />
        </el-form-item>
      </div>
      <el-form-item label="客户介绍">
        <WangEdior v-model="ruleForm.customerMark" />
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
  import type { UploadProps, UploadUserFile } from 'element-plus'
  import { User } from '@element-plus/icons-vue'
  import { useProductStore } from '@/store/modules/product'
  import { addCustomerPages, editSchedulePages } from '@/api/modules/product'
  // 表格列表-等级-行业
  import { operationOptions,industryOptions } from '@/utils/public-data'
  // 预留图片上传组件
  // import UploadCropper from '@/components/UploadCropper/index.vue'
  // 富文本
  import WangEdior from '@/components/WangEdior/index.vue'

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
    productId: string
    logo: string
    customerName: string
    level: string
    industry: number
    scale: number
    moduleId: string
    moduleName: string
    customerMark: string
  }
  const ruleFormRef = ref<FormInstance>()
  const ruleForm = reactive<RuleForm>({
    productId: ProductStore.productId,
    customerName: '',
    logo: '',
    level: '',
    industry: 0,
    scale: 0,
    moduleId: '',
    moduleName: '',
    customerMark: '',
  })

  const rules = reactive<FormRules<RuleForm>>({
    customerName: [
      { required: true, message: '请输入计划名称', trigger: 'blur' },
      { min: 3, max: 30, message: '长度在3到30位', trigger: 'blur' },
    ],
  })

  //  类别
  const categoryOptions = ref([])

  // 当节点被点击的时候触发
  const handeNodeClick = (rows: any) => {
    ruleForm.moduleName = rows.label
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
        : await addCustomerPages(formValue)
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

  // 关闭-取消
  const handleCancel = () => {
    ruleFormRef.value.resetFields()
    emits('closeDialogVisible', '')
  }
  // 默认获取父组件传递的树列表-和表格数据-依赖项变化的时候，重新执行改函数。
  watchEffect(() => {
    if (props.TypeList.length) {
      categoryOptions.value = processData(props.TypeList)
    }
    // if (props.EditFormData) {
    //   ruleForm.id = props.EditFormData.id
    //   ruleForm.kindValue = props.EditFormData.kindValue
    //   ruleForm.customerName = props.EditFormData.customerName
    //   ruleForm.planType = props.EditFormData.planType
    //   ruleForm.level = props.EditFormData.level
    // }
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
  .client-ruleForm {
    .layout-form-item {
      display: flex;
      justify-content: space-between;
      .item-half {
        width: 45%;
      }
    }
  }
  // :deep(.el-select-dropdown__item) {
  //   margin: 10px 0;
  // }
</style>
