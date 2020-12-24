<template>
  <div class="templateUpload">
    <el-upload
      class="upload-demo"
      drag
      :action="active"
      :file-list="fileList"
      :on-change="handleChange"
      accept=".doc,.docx"
      multiple
    >
      <i class="icon iconfont iconmobanxiazai down"></i>
      <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
      <span class="supportedDocuments">支持扩展名：.doc .docx</span>
    </el-upload>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'


export default ({
  
})
</script>

<style lang="scss" scoped>

</style>