<template>
  <!-- 列表客户弹框 -->
  <el-dialog
    v-model="props.dialogListVisible"
    v-if="props.dialogListVisible"
    title="全部客户"
    :before-close="handleCancel"
    :show-close="false"
    width="80%"
  >
    <template #header="{ close }">
      <div class="my-header flex-justify-between">
        <div> 全部客户 </div>
        <el-tooltip placement="top">
          <template #content> 更多</template>
          <el-dropdown @command="handleCommand" trigger="click">
            <svg-icon name="all" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, index) in chilrenMoreMenu"
                  :key="index"
                  :command="item.command"
                  :divided="item.divided"
                  :icon="item.icon"
                  >{{ item.label }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>
      </div>
    </template>
    <el-row>
      <el-col :span="18">
        <div class="client-body-content">
          <div class="flex-justify-between">
            <el-avatar :size="50" :src="circleUrl" />
            <el-input
              class="client-input"
              v-model="customerName"
              placeholder="Please input"
              @change="handeInputChange"
            />
          </div>
          <div class="client-tabs">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="基本信息" name="first">
                <div class="text-secondary"> 客户介绍 </div>
                <Editor v-model="customerMark" @onBlur="handeEditorBlur"></Editor>
                <el-tag effect="light" round> 评论 </el-tag>
              </el-tab-pane>
              <el-tab-pane label="工单" name="second">工单</el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
      <el-col :span="6" class="dialog-right">
        <el-form label-position="left" label-width="80px" :model="state" style="max-width: 460px">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="属性" name="1">
              <el-form-item label="负责人">
                <el-input v-model="state.principal" />
              </el-form-item>
              <el-form-item label="等级" prop="level">
                <el-select v-model="state.level" style="width: 100%">
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
              <el-form-item label="类别" class="item-half">
                <el-tree-select
                  style="width: 100%"
                  v-model="state.moduleId"
                  :data="categoryOptions"
                  filterable
                  :render-after-expand="false"
                  @node-click="handeNodeClick"
                />
              </el-form-item>
              <el-form-item label="行业">
                <el-select v-model="state.industry" style="width: 100%">
                  <el-option
                    v-for="item in industryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="规模">
                <el-input type="number" v-model="state.scale" />
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="基础信息" name="2">
              <el-form-item label="产品">
              <el-select v-model="state.productId" style="width: 100%">
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
              <el-form-item label="创建人">
                {{ state.creater }}
              </el-form-item>
              <el-form-item label="创建时间">
                {{ state.createTime }}
              </el-form-item>
            </el-collapse-item>
          </el-collapse>
          <el-form-item label="关注" class="footer-attention">
            <ClientPrincipal v-model="focusList" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleconfirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import {
    ref,
    reactive,
    onMounted,
    computed,
    toRefs,
    watchEffect,
    defineAsyncComponent,
  } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { TabsPaneContext } from 'element-plus'
  import { Edit, Delete, FullScreen } from '@element-plus/icons-vue'
  import { useProductStore } from '@/store/modules/product'
  import { getAllProductList } from '@/api/modules/product.ts'
  import { delCustomerPages, updateCustomerPages } from '@/api/modules/product'
  // 表格列表-等级
  import { operationOptions, industryOptions } from '@/utils/public-data'
  // 异步加载富文本选择器
  const Editor = defineAsyncComponent(() => import('@/components/WangEdior/index.vue'))
  // 异步加载加人员选择器
  const ClientPrincipal = defineAsyncComponent(() => import('@/components/principal/index.vue'))

  const ProductStore = useProductStore()

  // 接收父组件传递的参数
  const props = defineProps({
    dialogListVisible: Boolean,
    TypeList: Array,
    ListFormData: Object,
  })

  //分发事件给父组件
  let emits = defineEmits(['closeDialogList'])

  // Nav列表子孙菜单
  const chilrenMoreMenu = computed(() => {
    return [
      {
        command: 'sideDel',
        divided: false,
        label: `删除`,
        icon: Delete,
      },
    ]
  })

  const activeName = ref('first')
  const activeNames = ref('1')
  // 类别列表数据
  const categoryOptions = ref([])
  // 人员选择器的值
  const focusList = ref(['1'])
  // 产品列表数据
  const productList = ref([])

  const state = reactive({
    id: '',
    circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    customerName: '',
    customerMark: '',
    level: '', // 等级
    principal: '', // 责任人
    moduleId: '', // 类别
    moduleName: '', // 类别名称
    industry: '', // 行业
    scale: '', // 规模
    productId: '', // 产品
    creater: '', // 创建人
    createTime: '', // 创建时间
    IsModify: false, // 是否调用过更新接口
  })

  const { circleUrl, customerName, customerMark } = toRefs(state)

  const handleCommand = async (command: string | number | object) => {
    if (command === 'sideDel') {
      const result = await delCustomerPages(props.ListFormData.id)
      if (result.code === 200 && result.data) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        emits('closeDialogList', true)
      }
    }
  }

  // 当节点被点击的时候触发
  const handeNodeClick = (rows: any) => {
    state.moduleName = rows.label
  }

  // 更新输入框
  const handeInputChange = async (mode) => {
    state.customerName = mode
    await handleUpdateCustomerPages(state)
  }
  // 更新富文本
  const handeEditorBlur = async () => {
    // 暂时注释
    // await handleUpdateCustomerPages(state)
  }

  // tabs点击
  const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
  }

  // 关闭-取消
  const handleCancel = () => {
    emits('closeDialogList', state.IsModify)
  }

  // 确定
  const handleconfirm = async () => {
    await handleUpdateCustomerPages(state)
    emits('closeDialogList', true)
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

  // 更新客户信息表
  const handleUpdateCustomerPages = async (state) => {
    const { code, data } = await updateCustomerPages(state)
    if (code === 200 && data) {
      ElMessage({
        type: 'success',
        message: '更新成功',
      })
      state.IsModify = data
    }
  }
  // 获取所有产品
  const handleGetAllProductList = async () => {
    try {
      const { code, data }: any = await getAllProductList()
      if (code === 200) {
        productList.value = data.map((item) => ({ label: item.productName, value: item.id }))
      }
    } catch (error) {
      console.log(error, 'Error')
    }
  }

  // 当其中依赖的响应式数据发生变化时,重新执行该函数
  watchEffect(() => {
    // 类别下拉数据
    if (props.TypeList.length) {
      categoryOptions.value = processData(props.TypeList)
    }
    // 详情表单数据
    if (props.ListFormData) {
      state.id = props.ListFormData.id
      state.customerName = props.ListFormData.customerName
      state.customerMark = props.ListFormData.customerMark
      state.level = props.ListFormData.level
      state.industry = props.ListFormData.industry
      state.scale = props.ListFormData.scale
      state.moduleId = props.ListFormData.moduleId
      state.moduleName = props.ListFormData.moduleName
      state.productId = props.ListFormData.productId
      state.creater = props.ListFormData.creater
      state.createTime = new Date(props.ListFormData.createTime)?.toLocaleString()
    }
    console.log(props.ListFormData, 111)
  })

  onMounted(() => {
    handleGetAllProductList()
    // console.log(props.ListFormData, 111)
  })
</script>

<style lang="scss" scoped>
  .my-header {
    flex-direction: row;
  }
  .el-tooltip__trigger {
    outline: none;
  }
  .client-body-content {
    box-sizing: border-box;
    .client-tabs {
      margin: 10px 10px;
      .text-secondary {
        color: #666;
      }
      .m-wangEditor {
        margin: 15px 0;
        box-sizing: border-box;
      }
    }
    .client-input {
      flex: 1;
      padding: 0 10px;
      height: 50px;
      font-size: 1.5rem;
    }
  }
  .dialog-right {
    padding: 0 10px;
    background: rgba(250, 250, 250, 0.8);
    .footer-attention {
      position: absolute;
      bottom: 0;
    }
    :deep(.el-collapse-item__header) {
      background: rgba(250, 250, 250, 0.8);
    }
    :deep(.el-collapse-item__wrap) {
      background: rgba(250, 250, 250, 0.8);
    }
  }
</style>
