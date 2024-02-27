<template>
  <div class="form-box">
    <el-dialog
      title="新增工作项"
      width="80%"
      destroy-on-close
      :before-close="handleCancelBeforeClose"
      align-center
      :close-on-click-modal="false"
      v-model="dialogVisible"
    >
      <div class="form-box">
        <div class="left">
          <el-form ref="RefLeftForm" :model="formInfo" :rules="rulesInfo" label-position="top">
            <el-form-item label="标题" prop="itemName">
              <div class="custom-title">
                <el-input
                  placeholder="请输入"
                  :maxlength="255"
                  v-model="formInfo.itemName"
                  @input="handleInputTitle"
                >
                </el-input>
                <div class="linmit-num">
                  <span>{{ num }}</span>
                  /
                  <span>255</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="描述">
              <Editor v-model="formInfo.itemDesc"></Editor>
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-form ref="RefRightForm" :rules="rulesInfo" :model="formInfo" label-position="top">
            <el-form-item label="所属产品" prop="projectId">
              <el-select v-model="formInfo.projectId" style="width: 100%">
                <el-option
                  v-for="item in productList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <svg-icon color="rgb(86, 171, 251)" name="product"></svg-icon>
                  <span style="margin-left: 10px">{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="工作项类型" prop="itemType">
              <el-select v-model="formInfo.itemType" style="width: 100%">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <!-- <svg-icon color="#999" style="margin-right: 10px" :name="item.icon"></svg-icon> -->
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="优先级">
              <el-select placeholder="请选择" v-model="formInfo.priority" style="width: 100%">
                <el-option
                  v-for="item in selectPriorityList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="customer-icon-bgc">
                    <svg-icon color="#fff" size="15" name="landmark"></svg-icon>
                  </div>
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="风险">
              <el-select placeholder="请选择" v-model="formInfo.riskLevel" style="width: 100%">
                <el-option
                  v-for="item in riskLevelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="customer-icon-bgc">
                    <svg-icon color="#fff" size="15" name="landmark"></svg-icon>
                  </div>
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="需求类型" prop="needType">
              <el-select v-model="formInfo.needType" style="width: 100%">
                <el-option
                  v-for="item in workitemTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <!-- <svg-icon color="#999" style="margin-right: 10px" :name="item?.icon"></svg-icon> -->
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="需求来源" prop="needFrom">
              <el-select v-model="formInfo.needFrom" style="width: 100%">
                <el-option
                  v-for="item in fromTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <!-- <svg-icon color="#999" style="margin-right: 10px" :name="item?.icon"></svg-icon> -->
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提交人">
              <el-select placeholder="请选择" v-model="formInfo.creater" style="width: 100%">
                <el-option
                  v-for="item in [{ label: '彭峰', value: '1', bgc: '#9a7ff2' }]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span class="creater-bgc" :style="{ background: item.bgc }">
                    {{ item.label?.substring(0, 2)?.toUpperCase() }}
                  </span>
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关注人">
              <Principal v-model="focusPersonList"></Principal>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
        <el-button @click="handleComfirmAdd" type="primary">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, watch, onMounted } from 'vue'
  import { getAllProductList } from '@/api/modules/product.ts'
  import {
    workitemTypeList,
    fromTypeList,
    riskLevelList,
    selectPriorityList,
    itemTypeList,
  } from './static'
  const props = defineProps(['modelValue', 'visible'])
  const emit = defineEmits(['update:modelValue', 'update:visible', 'confirm'])
  const Editor = defineAsyncComponent(() => import('@/components/WangEdior/index.vue'))
  const RefLeftForm = ref()
  const RefRightForm = ref()
  const focusPersonList = ref(['1'])
  const dialogVisible = ref(false)
  const num = ref(0)
  const formInfo: any = ref({
    itemName: '',
    itemDesc: '',
    projectId: '',
    itemType: '',
    priority: '',
    creater: '',
    principal: '',
    riskLevel: '',
    needType: '',
    needFrom: '',
  })
  watch(
    () => props.modelValue,
    () => {
      Object.assign(formInfo.value, props.modelValue)
    },
    {
      immediate: true,
    },
  )
  watch(
    () => props.visible,
    (value) => {
      dialogVisible.value = value
      emit('update:visible', value)
    },
  )
  watch(
    () => formInfo.value,
    (value) => {
      emit('update:modelValue', value)
    },
    {
      deep: true,
    },
  )
  const rulesInfo = reactive({
    itemName: [{ required: true, message: '请输入', trrigger: ['change', 'blur'] }],
    projectId: [{ required: true, message: '请选择', trrigger: ['change', 'blur'] }],
    itemType: [{ required: true, message: '请选择', trrigger: ['change', 'blur'] }],
  })
  const productList: any = ref([])
  const typeList = [
    {
      label: '需求',
      value: '0',
      icon: 'demand',
    },
    {
      label: '缺陷',
      value: '1',
      icon: 'defect',
    },
    {
      label: '技术支持',
      value: '2',
      icon: 'listen',
    },
  ]
  const customerList = [
    {
      label: '上海xx新零售有限公司',
      value: '0',
    },
    {
      label: '上海xx电商有限公司',
      value: '1',
    },
    {
      label: '北京xx丽妆有限公司',
      value: '2',
    },
    {
      label: '北京xx科技有限公司',
      value: '3',
    },
    {
      label: '北京xx跨境有限公司',
      value: '4',
    },
    {
      label: '广州xx居家有限公司',
      value: '5',
    },
  ]
  const handleCancelBeforeClose = () => {
    emit('update:visible', false)
  }
  //设置输入标题的数量
  const handleInputTitle = (e) => {
    num.value = e.length
  }

  const handleGetAllProductList = async () => {
    try {
      const { code, data }: any = await getAllProductList()
      if (code === 200) {
        console.log(data, 'data')
        productList.value = data.map((item) => ({ label: item.productName, value: item.id }))
      }
    } catch (error) {
      console.log(error, 'Error')
    }
  }
  const handleComfirmAdd = () => {
    emit('confirm')
  }
  onMounted(() => {
    handleGetAllProductList()
  })
  const validate = (submit) => {
    RefLeftForm.value?.validate((valiLeft) => {
      RefRightForm.value.validate((valiRight) => {
        valiLeft && valiRight && submit()
      })
    })
  }

  defineExpose({ validate })
</script>

<style scoped lang="scss">
  .form-box {
    width: 100%;
    height: 74vh;
    display: flex;
    justify-content: space-between;
    .left {
      width: 66%;
      padding-right: 30px;
      //   border: 1px solid;
      box-sizing: border-box;
    }
    .right {
      width: 34%;
      padding-left: 30px;
      //   border: 1px solid;
      border-left: 1px solid #eee;
      box-sizing: border-box;
      overflow-y: scroll;
    }
  }
  .customer-icon-bgc {
    display: grid;
    place-items: center;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #6698ff;
    margin-right: 10px;
  }
  .creater-bgc {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    width: 27px;
    height: 27px;
    font-size: 12px;
    margin-right: 10px;
    border-radius: 50%;
  }
  :deep(.custom-title) {
    position: relative;
    width: 100%;
    .el-input__wrapper {
      padding-right: 84px;
    }
    .linmit-num {
      position: absolute;
      top: 0;
      right: 8px;
      font-size: 14px;
      color: #999;
    }
  }
  .right::-webkit-scrollbar {
    display: none;
  }
</style>
