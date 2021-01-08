<template>
   <div class="header_ref">
    <div class="tabs_box">
      <ul>
        <li
          v-for="p in classList"
          :key="p.id"
          :class="{ active: classType === p.id }"
          @click="classChange(p.id)" >
          {{ p.name }}
        </li>
      </ul>
    </div>
    <div class="search">
      <el-input
      @clear='clearInput'
        clearable
        placeholder="按文件名称搜索"
        prefix-icon="el-icon-search"
        v-model="searchText"
        @keydown.enter="searchHandle"
      />
    </div>
    <div class="btns" @mouseleave="setUpdateShow(false)">
      <el-button round :disabled="false" @mouseenter="setUpdateShow(true)" @click="() => emit('handleClick', 'zl')">
        <span>上传资料</span>
      </el-button>

      <div class="update_show" v-show="updateShow" style="z-index:100">
        <el-tooltip placement="left" effect="light">
          <template #content>
            课件支持的格式：.ppt .pptx <br />讲义支持的格式：.doc .docx .pdf<br />
            说课视频支持的格式：.mp4（H264）<br />其他支持的格式：.png，.jpg
            .jpeg .mp3，zip，rar<br />
          </template>
          <el-button round @click="() => emit('handleClick', 'zl')">
            <label for="paperUploadBtn">
              <span>上传资料</span>
              <input />
            </label>
          </el-button>
        </el-tooltip>
        <el-tooltip content="Bottom center" placement="left" effect="light">
          <template #content> 标准教案支持的格式：doc，docx。 </template>
          <el-button round @click="() => emit('handleClick', 'ja')">
            <label for="paperUploadBtn">
              <span>上传标准教案</span>
              <input />
            </label>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { getCurrentInstance, ref, watch } from "vue";
import OrganizingPapers from "./organizing-papers.vue";
import emitter from "../../../utils/mitt";
import Modal from "../../../utils/modal";
import { ElMessage } from "element-plus";
import axios from "axios";
import { AxResponse } from "../../../core/axios";

export default {
  props: ["fileList", "fileChange", "tipShow"],
  setup(props, { emit }) {
     let classType = ref(null);
     const updateShow = ref(false);
     let classList = [{ name: "资料库", id: null }];
     const classChange = (e) => {
      classType.value = e;
      emit("SET_SUBJECT", e);
     };
     const handlePreview = () => {
      console.log(1);
     };

    let searchText = ref();
    const searchHandle = () => {
      emitter.emit('search', searchText);
    }

    const clearInput = ()=>{
      emitter.emit('search', clearInput=>{clearInput});
    }

     let queryClass = {};
     emitter.on("queryClass", (e) => (queryClass = e));

     const iMousemove = () => {
      console.log(1111);
     };

      let uploadRef = ref();
      const upload = () => {
      let files: File[] = Array.from(uploadRef.value.files);
      uploadRef.value.files;
      let accept = ["ppt","pptx","doc","docx","pdf","mp4","mp3","jpg","png","zip","rar", ];
      files.filter((file) => {
        let idx = file.name.lastIndexOf(".");
        let ext = file.name.substr(idx + 1);
        return accept.includes(ext);
      });
      if (!files.length) {
        ElMessage.warning(`请选择指定${accept.join("、")}格式文件`);
      } else {
        Modal.create({
          title: "上传资料",
          width: 500,
          component: OrganizingPapers,
          props: { queryClass, files },
        });
      }
    };
    let roundisShow: boolean = false;
    const setUpdateShow = (bool: boolean)=> {
      updateShow.value = bool;
    }
   
    return {clearInput,classType,classList,classChange,searchText,searchHandle,uploadRef,upload,iMousemove,handlePreview,updateShow,setUpdateShow,emit,};
  },
};
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
        content: "";
        display: block;
        width: 100%;
        height: 6px;
        background: #faad14;
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
      &::placeholder {
        color: #fff;
      }
    }
  }
  .btns {
    margin-left: 30px;
    button {
      // position: relative;
      color: #1aafa7;
      padding: 10px 23px;
      label {
        cursor: pointer;
      }
      input {
        display: none;
      }
    }
  }
  .update_show {
    position: absolute;
    top: 50px;
    z-index: 2;
    line-height: initial;
    width: 140px;
    background: #fff;
    border-radius: 10px;
    > button {
      border-radius: 0;
      width: 100%;
      margin: 10px 0;
      border: none;
      &:nth-of-type(2) {
        margin-top: 0;
        margin-left: 0;
      }
    }
    :deep(ul.el-upload-list.el-upload-list--text) {
      display: none;
    }
  }
}
</style>