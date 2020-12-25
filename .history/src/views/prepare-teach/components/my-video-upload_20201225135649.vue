<template>
  <div class="template-upload">
    <div class="tab">
      <el-button :type='ercodeType' @click="ercodeClick">文件/二维码</el-button>
      <el-button :type="urlType" @click="urlClick">链接</el-button>
    </div>
    <div class="upload" v-if="ercodeOrUrl === 'ercode'">
      <el-upload
        drag
        :action="uploadAction"
        :file-list="fileList"
        :on-success="uploadSuccess"
        accept=".mp4,.jpg,.jpeg,.png"
        multiple
      > 
        <i class="el-icon-upload"></i>
        <div>将文件拖到此处，或<em>点击上传</em></div>
        <span class="supported-documents">支持扩展名：.mp4,.jpg,.jpeg,.png</span>
      </el-upload>
    </div>
      <div class="url" v-if="ercodeOrUrl === 'url'">
        <el-input
          type="textarea"
          placeholder="请输入链接"
          v-model="uploadUrlData"
        ></el-input>
      </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from 'vue'
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
    let newFileList: Ref<any[]> = ref([])
    let ercodeType = ref('primary')//二维码类型
    let urlType = ref('text')//链接类型
    let ercodeOrUrl = ref('ercode') //显示隐藏
    let uploadUrlData = ref()//链接框model
    
    // 顶部二维码切换
    const ercodeClick = () => {
      ercodeType.value = 'primary'
      urlType.value = 'text'
      ercodeOrUrl.value = 'ercode'
      uploadUrlData.value = ''
    }
    // 顶部链接切换
    const urlClick = () => {
      ercodeType.value = 'text'
      urlType.value = 'primary'
      ercodeOrUrl.value = 'url'
    }

    // 上传成功回调
    const uploadSuccess = ( response, file, fileList ) => {
      let arr: Ref<any[]> = ref([])
      newFileList.value.push(response.json)
    }
    // 确定保存
    let __params = ref({})
    const save = (resolve, reject) => {
      if(ercodeOrUrl.value === 'ercode'){
         __params.value  = {
          fileList: [{
            oriFilename: "链接",
            filePath: uploadUrlData.value,
          }],
          isPublic: 0,
          courseIndexId: props.id,
          type: 3,
          mediaType: "url",
        };
      } else if(ercodeOrUrl.value === 'url' ) {
        __params.value = {
          fileList: newFileList.value,
          isPublic: 0,
          courseIndexId: props.id,
          type: 5,
        };
      }
      
      let res =  axios.post<any, AxResponse>('/admin/material/saveUserMaterial', __params.value, { headers: { type: 1, 'Content-Type': 'application/json' }}).then(res => {
        if(res.result) {
          ElMessage.success('上传成功')
          resolve(res);
        }else{
          ElMessage.error(res.msg)
          reject()
        }
      })
    }

    return { uploadAction, newFileList, fileList, save, ercodeType, urlType, ercodeClick, urlClick, ercodeOrUrl, uploadUrlData, uploadSuccess }
  }
  
})
</script>

<style lang="scss" scoped>
  .template-upload{
    margin: 0 auto;
    width: 70%;
    .tab{
      width: 300px;
      margin: 0 auto;
      margin-bottom: 20px;
      .el-button{
        text-align: center;
        width: 120px;
      }
    }
    .url{
      min-height: 200px;
    }
    .supported-documents{
      line-height: 30px;
      color: rgb(96, 98, 102);
    }
  }
</style>