<template>
  <div class="dataPreviewMain">
    <span class="icon iconfont icon-quxiao1beifen2 closeImg" @click="setClose"></span>
    <div class="operation operation_print" v-if="['jpg','png','jpeg','mp4','mp3'].indexOf(ext) === -1">
      <el-tooltip class="item" content="打印" placement="left" effect="light">
        <div @click="printData" class="wrapBox">
          <img src="../../assets/images/dataPreview/printIcon.png" alt />
        </div>
      </el-tooltip>
    </div>
    <div class="operation operation_download">
      <el-tooltip class="item" content="下载" placement="left" effect="light">
        <div @click="downloadData" class="wrapBox">
          <img src="../../assets/images/dataPreview/dowloadIcon.png" alt />
        </div>
      </el-tooltip>
    </div>
    <div class="iframeMain">
      <img class="centerimg" v-if="['jpg','png','jpeg'].indexOf(ext) !== -1" :src="privewPath" alt="">
      <video v-if="ext === 'mp4'" controls controlsList="nodownload" :src="privewPath" width="100%" height="100%"></video>
      <video v-if="ext === 'mp3'" controls controlsList="nodownload" name="media" class="mp3view">
        <source :src="privewPath" type="audio/mpeg">
      </video>
      <iframe
        allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"
        v-if="['pdf','ppt','pptx','docx','doc'].indexOf(ext) !== -1"
        :src="privewPath365"
        frameborder="0"
        style="width:100%; height:100%;"
      />
      <iframe
        v-if="['zip','rar'].indexOf(ext) !== -1"
        :src="privewPath365"
        frameborder="0"
        style="width:100%; height:100%;"
      />
      <!-- 
        http://axxinbiaopin-yanshi.xiaohe.com/test
      -->
    </div>
  </div>
</template>

<script lang="ts">
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
    let privewPath365 = ref('')
    let privewPath = ref('')
    let sendClose = ref(false)
    emit("sendClose",(sendClose) => {})
    const setClose = () => {
      sendClose.value = false
    }

    const downloadData = () => {
      let host: any = process.env.VUE_APP_BASE_API
      let a:any = document.createElement('a');
      a.download = props.dataName;
      a.href = host + props.dataPath;
      a.click();
    }
    const printData = () => {
      window.print()
    }

    let PROTOCOL = window.location.protocol;
    let HOST = window.location.host;
    let BASE_API = process.env.VUE_APP_BASE_API;
    privewPath365.value = `${process.env.VUE_APP_OFFICE_WEB365}/?furl=${BASE_API}${props.dataPath}`;
    privewPath.value = `${BASE_API}${props.dataPath}`

    return { downloadData, printData, privewPath365, privewPath, setClose }
  }
}
</script>


<style lang="scss" scoped>
.dataPreviewMain {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  .iframeMain {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0,0,0,0.8);
    outline: none;
    .mp3view{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 500px;
    }
    .centerimg{
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
  .closeImg{
    position: absolute;
    right: 24px;
    top: 54px;
    z-index: 999;
    cursor: pointer;
    font-size: 36px;
    color: #ffff;
  }
  .operation{
    position: absolute;
    right: 24px;
    bottom: 70px;
    z-index: 9999;
    cursor: pointer;
    .wrapBox{
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      img{
        margin-top: 8px;
        margin-left: 8px;
      }
    }
  }
  .operation_print{
    bottom: 130px;
  }
  .operation_download{
    bottom: 70px;
  }
}
</style>