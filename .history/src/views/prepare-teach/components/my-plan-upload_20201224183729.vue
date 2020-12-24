<template>
  <div class="template-upload">
    <el-upload
      drag
      :action="uploadAction"
      :file-list="fileList"
      :on-change='uploadChange'
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
import { reactive, ref, Ref } from 'vue'
import axios from 'axios'
import { AxResponse } from './../../../core/axios';
import { ElMessage } from 'element-plus'


export default ({
  props: {
    id: String
  },
  setup( props, { emit } ) {
    let uploadAction = `${import.meta.env.VITE_APP_BASE_URL}/system/file/uploadFile`
    let fileList: Ref<any[]> = ref([])
    let newFileList= ref([])

    const uploadChange = (file, fileList) => {
      let arr: Ref<any[]> = ref([])
      fileList.map(item => {
        console.log(item.response)
      })
    }

    const save = (resolve, reject) => {
      let __params  = {
        fileList: fileList,
        isPublic: 0,
        courseIndexId: props.id,
        type: 5,
      };
      let res =  axios.post<any, AxResponse>('/admin/material/saveUserMaterial', __params, { headers: { type: 1, 'Content-Type': 'application/json' }}).then(res => {
        if(res.result) {
          resolve();
        }else{
          ElMessage.error(res.msg)
          reject()
        }
      })
    }

    return { uploadAction, newFileList, fileList , save, uploadChange }
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