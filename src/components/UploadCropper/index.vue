<template>
  <div>
    <el-upload action="/your-upload-api" :show-file-list="false" :on-success="handleSuccess">
      <el-button>点击上传</el-button>
    </el-upload>

    <!-- 图片裁剪弹框 -->
    <el-dialog title="裁剪图片" :visible.sync="dialogVisible">
      <cropper
        ref="cropper"
        :src="imageUrl"
        :autoCropArea="0.8"
        :guides="true"
        :viewMode="2"
        :minCropBoxWidth="100"
        :minCropBoxHeight="100"
      ></cropper>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleCrop">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 展示裁剪后的图片 -->
    <el-image v-if="imageUrl" :src="imageUrl"></el-image>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, computed, watch, watchEffect } from 'vue'
  const dialogVisible = ref(false) // 控制裁剪弹框的显示与隐藏
  const imageUrl = ref() // 存储上传图片的 URL
  const cropper = ref('') // 存储上传图片的 URL

  // 关闭-取消
  const handleSuccess = (response) => {
    imageUrl.value = response.url // 保存上传成功后的图片 URL
    dialogVisible.value = true // 显示裁剪弹框
  }
  const handleCrop = (response) => {
    const cropper = cropper.value // 获取 Cropper 实例
    const croppedImageData = cropper.getCroppedCanvas().toDataURL() // 获取裁剪后的图片数据
    // 调用上传图片的接口，将 `croppedImageData` 作为参数传递给后端
    // ...
    dialogVisible.value = false // 关闭裁剪弹框
  }
</script>

<style scoped></style>
