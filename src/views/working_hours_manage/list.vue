<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const Router = useRouter()
  const selectedName: any = ref('全部空间')
  const steps = [
    {
      title: '空间',
      name: '全部空间',
      icon: 'all-product',
      iconColor: '#6698ff',
    },
    {
      name: '组织空间',
      icon: 'product',
      iconColor: '#73d897',
    },
    {
      name: '团队空间',
      icon: 'search-enter',
      iconColor: '#5dcfff',
    },
    {
      name: '个人空间',
      icon: 'sidebar-menu',
      iconColor: '#ee6723',
    },
    {
      title: '页面',
      name: '最近访问',
      icon: 'all-product',
      iconColor: '#6698ff',
    },
    {
      name: '与我共享',
      icon: 'sidebar-menu',
      iconColor: '#6698ff',
    },
    {
      name: '我的收藏',
      icon: 'search-enter',
      iconColor: '#6698ff',
    },
  ]
  const tableData = ref([
    {
      org: '指挥官',
      time: '2022-12',
      iconShow: false,
      identification: 'TEST',
      area: '组织',
    },
    {
      org: '产品测试',
      time: '2023-10',
      iconShow: false,
      identification: 'TEST1',
      area: '组织2',
    },
    { org: '示例产品', time: '2023-10', iconShow: false, identification: 'TEST2' },
  ])
  const columnList = ref([
    {
      name: 'org',
      label: '空间',
      width: 200,
      sortable: true,
    },
    {
      name: 'iconShow',
      label: '',
      slot: true,
    },
    {
      name: 'identification',
      label: '标识',
      sortable: true,
    },
    {
      name: 'area',
      label: '所属',
      sortable: true,
    },
    {
      name: 'time',
      label: '时间',
      sortable: true,
    },
  ])
  // 侧边菜单列表选择的数据
  const handeSelected = (items: any) => {
    console.log('侧边菜单列表选择的数据', items)
    selectedName.value = items.name
  }
  // 搜索类别选择
  const handeChange = (index: any) => {
    console.log('index单选', index)
  }
  // 当单元格 hover 进入时会触发该事件
  const handeMouseEnter = (row: any) => {
    console.log('当单元格 hover 进入时会触发该事件', row)
    row.iconShow = true
  }
  // 当单元格 hover 退出时会触发该事件
  const handeMouseLeave = (row: any) => {
    console.log('当单元格 hover 退出时会触发该事件', row)
    row.iconShow = false
  }
  // 当某个单元格被点击时会触发该事件
  const handeCellClick = (row: any) => {
    console.log('当某个单元格被点击时会触发该事件', row)
    Router.push('manage/edit')
  }
</script>

<template>
  <div class="app-container">
    <div class="flex knowledge-box">
      <div class="left">
        <nav-list :steps="steps" @selected="handeSelected" />
      </div>
      <div class="right">
        <CommonTable
          @handeRadioChange="handeChange"
          @cell-mouse-enter="handeMouseEnter"
          @cell-mouse-leave="handeMouseLeave"
          @cell-click="handeCellClick"
          :data="tableData"
          :productTitle="selectedName"
          :columns="columnList"
          row-key="id"
        >
          <template v-slot:iconShow="{ row }">
            <div v-if="row.iconShow">
              <el-tooltip placement="top">
                <template #content> 星标</template>
                <svg-icon name="image-load-fail" style="margin-right: 25px" />
              </el-tooltip>
              <el-tooltip placement="top">
                <template #content> 星标2</template>
                <svg-icon name="toolbar-collapse" style="margin-right: 25px" />
              </el-tooltip>
              <el-tooltip placement="top">
                <template #content> 星标3</template>
                <svg-icon name="sidebar-breadcrumb" style="margin-right: 25px" />
              </el-tooltip>
            </div>
          </template>
        </CommonTable>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .flex {
    display: flex;
  }

  .knowledge-box {
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
    }
  }
</style>
