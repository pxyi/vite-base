<template>
  <div class="header_ref">
    <div class="tabs_box">
      <ul>
        <li>资料库</li>
      </ul>
    </div>
    <div class="search">
      <el-input clearable placeholder="按文件名搜索" prefix-icon="el-icon-search" v-model="searchText" @keydown.enter="searchHandle" />
    </div>
    <div class="btns">
      <el-dropdown @command="handle">
        <el-button round><span>添加题目</span><i class="el-icon-caret-bottom" /></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>上传资料</el-dropdown-item>
            <el-dropdown-item>上传标准教案</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, watch } from 'vue';
import Modal from './../../../utils/modal';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';

export default {
  setup(props, { emit }) {

    let searchText = ref(null);
   
    const searchHandle = () => emit('search', searchText.value);

    const handle = () => {
    }

    return { searchText, searchHandle, handle }
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
      input {
        display: none;
      }
    }
  }
}
</style>