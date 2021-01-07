<template>
  <div class="header_ref">
    <div class="tabs_box">
      <ul>
        <li v-for="p in classList" :key="p.id" :class="{ active: classType === p.id }" @click="classChange(p.id)">{{ p.name }}</li>
      </ul>
    </div>
    <div class="search" v-if="searchShow == 1">
      <el-input clearable placeholder="按课程名称搜索" prefix-icon="el-icon-search" v-model="searchText" @keydown.enter="searchHandle" @clear="searchHandle" />
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
  props:{
    searchShow:{
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    let classType = ref(1);
    let classList = [ { name: '近期备课', id: 0 }, { name: '全部课程', id: 1 } ];
    const classChange = (e) => { classType.value = e; emit('type-change', e);};
    let searchText = ref(null);
    const searchHandle = () => emit('search', searchText.value);

    return { classType, classList, classChange, searchText, searchHandle }
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