<template>
  <div class="templateUpload">
    <el-upload
      class="upload-demo"
      drag
      :action="uploadAction"
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
  setup() {
    let uploadAction = `${process.env.VUE_APP_BASE_API}/system/file/uploadFile`

    console.log(uploadAction)
    return { uploadAction }
  }
  
})
</script>

<style lang="scss" scoped>
  .templateUpload{
    margin: 0 auto;
    width: 70%;
    .supportedDocuments{
      line-height: 30px;
      color: rgb(96, 98, 102);
    }
  }
</style>