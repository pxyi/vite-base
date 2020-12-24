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
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
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