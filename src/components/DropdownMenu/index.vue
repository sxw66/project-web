<template>
  <!-- 公共下拉选择器 -->
  <div class="public-dropdown flex-align-center">
    <el-dropdown @command="handleCommand" :trigger="trigger" v-bind="attrs">
      <slot name="dropdownTrigger" v-if="$slots.dropdownTrigger"></slot>
      <el-button :type="baseButtonType" :icon="baseButtonIcon" :text="text" v-else>
        <span class="dropdown-text">{{ label }}</span>
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu v-if="showDropdownMenu">
          <template v-if="dropdownType === 'menuIcon'">
            <div style="padding: 15px 20px">
              <el-tooltip
                :content="headeMenus.tooltip"
                v-for="headeMenus in dropdownHeadList"
                :key="headeMenus.tooltip"
              >
                <el-button text @click="handleHeadMenus(headeMenus.tooltip)">
                  <!-- 自定义svg类型 -->
                  <svg-icon v-if="headeMenus.svgIcon" :name="headeMenus.svgIcon" color="#ccc" />
                  <!-- el-icon类型 -->
                  <el-icon v-else size="18">
                    <component :is="headeMenus.elIcon" />
                  </el-icon>
                </el-button>
              </el-tooltip>
            </div>
            <div class="header-dropdown">
              <el-dropdown-item
                v-for="(item, index) in moreMenu"
                :key="index"
                :command="item.command"
                :divided="item.divided"
                :icon="item.icon"
                :disabled="item?.disabled"
                >{{ item.label }}</el-dropdown-item
              >
            </div>
          </template>
          <template v-else>
            <el-input
              v-model="input"
              clearable
              :prefix-icon="Search"
              class="dropdown-menus-input"
              placeholder="请输入"
            >
              <template #append>
                <el-button :icon="Setting" @click="handeSetting" />
              </template>
            </el-input>
            <div class="seacrh-dropdown">
              <el-dropdown-item
                v-for="(item, index) in moreMenu"
                :key="index"
                :command="item.command"
                :divided="item.divided"
                :icon="item.icon"
                :disabled="item?.disabled"
                style="padding: 10px 20px"
              >
                <el-tag :key="item.label" :type="item.type" effect="light" round>
                  {{ item.label }}
                </el-tag>
              </el-dropdown-item>
            </div>
          </template>
        </el-dropdown-menu>
        <el-dropdown-menu v-else>
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
    <el-divider v-if="sideDivider" direction="vertical" />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, useAttrs } from 'vue'
  import {
    ArrowDown,
    Search,
    Setting,
    Delete,
    CollectionTag,
    Link,
    CopyDocument,
    ArrowRight,
    Download,
  } from '@element-plus/icons-vue'
  const props = defineProps({
    // 基础下拉菜单-当为基础下拉时标题
    label: {
      type: String,
      required: false,
    },
    // 基础下拉菜单-当为基础下拉时按钮类型
    baseButtonType: {
      type: String,
      default: 'primary',
    },
    // 基础下拉菜单-当为基础下拉时按钮icon
    baseButtonIcon: {
      type: String,
      default: '',
    },
    // 基础下拉菜单-当为基础下拉时是否展示文字类型
    text: {
      type: Boolean,
      default: false,
    },
    // 基础下拉菜单-当为基础下拉时是否展示末尾分隔符
    sideDivider: {
      type: Boolean,
      default: false,
    },
    // 下拉菜单的触发方式
    trigger: {
      type: String,
      default: 'click',
    },
    // 下拉菜单的数据源
    items: {
      type: Array,
      default: () => [],
    },
    // 下拉菜单的类型
    dropdownType: {
      type: String,
      default: '',
      // 1.头部menuIcon类型
      // 2.menuSearch可搜索类型
    },
    // 可搜索下拉菜单-当为可搜索下拉时头部类型数据
    dropdownHeadList: {
      type: Array,
      default: () => [
        { elIcon: CollectionTag, tooltip: '复制编号' },
        { elIcon: Link, tooltip: '复制连接' },
        { elIcon: CopyDocument, tooltip: '复制' },
        { elIcon: ArrowRight, tooltip: '移动' },
        { elIcon: Download, tooltip: '归档' },
        { elIcon: Delete, tooltip: '删除' },
      ],
    },
  })
  // 透传属性 attrs
  const attrs = useAttrs()
  // 分发事件给父组件
  const emit = defineEmits(['command', 'handeSideChange', 'handeSetting', 'handleHeadMenus'])

  const input = ref('')

  // 计算当前下拉的类型
  const showDropdownMenu = computed(() => {
    return props.dropdownType === 'menuIcon' || props.dropdownType === 'menuSearch'
  })

  // 数据源
  const moreMenu = computed(() => {
    if (input.value) {
      return props.items.filter((option) => option.label.includes(input.value))
    } else {
      return props.items
    }
  })

  // 点击头部菜单列表
  const handleHeadMenus = (label) => {
    emit('handleHeadMenus', label)
  }

  // 点击后缀设置
  const handeSetting = () => {
    emit('handeSetting')
  }

  // 切换dropdown
  const handleCommand = (command: string | number | object) => {
    const selectedItem = props.items.find((item) => item.command === command)
    emit('command', selectedItem)
  }
</script>

<style lang="scss" scoped>
  .public-dropdown {
    box-sizing: border-box;
    .dropdown-text {
      font-size: 16px;
    }
    :deep(.el-dropdown) {
      .el-tooltip__trigger {
        outline: none;
      }
    }
    .el-divider--vertical {
      margin: 0 16px;
    }
  }
  .header-dropdown {
    max-height: 380px;
    min-height: 100px;
    overflow-y: auto;
  }
  .seacrh-dropdown {
    max-height: 280px;
    min-height: 60px;
    overflow-y: auto;
  }
  .dropdown-menus-input {
    width: 260px;
    display: flex;
    padding: 20px 20px 10px;
  }
</style>
