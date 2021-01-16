<template>
  <div class="header_ref">
    <div class="tabs_box">
      <ul>
        <li v-for="p in typeList" :key="p.id" :class="{ active: type === p.id }" @click="classChange(p.id)">{{ p.name }}</li>
      </ul>
    </div>
    <div class="btns">
      <el-button round @click="showRule = true">查看规则</el-button>
      <el-popover :width="300" trigger="hover" >
        <div class="tmpt-type">
          <div @click="download('http://axxinbiaopin.xiaohe.com/test/upload/语文v1.1的副本.docx')"><span>语文模板</span><img src="/src/assets/record/icon-1.png" alt="语文模板"></div>
          <div @click="download('http://axxinbiaopin.xiaohe.com/test/upload/数学v1.1.docx')"><span>数学模板</span><img src="/src/assets/record/icon-2.png" alt="数学模板"></div>
          <div @click="download('http://axxinbiaopin.xiaohe.com/test/upload/英语v1.1.docx')"><span>英语模板</span><img src="/src/assets/record/icon-3.png" alt="英语模板"></div>
        </div>
        <template #reference><el-button round>下载模板</el-button></template>
      </el-popover>
      <el-button round @click="$refs.uploadRef.click()" :loading="uploadLoading">
        <span>上传文件</span>
        <input type="file" ref="uploadRef" @change="upload" multiple accept=".docx,.doc,.pdf">
      </el-button>
    </div>
    <div class="rule-box" v-show="showRule" @click="showRule = false">
      <div @click.stop><img src="/src/assets/import-rule.png" alt="爱学标品导入规则"></div>
      <i class="el-icon-close" @click="showRule = false" />
    </div>
  </div>


</template>
<script lang="ts">
import { ref } from 'vue';
import emitter from './../../../utils/mitt';
import Modal from './../../../utils/modal';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import { useStore } from 'vuex';

export default {
  emits: ['type-change', 'reset'],
  setup(props, { emit }) {
    let store = useStore();

    let type = ref(null);
    let typeList = [ { name: '批量录入', id: null }, { name: '第三方录入', id: 1 } ];
    const classChange = (e) => { type.value = e; emit('type-change', e) };

    let showRule = ref(false);

    const download = (url) => window.open(url);

    let uploadRef = ref();
    let uploadLoading = ref(false);
    const upload = async () => {
      let files: File[] = Array.from(uploadRef.value.files);
      uploadRef.value.value = '';
      let accept = ['pdf', 'doc', 'docx', 'pptx'];
      files.filter(file => {
        let idx = file.name.lastIndexOf('.')
        let ext = file.name.substr(idx + 1);
        return accept.includes(ext);
      });
      if (files.length) {
        uploadLoading.value = true;
        let uploadList: any[] = await Promise.all(files.map(file => {
          let formdata = new FormData();
          formdata.append('file', file);
          return axios.post('/system/file/uploadFile', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
        }))
        uploadList.map(res => ({ name: res.json.oriFilename, url: res.json.filePath }))
        let result = ( await Promise.all(uploadList.map(file => axios.post<null, AxResponse>('/tiku/question/importWordQuestions', {
          path: file.json.filePath,
          fileName: file.json.oriFilename,
          subjectId: store.getters.subject.code
        }))) ).reduce((msg, i) => {
          i.result ? (msg.reset = true) : (msg.result = false, msg.message = i.msg);
          return msg;
        }, { result: true, message: '导入试题成功', reset: false } );
        result.reset && emit('reset');
        ElMessage[result.result ? 'success' : 'warning'](result.message);
        uploadLoading.value = false;
      } else {
        ElMessage.warning(`请选择指定${accept.join('、')}格式文件`);
      }
    }

    return { type, typeList, classChange, showRule, download, uploadRef, upload, uploadLoading }
  }
}
</script>
<style lang="scss" scoped>
.header_ref {
  display: flex;
  line-height: 60px;
  .tabs_box {
    li {
      float: left;
      padding: 0 20px;
      color: #fff;
      list-style: none;
      position: relative;
      cursor: pointer;
      &.active::after {
        content: '';
        display: block;
        width: 100%;
        height: 6px;
        background: #FAAD14;
        border-radius: 3px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .btns {
    margin-left: auto;
    button {
      color: #1AAFA7;
      padding: 10px 20px;
      margin-left: 18px;
      input {
        display: none;
      }
      &:last-child {
        color: #fff;
        border-color: #FAAD14;
        background: #FAAD14;
      }
    }
  }
}
.rule-box {
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: .5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  & > div {
    max-width: 100%;
    width: 1000px;
    max-height: 80%;
    background: #fff;
    overflow: auto;
    border-radius: 6px;
    img {
      width: 100%;
    }
  }
  .el-icon-close {
    display: block;
    width: 40px;
    height: 40px;
    color: #fff;
    font-size: 30px;
    line-height: 40px;
    text-align: center;
    position: absolute;
    top: 40px;
    right: 40px;
    border-radius: 50%;
    border: 2px solid #fff;
    cursor: pointer;
  }
}
.tmpt-type {
  padding: 10px;
  div {
    padding-left: 42px;
    font-size: 24px;
    line-height: 80px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    &:nth-child(1) {
      background: #FFECE6;
    }
    &:nth-child(2) {
      background: #E9F7F7;
    }
    &:nth-child(3) {
      background: #F6F4FF;
    }
    &:active {
      color: #999;
    }
    img {
      width: 138px;
      position: absolute;
      top: 14px;
      right: 0;
    }
  }
}
</style>
