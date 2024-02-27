<template>
  <!--新 - 侧边菜单组件 -->
  <el-menu
    default-active="all"
    class="el-menu-vertical-demo"
    active-color="#6698ff"
    background-color="#fbfbfb"
    @select="handeSelectMenu"
    unique-opened
    popper-effect="light"
    v-bind="attrs"
  >
    <div class="sidebar-header">
      <span>全部{{ SideMenuTitle }}</span>
      <el-dropdown @command="handleCommand" trigger="click">
        <svg-icon name="plus" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in creatMenu"
              :key="index"
              :command="item.command"
              :icon="item.icon"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-menu-item index="all">全部{{ SideMenuTitle }}</el-menu-item>
    <el-divider />
    <template v-for="(item, index) in SideMenuList" :key="index">
      <el-sub-menu v-if="item.subList && item.subList.length > 0" :index="index.toString()">
        <template #title>
          <span style="width: 100%" @click="handeMoreSideClick(item)" class="flex-justify-between">
            <!-- 新建-编辑-删除-类别 只有包含子类别才渲染-->
            <el-input
              v-model="item.moduleName"
              v-if="item.contenteditable"
              @change="handeInputMedit(item)"
              @keyup.enter="handeInputEnter(item)"
              maxlength="30"
              placeholder="请输入类别名称"
            />
            <template v-else>
              <span class="text-ellipsis">{{ item.moduleName }}</span>
              <el-tooltip placement="top">
                <template #content> 更多</template>
                <el-dropdown @command="handleCommand" trigger="click">
                  <svg-icon name="more" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="(item, index) in sideMoreMenu"
                        :key="index"
                        :command="item.command"
                        :divided="item.divided"
                        :disabled="item.disabled"
                        :icon="item.icon"
                        >{{ item.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </el-tooltip>
            </template>
          </span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="(subItem, subIndex) in item.subList"
            :key="subIndex"
            :index="`${index}-${subIndex}`"
          >
            <div
              class="grandchild-level-items flex-justify-between"
              @click="handeMoreSideClick(subItem)"
            >
              <!--子菜单 新建-编辑-删除-类别 -->
              <el-input
                v-if="subItem.contenteditable"
                v-model="subItem.moduleName"
                placeholder="Please input"
                @change="handeInputMedit(subItem)"
                @keyup.enter="handeInputEnter(item)"
              />
              <template v-else>
                <span class="flex-align-center">
                  <svg-icon name="all" style="margin-right: 4px" />
                  <span class="subItem-text">{{ subItem.moduleName }}</span>
                </span>
                <el-tooltip placement="top">
                  <template #content> 更多</template>
                  <el-dropdown @command="handleCommand" trigger="click">
                    <svg-icon name="more" />
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
              </template>
            </div>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <!-- 单个层级-不包含子集 -->
      <el-menu-item v-else :index="index.toString()">
        <div class="sidebar-text-content flex-align-center" @click="handeMoreSideClick(item)">
          <el-input
            v-if="item.contenteditable"
            @change="handeInputMedit(item)"
            v-model="item.moduleName"
            maxlength="30"
            placeholder="请输入类别名称111"
            @keyup.enter="handeInputEnter(item)"
          />
          <template v-else>
            <span class="groups-text text-ellipsis"> {{ item.moduleName }}</span>
            <el-tooltip placement="top">
              <template #content> 更多</template>
              <el-dropdown @command="handleCommand" trigger="click">
                <svg-icon name="more" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, index) in sideMoreMenu"
                      :key="index"
                      :command="item.command"
                      :divided="item.divided"
                      :disabled="item.disabled"
                      :icon="item.icon"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </template>
        </div>
      </el-menu-item>
    </template>
    <el-input
      v-model="groupingName"
      v-if="showInputType === 2"
      class="news-group-input"
      maxlength="30"
      placeholder="输入分组名称"
      @change="handeInputMedit"
      @keyup.enter="handeInputEnter"
    />
  </el-menu>
</template>

<script setup lang="ts">
  import { ref, onMounted, useAttrs, computed } from 'vue'
  import { Edit, Plus, Delete, ArrowRight } from '@element-plus/icons-vue'
  import {
    addProductModuleList,
    getKindTreeList,
    delKindTreeList,
    updateKindTreeList,
  } from '@/api/modules/product'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useProductStore } from '@/store/modules/product'
  // 透传属性 attrs
  const attrs = useAttrs()
  // 接收父组件传递的参数
  let props = defineProps({
    SideMenuList: {
      type: Array,
      default: () => [],
    },
    SideMenuTitle: {
      type: String,
      default: '排期',
    },
    /*
    需求:0、排期:1、客户:2、基线:3
    */
    moduleKind: {
      type: Number,
      default: 1,
    },
  })
  // 分发事件给父组件
  const emit = defineEmits(['handeSelectMenu', 'handeSideChange'])

  const ProductStore = useProductStore()

  // 侧边菜单的每一行数据
  const SideGroupParms = ref()
  // 类别和分组的标志位
  const showInputType = ref(0)
  // 分组名称
  const groupingName = ref('')
  // 新建分组数据
  const creatMenu = computed(() => {
    return [
      {
        command: 'newsGroup',
        label: `新建分组`,
        icon: ArrowRight,
      },
    ]
  })
  // 新建类别数据
  const sideMoreMenu = computed(() => {
    return [
      {
        command: 'newsType',
        label: '新建类别',
        icon: Plus,
        // disabled: true,
      },
      {
        command: 'sideEdit',
        divided: false,
        label: '编辑',
        icon: Edit,
      },
      {
        command: 'sideDel',
        divided: false,
        label: `删除`,
        icon: Delete,
      },
    ]
  })
  // 类别编辑列表数据
  const chilrenMoreMenu = computed(() => {
    return [
      {
        command: 'sideEdit',
        divided: false,
        label: '编辑',
        icon: Edit,
      },
      {
        command: 'sideDel',
        divided: false,
        label: `删除`,
        icon: Delete,
      },
    ]
  })

  //  菜单激活回调
  const handeSelectMenu = (val: any) => {
    emit('handeSelectMenu', SideGroupParms.value, val)
  }
  //  存储 el-menu-item-group 菜单行数据
  const handeMoreSideClick = (items) => {
    console.log('菜单行数据items', items)
    SideGroupParms.value = items
  }

  //  新建分组、新建类别、编辑分组、编辑类别、
  const handeInputMedit = async (items: any) => {
    event.stopPropagation()
    if (showInputType.value === 1) {
      let addParms = {
        moduleName: items.moduleName,
        moduleType: 0,
        moduleKind: props.moduleKind,
        bindId: ProductStore.productId,
        moduleSuperiorId: SideGroupParms.value.id,
      }
      const { code, data } = await addProductModuleList(addParms)
      if (code === 200 && data) {
        console.log('1类别、', data)
        ElMessage({
          showClose: true,
          message: '类别新增成功',
          type: 'success',
        })
        items.contenteditable = false
        emit('handeSideChange', data)
      }
    } else if (showInputType.value === 2) {
      let addParms = {
        moduleName: groupingName.value,
        moduleType: 0,
        moduleKind: props.moduleKind,
        bindId: ProductStore.productId,
        moduleSuperiorId: '0',
      }
      addParms.moduleType = 1
      const { code, data } = await addProductModuleList(addParms)
      if (code === 200 && data) {
        console.log('2分组、', items)
        ElMessage({
          showClose: true,
          message: '分组新增成功',
          type: 'success',
        })
        groupingName.value = ''
        showInputType.value = 0
        emit('handeSideChange', data)
      }
    } else {
      const { code, data } = await updateKindTreeList(items)
      if (code === 200 && data) {
        ElMessage({
          showClose: true,
          message: '修改成功',
          type: 'success',
        })
        items.contenteditable = false
        emit('handeSideChange', items)
      }
    }
  }

  //  监听回车按键事件，输入框内按下回车键时触发
  const handeInputEnter = (items) => {
    if (items) {
      items.contenteditable = false
    } else {
      showInputType.value = 0
    }
  }

  const handleCommand = (command: string | number | object) => {
    console.log('======', command)
    // 新建类别
    if (command === 'newsType') {
      showInputType.value = 1
      SideGroupParms.value.contenteditable = true
      SideGroupParms.value.moduleName = ''
    }
    // 新建分组
    if (command === 'newsGroup') {
      showInputType.value = 2
    }
    // 编辑类别、分组
    if (command === 'sideEdit') {
      SideGroupParms.value.contenteditable = true
      console.log('编辑分组')
    }
    // 删除分组、删除类别
    if (command === 'sideDel') {
      console.log('调用删除分组接口', SideGroupParms.value)
      ElMessageBox.confirm(
        `${SideGroupParms.value.moduleType ? '确认删除分组吗?' : '确认删除类别吗?'}`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          draggable: true,
        },
      ).then(async () => {
        // 根据ID删除产品模块详情表
        let treeId = SideGroupParms.value.id
        const result = await delKindTreeList(treeId)
        if (result.code === 200 && result.data) {
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
          emit('handeSideChange', SideGroupParms.value, true)
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  .el-menu-vertical-demo {
    cursor: pointer;
    box-sizing: border-box;
    :deep(.el-menu-item-group__title) {
      // padding: 0;
      display: none;
    }
    .sidebar-header {
      padding: 0 20px;
      min-height: 48px;
      align-items: center;
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    }
    .news-group-input {
      margin: 10px 15px;
      box-sizing: border-box;
      width: -webkit-fill-available;
    }
    .el-divider--horizontal {
      margin: 5px 0;
    }
    .sidebar-text-content {
      width: 100%;
      .groups-text {
        width: 74%;
      }
    }
    .el-tooltip__trigger {
      outline: none;
    }
    .el-menu-item {
      height: 36px;
      border-radius: 4px;
      margin: 10px 3px;
      box-sizing: border-box;
      padding-left: 25px !important;
      &:hover {
        background-color: rgb(201, 201, 201) !important;
      }
    }
    .el-sub-menu {
      margin: 10px 3px;
      box-sizing: border-box;
    }
    .is-active {
      //   background: rgba(102, 152, 255, 0.1) !important;
    }
    .el-sub-menu {
      :deep(.el-sub-menu__title) {
        height: 36px;
        line-height: 36px;
        border-radius: 4px;
      }
      :deep(.el-menu--inline) {
        .el-menu-item-group {
          .grandchild-level-items {
            padding-right: 20px;
            width: 100%;
            .subItem-text {
              white-space: nowrap; /* 禁止换行 */
              overflow: hidden; /* 超出部分隐藏 */
              text-overflow: ellipsis; /* 显示省略号 */
              width: 180px;
            }
          }
        }
      }
    }
  }
</style>
