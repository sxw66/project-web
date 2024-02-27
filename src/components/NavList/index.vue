<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'

  export interface Props {
    steps?: any
    titleIconAlgin?: any
    selectedIndex?: number
  }
  const props = withDefaults(defineProps<Props>(), {
    steps: [],
    selectedIndex: 0,
    titleIconAlgin: '',
  })

  const emit = defineEmits(['selected', 'handeRightIcon', 'handeInputModel'])

  const activeIndex: any = ref(-1)
  const hoverIndex = ref(0)

  const selectIndex = (index: number) => {
    if (activeIndex.value === index) {
      // 点击的是已经高亮的步骤，不做任何处理
      return
    }
    // 切换高亮状态
    activeIndex.value = index
    // 发射事件
    emit('selected', props.steps[index])
  }

  const handeRightIcon = (index: number) => {
    event.stopPropagation()
    emit('handeRightIcon', props.steps[index])
  }
  const handeInputModel = (index: number) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.steps[index].contenteditable = false
    emit('handeInputModel', props.steps[index])
  }
  /*
    计算标题对齐方式
    可选值 around、between
  */
  const computedHeaderClass = computed(() => {
    let classList = []
    const { titleIconAlgin } = props
    if (titleIconAlgin) {
      classList.push(`content-${titleIconAlgin}`)
    }
    return classList.join(' ')
  })

  onMounted(() => {
    if (props.selectedIndex === 0) {
      activeIndex.value = props.selectedIndex
    } else {
      activeIndex.value = props.selectedIndex
    }
  })
</script>

<template>
  <ul class="nav-list" v-for="(step, index) in steps" :key="index">
    <span class="nav-content" :class="computedHeaderClass" v-if="step.title">
      <div class="nav-title">{{ step.title }}</div>
      <svg-icon v-if="step.titleIcon" :name="step.titleIcon" color="#ffcd5d" />
      <slot name="titleRight"></slot>
    </span>
    <li
      :class="{ active: activeIndex === index }"
      @click="selectIndex(index)"
      @mouseenter="hoverIndex = index"
      @mouseleave="hoverIndex = -1"
      :style="{ backgroundColor: hoverIndex === index ? '#f5f5f5' : '' }"
      v-if="step.name"
    >
      <el-input
        v-if="step.contenteditable"
        v-model="step.name"
        @change="handeInputModel(index)"
        placeholder="Please input"
      />
      <template v-else>
        <span class="left-item">
          <svg-icon v-if="step.icon" :name="step.icon" :color="step.iconColor" />
          <span class="text">{{ step.name }}</span>
        </span>
        <el-tooltip
          placement="top"
          v-if="step.rightIcon && hoverIndex === index"
          :content="step.rightTooltip || '更多'"
        >
          <svg-icon
            :name="step.rightIcon"
            :color="step.rightIconColor"
            class="right-icon"
            @click="handeRightIcon(index)"
          />
        </el-tooltip>
        <slot name="rightMore"></slot>
      </template>
    </li>
    <slot></slot>
  </ul>
</template>

<style lang="scss" scoped>
  .nav-list {
    list-style: none;
    padding: 0;
    font-size: 12px;
    box-sizing: border-box;
    .content-between {
      justify-content: space-around;
      margin: 0 9px !important;
    }
    .content-between {
      justify-content: space-between;
      margin: 0 9px !important;
    }
    .nav-content {
      display: flex;
      align-items: center;
      margin: 0 4px;
      .nav-title {
        color: #999;
        padding: 5px 8px;
        height: 28px;
        line-height: 28px;
        font-size: 13px;
      }
    }

    li {
      padding: 10px;
      cursor: pointer;
      border-radius: 4px;
      margin: 5px 10px;
      flex-grow: 1;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      &.active {
        background: rgba(102, 152, 255, 0.1) !important;
        .left-item {
          .text {
            color: #6698ff;
          }
          .svg-icon {
            color: #6698ff;
          }
        }
      }
      .svg-icon {
        margin-right: 8px;
      }
      .left-item {
        display: flex;
        align-items: center;
        .text {
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
        }
      }
      .el-tooltip__trigger {
        outline: none;
      }
    }
  }
</style>
