<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="dialog_box">
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="830px"
      top="50px"
      draggable
      :show-close="true"
      destroy-on-close
      align-center
    >
      <div class="dialog_content">
        <div class="left">
          <div class="img_style">
            <img :src="productImg" />
          </div>
          <div class="text_style">
            <p>{{ dict.descList[0].title }}</p>
            <div style="margin-bottom: 10px">{{ dict.descList[0].text }}</div>
            <div v-for="(el, index) in dict.descList[0].tipList" :key="index">
              <div style="margin: 10px 0">
                <el-button type="success" :icon="Check" size="small" circle class="btn" />
                {{ el }}
              </div>
            </div>
          </div>
        </div>
        <!-- 表单 -->
        <div class="right">
          <el-form
            v-if="isNext"
            ref="productRef"
            :model="ruleForm"
            :rules="rules"
            label-width="120px"
            label-position="top"
            class="demo-ruleForm"
            status-icon
          >
            <el-form-item label="所属" prop="fromType">
              <el-select v-model="ruleForm.fromType" clearable placeholder="请选择">
                <el-option
                  v-for="item in dict.formTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="产品名称" prop="productName">
              <el-input
                v-model="ruleForm.productName"
                maxlength="32"
                show-word-limit
                placeholder="输入产品名称"
                @input="changeName"
              >
                <template #prepend>
                  <svg-icon
                    name="product"
                    :color="ruleForm.productColor"
                    style="position: absolute"
                  />
                  <el-color-picker v-model="ruleForm.productColor" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="可见范围" prop="isPrivate">
              <el-select v-model="ruleForm.isPrivate" clearable placeholder="请选择可见范围">
                <el-option
                  v-for="item in dict.permissionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  style="height: 60px"
                >
                  <div style="width: 100%">
                    <div>
                      <div style="color: #333">
                        <svg-icon :name="item.iconName" />
                        {{ item.label }}
                      </div>
                      <div style="color: #aaa; margin: -10px 0px 0px 18px">{{ item.text }}</div>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="产品标识" prop="productCode">
              <el-input
                v-model="ruleForm.productCode"
                clearable
                placeholder="大写字母和数字，15 个字符以内"
              />
            </el-form-item>

            <el-form-item label="描述">
              <el-input
                v-model="ruleForm.productDesc"
                type="textarea"
                clearable
                placeholder="输入产品描述"
              />
            </el-form-item>
          </el-form>
          <!-- 人员选择 -->
          <div v-else> 人员选择 </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer" style="display: flex; justify-content: space-between">
          <div>
            <!-- <el-button type="" text @click="cancel">反馈建议</el-button> -->
          </div>
          <div>
            <el-button v-if="isNext" @click="cancel">取消</el-button>
            <el-button v-else type="primary" @click="handleBack">上一步</el-button>
            <el-button v-if="isNext" type="primary" @click="handleNext">下一步</el-button>
            <el-button v-else type="primary" @click="submitForm">确定</el-button>
          </div>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue'
  import { productAdd } from '@/api/modules/product.ts'
  import { upPercase } from '@/api/modules/common.ts'
  import productImg from '@/assets/image/productImg/product.png'
  import * as dict from '@/utils/public-data'

  import { ElMessage } from 'element-plus'
  import { Check } from '@element-plus/icons-vue'

  const props = defineProps(['isShow', 'title', 'imgUrl'])
  const emits = defineEmits(['update:isShow', 'submit'])
  const dialogTitle: any = computed(() => props.title || '新建')
  const dialogVisible: any = computed({
    get: () => {
      return props.isShow
    },
    set: (value: any) => {
      emits('update:isShow', value)
    },
  })
  const productRef = ref()
  const ruleForm = ref({
    fromType: '',
    productName: '',
    fromValue: '1',
    isPrivate: null,
    productDesc: '',
    creater: '12345',
    productColor: '#56abfb',
    productCode: '',
  })
  const isNext = ref(true)
  const rules = reactive({
    fromType: [{ required: true, message: '请选择', trigger: 'change' }],
    productName: [{ required: true, message: '请选择', trigger: 'blur' }],
    productCode: [{ required: true, message: '请选择', trigger: 'blur' }],
    isPrivate: [{ required: true, message: '请选择', trigger: 'change' }],
  })
  // 产品名称改变转为大写
  const changeName = (val: string) => {
    upPercase({ s: val }).then((res) => {
      if (res.code === 200) {
        ruleForm.value.productCode = res.data || ''
      }
    })
  }
  // 监听弹窗关闭重置表单
  watch(
    () => dialogVisible.value,
    (newVal: any) => {
      if (!newVal) {
        productRef.value?.resetFields()
        ruleForm.value = {
          fromType: '',
          productName: '',
          fromValue: '1',
          isPrivate: null,
          productDesc: '',
          creater: '1111',
          productColor: '#56abfb',
          productCode: '',
        }
      }
    },
    {
      immediate: true,
    },
  )
  const cancel = () => {
    emits('update:isShow', false)
  }
  //   上一步
  const handleBack = () => {
    isNext.value = true
  }
  //   下一步
  const handleNext = () => {
    productRef.value?.validate((vali: boolean) => {
      if (vali) {
        isNext.value = false
      }
    })
  }

  // 表单提交
  const submitForm = () => {
    console.log('ruleForm=====', ruleForm.value)
    productAdd(ruleForm.value).then((res) => {
      if (res.code === 200) {
        if (res.data) {
          ElMessage.success('新增成功')
          isNext.value = true
          emits('submit', '确定提交')
          emits('update:isShow', false)
          console.log('成功')
        }
      }
    })
    // productRef.value?.validate((vali: boolean) => {
    //   if (vali) {
    //     console.log('22222222222', ruleForm.value)
    //     productAdd(ruleForm.value).then((res) => {
    //       if (res.code === 200) {
    //         if (res.data) {
    //           emits('submit', '确定提交')
    //           emits('update:isShow', false)
    //           console.log('成功')
    //         }
    //       }
    //     })
    //   }
    // })
  }
</script>

<style lang="scss" scoped>
  .dialog_box {
    .dialog_content {
      display: flex;
      div {
        flex: 1;
      }
      .left {
        padding: 0 20px;
        border-right: 1px solid #eee;
        .img_style {
          margin-bottom: 20px;
          padding: 20px;
          text-align: center;
          background: #fafafa;
        }
        .text_style {
          box-sizing: border-box;
          .btn {
            height: 14px;
            width: 14px;
            margin-right: 3px;
          }
        }
      }
      .right {
        padding: 0 20px;
        ::v-deep(.el-input-group__prepend) {
          background-color: #fff;
          padding: 0 5px;
        }
        ::v-deep(.el-color-picker__trigger) {
          border: none;
        }
        ::v-deep(.el-color-picker__icon) {
          display: none !important;
        }
        ::v-deep(.el-color-picker__color) {
          width: 0% !important;
          height: 0% !important;
          border: none;
        }
        ::v-deep(.el-icon-arrow-down) {
          display: none !important;
        }
        ::v-deep(.el-color-picker__color-inner) {
          position: relative !important;
          height: 20% !important;
          bottom: 0px;
          display: block !important;
        }
      }
    }
  }
</style>
