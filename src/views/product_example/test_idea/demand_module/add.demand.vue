<template>
  <div class="form-box">
    <el-dialog
      width="80%"
      title="新增需求"
      destroy-on-close
      :before-close="handleCancelBeforeClose"
      align-center
      :close-on-click-modal="false"
      v-model="dialogVisible"
    >
      <div class="form-box">
        <div class="left">
          <el-form ref="RefLeftForm" :model="formInfo" :rules="rulesInfo" label-position="top">
            <el-form-item label="标题" prop="demandTitle">
              <div class="custom-title">
                <el-input
                  placeholder="请输入"
                  :maxlength="255"
                  v-model="formInfo.demandTitle"
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
              <Editor v-model="formInfo.deMark"></Editor>
            </el-form-item>
          </el-form>
        </div>
        <div class="right">
          <el-form ref="RefRightForm" :rules="rulesInfo" :model="formInfo" label-position="top">
            <el-form-item label="所属产品" required prop="productId">
              <el-select v-model="formInfo.productId" style="width: 100%">
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
            <el-form-item label="模块">
              <el-select v-model="formInfo.productModuleId" style="width: 100%">
                <el-option
                  v-for="item in moduleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="负责人">
              <el-select placeholder="请选择" v-model="formInfo.principal" style="width: 100%">
                <el-option
                  v-for="item in customerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span class="demand-principal-bgc" :style="{ background: item.bgc }">
                    {{ item.label?.substring(0, 2).toUpperCase() }}
                  </span>
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="需求来源" prop="fromType">
              <el-select placeholder="请选择" v-model="formInfo.fromType" style="width: 100%">
                <el-option
                  v-for="item in demandSourceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <span class="demand-source-bgc" :style="{ background: item.bgc }"></span>
                  <span>{{ item.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="需求类型" prop="demandType">
              <el-select placeholder="请选择" v-model="formInfo.demandType" style="width: 100%">
                <el-option
                  v-for="item in demandTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                  <div class="demand-type-bgc" :style="{ background: item.bgc }">
                    {{ item.label }}
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关注人">
              <Principal :multiple="false" :showTeam="false" v-model="focusList"></Principal>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="emit('update:visible', false)">取消</el-button>
        <el-button @click="handleComfirmAdd" type="primary">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, defineAsyncComponent, watch, onMounted } from 'vue'
  import { getAllProductList } from '@/api/modules/product.ts'
  const props = defineProps(['modelValue', 'visible'])
  const emit = defineEmits(['update:modelValue', 'update:visible', 'comfirm'])
  const Editor = defineAsyncComponent(() => import('@/components/WangEdior/index.vue'))
  const focusList = ref([])
  const num = ref(0)
  const RefLeftForm = ref()
  const RefRightForm = ref()
  const dialogVisible = ref(false)
  const formInfo = ref({
    demandTitle: '',
    deMark: '',
    productId: '',
    productModuleId: '',
    principal: '',
    fromType: '',
    demandType: '',
  })
  watch(
    () => focusList.value,
    (value) => {
      console.log(value, 'v-model数据变化')
    },
  )
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
    demandTitle: [{ required: true, message: '请输入', trrigger: ['change', 'blur'] }],
    productId: [{ required: true, message: '请选择', trrigger: ['change', 'blur'] }],
    fromType: [{ required: true, message: '请选择', trrigger: ['change', 'blur'] }],
    demandType: [{ required: true, message: '请选择', trrigger: ['change', 'blur'] }],
  })
  const productList = ref([])
  const moduleList = [
    {
      label: '商城首页',
      value: '0',
    },
    {
      label: '购物车',
      value: '1',
    },
    {
      label: '订单管理',
      value: '2',
    },
    {
      label: '账号管理',
      value: '3',
    },
  ]
  const customerList = [
    {
      label: '彭峰',
      value: '0',
      bgc: '#9a7ff2',
    },
    {
      label: 'lodash',
      value: '1',
      bgc: '#fd9e76',
    },
    {
      label: 'ailisa',
      value: '2',
      bgc: '#f97fb7',
    },
    {
      label: 'test',
      value: '3',
      bgc: '#5aacf9',
    },
  ]
  const demandSourceList = [
    {
      label: '产品规划',
      value: '0',
      bgc: '#5aacf9',
    },
    {
      label: '用户反馈',
      value: '1',
      bgc: '#86e181',
    },
    {
      label: '竞品调研',
      value: '2',
      bgc: '#f97795',
    },
    {
      label: '内部需求',
      value: '3',
      bgc: '#f3d573',
    },
  ]
  const demandTypeList = [
    {
      label: '功能需求',
      value: '0',
      bgc: '#62d0fd',
    },
    {
      label: '体验优化',
      value: '1',
      bgc: '#f5c560',
    },
    {
      label: '安全需求',
      value: '2',
      bgc: '#76d899',
    },
    {
      label: '技术需求',
      value: '3',
      bgc: '#fd9e76',
    },
  ]
  //设置输入标题的数量
  const handleInputTitle = (e) => {
    num.value = e.length
  }
  const handleCancelBeforeClose = () => {
    emit('update:visible', false)
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
    emit('comfirm')
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
    }
  }
  .demand-principal-bgc {
    display: inline-block;
    text-align: center;
    line-height: 21px;
    margin-right: 10px;
    width: 21px;
    height: 21px;
    padding: 4px;
    border-radius: 50%;
    color: #fff;
    font-size: 12px;
  }
  .demand-source-bgc {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    border-radius: 50%;
  }
  .demand-type-bgc {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: 24px;
    padding: 0 15px;
    border-radius: 30px;
    color: #fff;
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
</style>
