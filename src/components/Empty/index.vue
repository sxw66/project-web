<!-- 空状态-组件-->
<template>
  <el-empty :image="image" :image-size="imageSize" :description="description">
    <template #default>
      <slot name="default"></slot>
    </template>
  </el-empty>
</template>

<script lang="ts" setup>
  import emptyImg from './img/empty.png'

  export interface Props {
    image?: string // 图片地址
    imageSize?: number // 图片大小（宽度）
    description?: string // 描述
  }

  const props = withDefaults(defineProps<Props>(), {
    image: emptyImg,
    imageSize: 180,
    description: '暂无数据',
  })
</script>
