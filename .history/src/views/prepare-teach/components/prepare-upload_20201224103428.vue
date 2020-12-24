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
    let uploadAction = `${import.meta.env.VITE_APP_BASE_URL}/test/system/file/uploadFile`
    let fileList = ref([])
    let newFileList = ref([])
    // 上传文件时触发
    const handleChange = ( file, fileList ) => {
      let arr = [];
      fileList.map(( item: any ) => {
        if (item.response) {
          arr.push( item.response.json );
        }
    });
    newFileList.value = arr;
    console.log(newFileList.value)
  }

    return { uploadAction, newFileList, fileList, handleChange  }
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