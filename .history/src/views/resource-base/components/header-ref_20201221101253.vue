<template>
  <div class="header_ref">
    <div class="tabs_box">
      <ul>
        <li v-for="p in classList" :key="p.id" :class="{ active: classType === p.id }" @click="classChange(p.id)">{{ p.name }}</li>
      </ul>
    </div>
    <div class="search">
      <el-input clearable placeholder="按题干搜索" prefix-icon="el-icon-search" v-model="searchText" @keydown.enter="searchHandle" />
    </div>
    <div class="btns">
    
     <el-dropdown split-button  @click="handleClick">
        <label for="paperUploadBtn">
          <span>上传试卷</span>
          <input type="file" ref="uploadRef" id="paperUploadBtn" @change="upload" multiple accept=".docx,.doc,.pdf">
        </label>
     </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from 'vue';
import emitter from '../../../utils/mitt';
import Modal from '../../../utils/modal';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { AxResponse } from '../../../core/axios';

export default {
  setup(props, { emit }) {
    let classType = ref(null);
    let classList = [ { name: '资料库', id: null },  ];
    const classChange = (e) => { classType.value = e; emit('type-change', e) };

    let searchText = ref(null);
    const searchHandle = () => emit('search', searchText);

    let queryClass = {};
    emitter.on('queryClass', (e) => queryClass = e)



    let uploadRef = ref();
    const upload = () => {
      let files: File[] = Array.from(uploadRef.value.files);
      uploadRef.value.files
      let accept = ['pdf', 'doc', 'docx', 'pptx']
      files.filter(file => {
        let idx = file.name.lastIndexOf('.')
        let ext = file.name.substr(idx + 1);
        return accept.includes(ext);
      });
      
    }

    return { classType, classList, classChange, searchText, searchHandle,  uploadRef, upload }
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
  .search {
    margin-left: auto;
    :deep(.el-input__prefix),
    :deep(.el-input__suffix) {
      color: #fff !important;
    }
    :deep(input) {
      width: 240px;
      height: 36px;
      color: #fff;
      border: 0;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.3);
      &::placeholder {color: #fff;}
    }
  }
  .btns {
    margin-left: 30px;
    button {
      color: #1AAFA7;
      padding: 10px 23px;
      label {
        cursor: pointer;
      }
      input {
        display: none;
      }
    }
  }
}
</style>