<template>
  <div class="trigger-card-box">
    <el-form
      ref="RefForm"
      label-position="top"
      :model="formInfo"
      :rules="rulesInfo"
      :hide-required-asterisk="true"
    >
      <el-form-item :prop="field">
        <template #label>
          <div class="form-label">
            <svg-icon :name="icon" size="14"></svg-icon>
            <span style="margin-left: 4px">{{ text }}</span>
          </div>
        </template>
        <el-select
          v-if="type == 'select'"
          v-model="formInfo[field]"
          clearable
          :placeholder="`请选择${text}`"
          style="width: 100%"
        >
          <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value">
            <div class="custom-el-option">
              <svg-icon v-if="item.icon" :name="item.icon" size="14" style="margin-right: 4px">
              </svg-icon>
              <span>{{ item.label }}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <svg-icon v-if="isDelete" class="delete" name="delete" size="14"></svg-icon>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, withDefaults, watch } from 'vue'
  interface Ilist {
    icon?: string
    label: string
    value: string
  }
  interface Iprops {
    field?: string
    icon?: string
    text?: string
    type?: string
    isDelete?: boolean
    list?: Ilist[]
  }
  const props = withDefaults(defineProps<Iprops>(), {
    field: 'default',
    icon: 'triggerColumn',
    text: '默认',
    type: 'select',
    isDelete: true,
    list: () => [{ icon: 'triggerColumn', label: '默认值', value: '0' }],
  })
//   const emit = defineEmits(['update:modelValue'])
  const RefForm = ref()
  const formInfo = ref({
    [props.field]: '',
  })
  const rulesInfo = reactive({
    [props.field]: [
      { required: true, message: `${props.text}不能为空`, trigger: ['change', 'blur'] },
    ],
  })
//   watch(
//     () => formInfo.value[props.field],
//     (value) => {
//       emit('update:modelValue', value)
//     },
//   )
  const validate = (submit) => {
    RefForm.value.validate((vali) => {
      vali && submit()
    })
  }
  defineExpose({ validate, formInfo })
</script>

<style scoped lang="scss">
  .trigger-card-box {
    position: relative;
    width: 100%;
    height: 106px;
    padding: 20px;
    margin: 12px 0;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 8px 2px #00000014;
    &:hover .delete {
      display: block;
    }
    .form-label {
      display: flex;
      align-items: center;
    }
    .delete {
      display: none;
      position: absolute;
      top: 20px;
      right: 20px;
      &:hover {
        color: #ff7575;
      }
    }
    .custom-el-option {
      display: flex;
      align-items: center;
    }
  }
</style>
