<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="multiple-select">
    <el-select
      v-model="menusTitle"
      multiple
      collapse-tags
      collapse-tags-tooltip
      :placeholder="props.placeholder"
      clearable
      @clear="clearData"
      :style="{ width: props.width }"
    >
      <el-checkbox v-model="checkedAll" @change="selectAll">全选</el-checkbox>
      <el-option v-for="(item, index) in menuList" :key="item[props.id]" :value="item[props.id]">
        <el-checkbox
          :label="item[props.label]"
          size="large"
          @change="changeCheckBox(item, index)"
          :checked="isChecked(item)"
          v-model="checkBoxObj[index]"
        />
      </el-option>
      <div class="btn">
        <el-button type="primary" link @click="submit">确认</el-button>
      </div>
    </el-select>
    <!-- 引用组件 -->
    <!-- <muliSelect :list="list" :label="'label'" :id="'id'" v-model:modelValue="checkData" @selecChange="change"></muliSelect> -->
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineProps, defineEmits, computed } from 'vue'
  const props = defineProps({
    list: {
      type: Array,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: '250px',
    },
    modelValue: {
      type: Array,
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
  })
  //   传入=========
  // const list = ref([
  //   {label: '分组1',id: '1'},
  //   {label: '分组2',id: '2'},
  //   {label: '分组3',id: '3'},
  //   {label: '分组4',id: '4'},
  // ])
  // const checkData = ref([])
  // const change = (val: any) => {
  //   console.log('checkData======',checkData.value);

  // }
  const emit = defineEmits(['update:modelValue', 'selecChange'])
  const checkedAll = ref<any>('false')
  const menus = ref<any>([])
  const menuList = computed(() => props.list)
  const checkBoxObj = ref({})
  menuList.value.forEach((res, index) => {
    checkBoxObj.value[index] = false
  })
  const menusTitle = ref([])

  const selectAll = (value) => {
    menus.value = []
    menusTitle.value = []
    if (value) {
      menuList.value.forEach((item, index) => {
        menus.value.push(item[props.id])
        menusTitle.value.push(item[props.label])
        checkBoxObj.value[index] = true
      })
    } else {
      menus.value = []
      menusTitle.value = []
      menuList.value.forEach((item, index) => {
        checkBoxObj.value[index] = false
      })
    }
    emit('update:modelValue', menus.value)
  }
  const isChecked = (item) => {
    return menus.value.indexOf(item[props.id]) > -1
  }
  const changeCheckBox = (item, index) => {
    let i = menus.value.indexOf(item[props.id])
    if (i == -1) {
      menus.value.push(item[props.id])
      menusTitle.value.push(item[props.label])
    } else {
      menus.value.splice(i, 1)
      menusTitle.value.splice(i, 1)
    }
    if (menus.value.length == menuList.value.length) {
      checkedAll.value = true
    } else {
      checkedAll.value = false
    }
    emit('update:modelValue', menus.value)
  }
  // 确认按钮
  const submit = () => {
    emit('selecChange')
  }
  const clearData = () => {
    menus.value = []
    menusTitle.value = []
    emit('update:modelValue', menus.value)
    checkedAll.value = false
    menuList.value.forEach((item, index) => {
      checkBoxObj.value[index] = false
    })
  }
</script>

<style lang="scss" scoped>
  .el-select-dropdown {
    .el-checkbox {
      display: flex;
      align-items: center;
      padding-left: 20px;
      width: 100%;
      box-sizing: border-box;
    }

    .el-select-dropdown__item {
      // background-color: red !important;
      padding: 0;
      display: flex;
      align-items: center;
    }
  }
  :deep(.el-checkbox__label) {
    padding-right: 8px;
  }
  .btn {
    padding: 5px 20px 0 0;
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e9e9eb;
  }
</style>
