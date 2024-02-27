<template>
  <div class="app-container">
    <div class="flex project-box">
      <div class="left">
        <nav-list :steps="steps" @selected="handeSelected" @handeRightIcon="cancleStar" />
      </div>
      <div class="right">
        <PropTable
          :loading="loading"
          @addNew="handleAdd"
          @handeFormChange="handeFormChange"
          @cell-click="handeCellClick"
          @cell-dblclick="handeCellDblClick"
          @current-page="handleCurrentChange"
          @size-change="handleSizeChange"
          :tableTitle="selectedName"
          :columns="columnList"
          :data="tableData"
          :border="false"
        >
          <!-- 表头筛选 -->
          <template v-slot:filtrate>
            <!-- 项目总数量 -->
            <span class="filtrate-text">{{ tableData.length + totalTitle }}</span>
          </template>
          <template v-slot:projectName="{ row }">
            <div class="head-product">
              <svg-icon
                :name="row?.iconName || ''"
                :color="row?.projectColor || ''"
                style="margin-right: 8px"
              />
              <span>{{ row.projectName }}</span>
            </div>
          </template>
          <template v-slot:iconShow="{ row }">
            <el-tooltip placement="top" v-if="row.isStar === 1">
              <template #content> 取消星标</template>
              <svg-icon
                @click="handeStarTarget(row, 0)"
                name="check-target"
                color="#ffcd5d"
                style="margin-right: 25px"
              />
            </el-tooltip>
            <el-tooltip placement="top" v-else>
              <template #content> 星标</template>
              <svg-icon
                @click="handeStarTarget(row, 1)"
                name="star-target"
                style="margin-right: 25px"
              />
            </el-tooltip>
            <el-tooltip placement="top">
              <template #content> 新窗口打开 </template>
              <svg-icon name="wicket" @click="handeOpenWindow" style="margin-right: 25px" />
            </el-tooltip>
            <el-tooltip placement="top">
              <template #content> 更多</template>
              <el-dropdown @command="handleCommand" trigger="click">
                <svg-icon name="more" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, index) in moreMenu"
                      :key="index"
                      :command="item.command"
                      :divided="item.divided"
                      :icon="item.icon"
                      :disabled="item?.disabled"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </template>
          <template v-slot:iconMore="{ row }">
            <el-tooltip placement="top" v-if="row.iconMore">
              <template #content> 更多</template>
              <el-dropdown @command="handleCommand" trigger="click">
                <svg-icon name="more" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="(item, index) in tableFilterListA"
                      :key="index"
                      :command="item.command"
                      :divided="item.divided"
                      :icon="item.icon"
                      :disabled="item?.disabled"
                      >{{ item.label }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-tooltip>
          </template>
          <template v-slot:fromType="{ row }">
            <el-tag :type="row.fromType === 0 ? 'success' : 'danger'">
              {{ row.fromType === 0 ? '组织' : '团队' }}
            </el-tag>
          </template>
          <template v-slot:isPrivate="{ row }">
            <el-tag :type="row.fromType === 0 ? 'success' : 'danger'">
              {{ row.fromType === 0 ? '私有' : '公开' }}
            </el-tag>
          </template>
        </PropTable>
      </div>
      <!-- 新建项目 -->
      <CreateProject
        v-model:isShow="projectVisible"
        :title="btnText === '新建项目' ? '新建项目' : '新建项目集'"
        @submit="handleSubmit"
      ></CreateProject>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, onMounted, computed, defineAsyncComponent } from 'vue'
  import { parseTime } from '@/utils/index.ts'
  import { useRouter } from 'vue-router'
  import { projectPage, getStarsList, updateProject } from '@/api/modules/project.ts'
  import { typepeList, moreMenu, tableFilterListA } from '@/utils/public-data'
  import { columnInitial, columnItemSet, columnItemSizer } from '@/utils/table-column-list'
  import { ElNotification } from 'element-plus'
  import { useProjectStore } from '@/store/modules/project'

  // 异步加载组件
  const CreateProject = defineAsyncComponent(() => import('./add.project.vue'))
  const ProjectStore = useProjectStore()

  const Router = useRouter()
  const loading = ref(true)
  const btnText = ref('新建项目')
  const selectedName: any = ref('全部项目')
  const tableParams: any = reactive({
    pageNum: 1,
    pageSize: 10,
    projectType: 0,
    projectKind: null,
    isStar: null,
    projectName: '',
    fromType: null,
    projectStatus: '', // 项目状态 0:正常 1:预警 2:延期
  })
  const total = ref(0)
  const steps = ref([])
  const tableData = ref([])
  const totalTitle = ref('个项目')
  // 项目表头
  const columnList: any = ref(columnInitial)

  const projectVisible = ref(false)
  // 侧边菜单列表选择的数据
  const handeSelected = (items: any) => {
    console.log('侧边菜单列表选择的数据', items.name)
    selectedName.value = items.name
    switch (items.name) {
      case '全部项目':
        tableParams.fromType = ''
        columnList.value = columnInitial
        break
      case '组织项目':
        tableParams.fromType = 0
        columnList.value = columnInitial
        break
      case '团队项目':
        tableParams.fromType = 1
        columnList.value = columnInitial
        break
      case '项目集':
        totalTitle.value = '个项目集'
        tableParams.projectType = 1
        columnList.value = columnItemSet
        break
      case '筛选器':
        totalTitle.value = '个筛选器'
        tableParams.projectType = 2
        columnList.value = columnItemSizer
        break
      case '配置中心':
        Router.push('/admin')
        break
    }
    // 点击了星标的tabs
    if (items.id) {
      handleProjectKind(items)
      console.log('items.id', items)
    }
    getProjectList()
    // // 项目 | 项目集 | 筛选器
    // btnText.value = '新建项目'
    // columnList.value = columnPro.value
    // // 左边栏选择情况
    // switch (items.name) {
    //   case '全部项目':
    //     tableParams.fromType = ''
    //     break
    //   case '组织项目':
    //     tableParams.fromType = 0
    //     break
    //   case '团队项目':
    //     tableParams.fromType = 1
    //     break
    //   case '项目集':
    //     btnText.value = '新建项目集'
    //     columnList.value = columnSet.value
    //     tableParams.fromType = ''
    //     tableParams.projectType = 1
    //     break
    //   case '筛选器':
    //     btnText.value = '新建筛选器'
    //     columnList.value = columnFilter.value
    //     break
    // }
  }

  // 左侧星标列表的icon点击事件
  const cancleStar = (items: any) => {
    handeStarTarget(items, 0)
  }

  // 当某个单元格被点击时会触发该事件
  const handeCellClick = async (row, column) => {
    console.log('当某个单元格被点击时会触发该事件', row)
    // await ProjectStore.handleSetProjectId(row.id)
  }

  // 表格列表-当某个单元格被双击击时会触发该事件
  const handeCellDblClick = async (row, column) => {
    // 项目类型 0:Scrum项目 1:Knaban项目 2:瀑布项目
    handleProjectKind(row)
  }

  // 新建项目
  const handleAdd = () => {
    if (selectedName.value === '筛选器') {
      // 新增筛选器
    } else {
      projectVisible.value = true
    }
  }

  // 表格头部搜索框
  const handeFormChange = (items: any) => {
    console.log('items', items)
    tableParams.projectName = items.projectName
    tableParams.projectType = items.projectType
    if (items.productTarget === '星标') {
      tableParams.isStar = 1
    } else {
      tableParams.isStar = ''
    }
    // 项目集 类型切换  0:正常 1:预警 2:延期
    if (items.projectStatus === '全部') {
      tableParams.projectStatus = ''
    }
    if (items.projectStatus === '正常') {
      tableParams.projectStatus = 0
    }
    if (items.projectStatus === '预警') {
      tableParams.projectStatus = 1
    }
    if (items.projectStatus === '延期') {
      tableParams.projectStatus = 2
    }
    getProjectList()
  }

  const handleCurrentChange = (val: any) => {
    tableParams.pageNum = val
    getProjectList()
  }
  const handleSizeChange = (val: number) => {
    tableParams.pageNum = 1
    tableParams.pageSize = val
    getProjectList()
  }
  // 获取列表数据
  const getProjectList = async () => {
    await projectPage(tableParams).then((res) => {
      if (res.code === 200) {
        res.data?.records.map((item) => {
          item.createTime = parseTime(item.createTime, '{m}-{d} {h}:{i}')
          item.startTime = parseTime(item.startTime, '{y}年{m}月{d}日')
          item.endTime = parseTime(item.endTime, '{y}年{m}月{d}日')
          item.updateTime = parseTime(item.updateTime, '{y}年{m}月{d}日')
          item.iconName = typepeList[item.projectKind].iconName
        })
        tableData.value = res.data?.records
        total.value = res.data.total
        loading.value = false
      }
    })
  }
  // 获取所有星标列表
  const getStarList = async (index) => {
    try {
      steps.value = [
        {
          title: '项目',
          name: '全部项目',
          icon: 'borrow',
          iconColor: '#6698ff',
        },
        {
          name: '组织项目',
          icon: 'take-over',
          iconColor: '#73d897',
        },
        {
          name: '团队项目',
          icon: 'synchronous',
          iconColor: '#5dcfff',
        },
        {
          title: '工作',
          name: '项目集',
          icon: 'gather',
          iconColor: '#ff7575',
        },
        {
          name: '筛选器',
          icon: 'filters',
          iconColor: '#f6c659',
        },
        {
          title: '配置',
          name: '配置中心',
          icon: 'configCenter',
          iconColor: '#6698ff',
        },
      ]
      const res = await getStarsList()
      if (res.code === 200) {
        // 只有在取消星标时展示公告
        if (!index) {
          ElNotification({
            position: 'bottom-left',
            message: '取消星标成功',
            type: 'success',
            duration: 2000,
          })
        }
        let starArr = res.data.map((item) => ({
          name: item.projectName,
          iconColor: item.projectColor,
          icon: 'product',
          id: item.id,
          projectKind: item.projectKind,
          rightIcon: 'check-target',
          rightIconColor: 'ffcd5d',
          rightTooltip: '取消星标',
        }))
        if (starArr.length) {
          starArr.unshift({
            titleIcon: 'check-target',
            title: '星标',
          })
        }
        steps.value = steps.value.concat(starArr)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }
  // 选择星标-取消星标
  const handeStarTarget = async (row, i) => {
    let rowParms = {
      id: row.id,
      isStar: i,
    }
    // 更新
    await updateProject(rowParms).then(async (res) => {
      if (res.code === 200) {
        if (res.data) {
          // 获取选中的星标列表
          getStarList(i)
          // 分页查询产品基础信息表
          getProjectList()
        }
      }
    })
  }
  // 新窗口打开
  const handeOpenWindow = () => {
    let routeUrl = Router.resolve({
      path: 'management/details',
      query: { id: 96 },
    })
    // window.open(routeUrl.href, '_blank')
    window.open('', '_blank')
  }
  // 个人中心切换
  const handleCommand = (command: string | number | object) => {
    // console.log('======', command)
  }
  // 新建成功刷新列表
  const handleSubmit = () => {
    getProjectList()
  }
  // 公共的页面跳转
  const handleProjectKind = (row) => {
    ProjectStore.handleSetProjectId(row.id)
    let arr = []
    if (row.projectKind === 0) {
      arr = [
        { name: '概览', url: '/project/detail/baseInfo' },
        { name: '规划', url: '/project/detail/plan' },
        { name: '看板', url: '/project/detail/board' },
        { name: '工作项', url: '/project/detail/workItem' },
        { name: '发布', url: '/project/detail/publish' },
        { name: '基线', url: '/project/detail/basic' },
        { name: '测试', url: '/project/detail/testInfo' },
        { name: '页面', url: '/project/detail/pageInfo' },
        { name: '资源', url: '/project/detail/resource' },
        { name: '报表', url: '/project/detail/statement' },
      ]
    } else if (row.projectKind === 1) {
      arr = [
        { name: '概览', url: '/project/detail/baseInfo' },
        { name: '规划', url: '/project/detail/plan' },
        { name: '需求', url: '/project/detail/demand' },
        { name: '缺陷', url: '/project/detail/flaw' },
        { name: '迭代', url: '/project/detail/iteration' },
        { name: '发布', url: '/project/detail/publish' },
        { name: '基线', url: '/project/detail/basic' },
        { name: '测试', url: '/project/detail/testInfo' },
        { name: '页面', url: '/project/detail/pageInfo' },
        { name: '资源', url: '/project/detail/resource' },
        { name: '报表', url: '/project/detail/statement' },
      ]
    } else if (row.projectKind === 2) {
      arr = [
        { name: '概览', url: '/project/detail/baseInfo' },
        { name: '规划', url: '/project/detail/plan' },
        { name: '里程碑', url: '/project/detail/milestone' },
        { name: '交付物', url: '/project/detail/deliverable' },
        { name: '工作项', url: '/project/detail/workItem' },
        { name: '需求', url: '/project/detail/demand' },
        { name: '缺陷', url: '/project/detail/flaw' },
        { name: '发布', url: '/project/detail/publish' },
        { name: '基线', url: '/project/detail/basic' },
        { name: '测试', url: '/project/detail/testInfo' },
        { name: '页面', url: '/project/detail/pageInfo' },
        { name: '资源', url: '/project/detail/resource' },
      ]
    }
    ProjectStore.handleSetProjectTabs(arr)
    Router.push('detail/baseInfo')
  }

  onMounted(() => {
    getProjectList()
    getStarList(1)
  })
</script>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .project-box {
    height: 100%;

    .left {
      width: 240px;
      background-color: #fbfbfb;
      box-sizing: border-box;
      border-right: 1px solid #eee;
    }

    .right {
      width: 100%;
      background: #fff;
      .el-tooltip__trigger {
        outline: none;
      }
      .filtrate-text {
        color: #999;
        margin-left: 15px;
      }
      .head-product {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
