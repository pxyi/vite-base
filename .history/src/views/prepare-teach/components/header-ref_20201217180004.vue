<template>
  <div class="header_ref">
    <div class="tabs_box">
      <ul>
        <li 
        v-for="(item,index) in classList" 
        :key="item.id" 
        :class="{ active: classType === item.id }" 
        @click="classChange(item,index)">
        {{item.name}}</li>
      </ul>
    </div>
    <div class="search">
      <el-input clearable placeholder="按课程名称搜索" prefix-icon="el-icon-search" v-model="searchText" @keydown.enter="searchHandle" />
    </div>
  </div>
</template>
<script lang="ts">
import { ref } from 'vue';
import OrganizingPapers from './organizing-papers.vue';
import emitter from './../../../utils/mitt';
import Modal from './../../../utils/modal';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';

export default {
  setup(props, { emit }) {
    let classType = ref(null);
    let classList = [ { name: '近期备课', id: null }, { name: '全部课程', id: 2 } ];
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
      if (!files.length) {
        ElMessage.warning(`请选择指定${accept.join('、')}格式文件`);
      } else {
        Modal.create({ title: '上传试卷', width: 480, component: OrganizingPapers, props: { queryClass, files } });
      }
    }

    return { classType, classList, classChange, searchText, searchHandle, uploadRef, upload }
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
}
</style>