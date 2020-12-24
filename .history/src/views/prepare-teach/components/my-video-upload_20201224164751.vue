<template>
  <div class="template-upload">
    <div class="tab">
      <el-button type='primary'>文件/二维码</el-button>
      <el-button type='primary'>链接</el-button>
    </div>
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
      <span class="supported-documents">支持扩展名：.doc .docx</span>
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
  setup( props, { emit } ) {
    let uploadAction = `${import.meta.env.VITE_APP_BASE_URL}/system/file/uploadFile`
    let fileList = ref([])
    let newFileList = ref([])

    
    const save = (resolve, reject) => {
      let __params  = {
        fileList: newFileList.value,
        isPublic: 0,
        courseIndexId: props.id,
        type: 5,
      };
      let res =  axios.post<any, AxResponse>('/admin/material/saveUserMaterial', __params, { headers: { type: 1, 'Content-Type': 'application/json' }}).then(res => {
        if(res.result) {
          resolve();
        }
      })
    }

    return { uploadAction, newFileList, fileList, save  }
  }
  
})
</script>

<style lang="scss" scoped>
  .template-upload{
    margin: 0 auto;
    width: 70%;
    .tab{
      width: 200px;
      margin: 0 auto;
      margin-left: -20px;
    }
    .supported-documents{
      line-height: 30px;
      color: rgb(96, 98, 102);
    }
  }
</style>