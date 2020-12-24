<template>
  <div class="template-upload">
    <el-upload
      drag
      :action="uploadAction"
      :file-list="uploadFileList"
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
import { reactive, ref } from 'vue'
import axios from 'axios'
import { AxResponse } from './../../../core/axios';


export default ({
  props: {
    id: String
  },
  setup( props, { emit } ) {
    let uploadAction = `${import.meta.env.VITE_APP_BASE_URL}/system/file/uploadFile`
    let uploadFileList = ref([])
    let newFileList: any[]= reactive([])
    // 上传文件改变时触发
    const handleChange = ( file, fileList ) => {
      let arr: any[] = [];
      fileList.map((item: any ) => {
        arr.push(item.raw);
      });
      newFileList = arr;
    }
    
    const save = (resolve, reject) => {
      let __params  = {
        fileList: newFileList,
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

    return { uploadAction, newFileList, uploadFileList, handleChange, save  }
  }
  
})
</script>

<style lang="scss" scoped>
  .template-upload{
    margin: 0 auto;
    width: 70%;
    .supported-documents{
      line-height: 30px;
      color: rgb(96, 98, 102);
    }
  }
</style>