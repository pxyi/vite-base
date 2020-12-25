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
      <el-button round @click="addPaper">组卷</el-button>
      <el-button round>
        <label for="paperUploadBtn">
          <span>上传试卷</span>
          <input type="file" ref="uploadRef" id="paperUploadBtn" @change="upload" multiple accept=".docx,.doc,.pdf">
        </label>
      </el-button>
    </div>
  </div>

  </div>

</template>

<script lang="ts">
import { ref, onMounted, Ref } from "vue";
import axios from "axios";
import LeftTree from "../tree.vue";
import { AxResponse } from "~/@/core/axios";

export default {
  components: { LeftTree },
 
};
</script>

<style lang="scss" scoped>
.content {
  .left_box {
    width: 250px;
    height: 860px;
    background-color: #fff;
    .left_search {
      width: 226px;
      height: 40px;
      background: rgba(255, 255, 255, 1);
      border-radius: 3px;
      border: 1px solid rgba(235, 240, 252, 1);

      img {
        display: inline-block;
        margin: 10px 6px 10px 12px;
        float: left;
      }
      input {
        float: left;
        width: 86%;
        border: 0;
        height: 100%;
        border-radius: 3px;
        background: transparent;
        outline: none;
        color: #c8cbd0;
      }
      input::placeholder {
        color: rgba(119, 128, 141, 1);
      }
    }
  }
}
</style>
