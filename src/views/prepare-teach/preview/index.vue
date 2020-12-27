<template>
  <div class="preview-main">
    <span class="close-img" @click="setClose"><img src="/@/assets/prepare-teach/data-preview/close.png" width="36" alt="爱学标品"></span>
    <div class="operation operation-print" v-if="['jpg','png','jpeg','mp4','mp3'].includes(ext)">
      <el-tooltip class="item" content="打印" placement="left" effect="light">
        <div @click="printData" class="wrap-box">
          <img src="/@/assets/prepare-teach/data-preview/print-icon.png" alt='爱学标品' />
        </div>
      </el-tooltip>
    </div>
    <div class="operation operation-download">
      <el-tooltip class="item" content="下载" placement="left" effect="light">
        <div @click="downloadData" class="wrap-box">
          <img src="/@/assets/prepare-teach/data-preview/dowload-icon.png" alt='爱学标品' />
        </div>
      </el-tooltip>
    </div>
    <div class="iframe-main">
      <img class="center-img" v-if="['jpg','png','jpeg'].includes(ext)" :src="privewPath" alt="爱学标品">
      <video v-if="ext === 'mp4'" controls controlsList="nodownload" :src="privewPath" width="100%" height="100%"></video>
      <video v-if="ext === 'mp3'" controls controlsList="nodownload" name="media" class="mp3-view">
        <source :src="privewPath" type="audio/mpeg">
      </video>
      <!-- <iframe
        allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"
        v-if="['pdf','ppt','pptx','docx','doc'].includes(ext)"
        :src="privewPath365"
        frameborder="0"
        style="width:100%; height:100%;"
      />
      <iframe
        v-if="['zip','rar'].includes(ext)"
        :src="privewPath365"
        frameborder="0"
        style="width:100%; height:100%;"
      /> -->
    </div>
  </div>
</template>

<script lang='ts'>
import { ref } from 'vue'

export default {
  props: {
    dataName: {
      type: String,
      required: false,
    },
    dataPath: {
      type: String,
      required: false,
    },
    ext: {
      type: String,
      required: false,
    }
  },
  setup(props, { emit }) {
    /*---关闭预览---*/
    const setClose = () => {
      emit('sentClose', false)
    }
    /*---下载---*/
    const downloadData = () => {
      let host: any = process.env.VUE_APP_BASE_API
      let a:any = document.createElement('a');
      a.download = props.dataName;
      a.href = host + props.dataPath;
      a.click();
    }
    /*---打印---*/
    const printData = () => {
      window.print()
    }
    /*---获取预览地址---*/
    let privewPath365 = ref('')
    let privewPath = ref('')
    let __protocol = window.location.protocol;
    let __host = window.location.host;
    let __url = process.env.VUE_APP_BASE_API;
    privewPath365.value = `${process.env.VUE_APP_OFFICE_WEB365}/?furl=${__url}${props.dataPath}`;
    privewPath.value = `${__url}${props.dataPath}`

    return { setClose, downloadData, printData, privewPath365, privewPath }
  }
}
</script>

<style lang="scss" scoped>
  .preview-main{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    outline: none;
    .close-img{
      position: absolute;
      right: 24px;
      top: 24px;
      cursor: pointer;
    }
    .operation{
      position: absolute;
      right: 24px;
      bottom: 70px;
      z-index: 9999;
      cursor: pointer;
      .wrap-box{
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .operation-print{
      bottom: 130px;
    }
    .operation-download{
      bottom: 70px;
    }
    .iframe-main {
      outline: none;
      .mp3-view{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 500px;
      }
      .center-img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 80%;
        height: 100%;
      }
      iframe{
        #btmScreen,.btmScreen{
          display: none;
        }
      }
    }
  }
</style>