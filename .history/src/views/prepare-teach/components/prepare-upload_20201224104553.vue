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
import axios from 'axios'
import { AxResponse } from './../../../core/axios';


export default ({
  props: {
    id: String
  },
  setup( props ) {
    let uploadAction = `${import.meta.env.VITE_APP_BASE_URL}/test/system/file/uploadFile`
    let fileList = ref([])
    let newFileList = ref([])
    // 上传文件改变时触发
    const handleChange = ( file, fileList ) => {
      let arr = [];
      fileList.map(( item: any ) => {
        if (item.response) {
          arr.push( item.response.json );
        }
      });
      newFileList.value = arr;
    }

    const save = async() => {
      let __params  = {
        fileList: newFileList,
        isPublic: 0,
        courseIndexId: props.id,
        type: 5,
      };
      let res = axios.post<any, AxResponse>('/admin/material/saveUserMaterial', __params);
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