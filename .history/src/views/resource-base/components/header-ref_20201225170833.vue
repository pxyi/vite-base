<template>
  <div class="header_ref">
    <div class="tabs_box">
      <ul>
        <li v-for="p in classList" :key="p.id" :class="{ active: classType === p.id }" @click="classChange(p.id)">{{ p.name }}</li>
      </ul>
    </div>
    <div class="search">
      <el-input clearable placeholder="按文件名称搜索" prefix-icon="el-icon-search" v-model="searchText" @keydown.enter="searchHandle" />
    </div>
    <div class="btns">
    
      <el-button round>
        <label for="paperUploadBtn">
          <span>上传资料</span>
          &nbsp; 
          <i class="el-icon-caret-bottom" @mousemove="iMousemove"></i>
          <input type="file" ref="uploadRef" id="paperUploadBtn" @change="upload" multiple accept=".docx,.doc,.pdf">
        </label>
      </el-button>
    </div>
       <el-dialog
      title="上传资料"
      :visible.sync="uploadInfoDialogVisible"
      width="38%"
      @close="uploadInfoDeforeClose"
      :before-close="uploadInfoDeforeClose"
      @closed="close"
    >
      <div class="templateUploadWrap">
        <div class="templateUpload">
          <el-upload
            class="upload-demo"
            drag
            :action="active"
            :file-list="upDateList"
            :on-change="handleChange"
            :accept="upLoadDate"
            multiple
            :before-remove="remove"
          >
            <i class="icon iconfont iconmobanxiazai down"></i>
            <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
            <span class="supportedDocuments"
              >支持扩展名：.ppt .pptx .doc .docx .pdf .mp4 .mp3 .jpg .png .jpeg
              .zip .rar</span
            >
          </el-upload>
        </div>
        <p style="margin:20px 0;">
          <span>保存路径：</span>
          <template
            v-if="
              dataStoragePath.textbookVersionName &&
                dataStoragePath.bookVersionName
            "
          >
            {{ dataStoragePath.textbookVersionName }}/{{
              dataStoragePath.bookVersionName
            }}
          </template>
          <br />
          {{ dataStoragePath.lastLevelName }}
        </p>
        <p>
          <span>保存位置：</span>
          <el-checkbox-group v-model="checkList" style="display:inline-block;">
            <el-checkbox label="个人库" disabled></el-checkbox>
            <el-checkbox label="公共库"></el-checkbox>
          </el-checkbox-group>
        </p>
        <!-- <p>
          <span>保存位置：</span>
          <el-checkbox-group v-model="checkList" style="display:inline-block;">
            <el-checkbox label="个人库" disabled></el-checkbox>
            <el-checkbox label="公共库"></el-checkbox>
          </el-checkbox-group>
        </p> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadInfoSure" :loading="loadingBol"
          >确认</el-button
        >
      </span>
    </el-dialog>
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

    let uploadInfoDialogVisible = false

    let queryClass = {};
    emitter.on('queryClass', (e) => queryClass = e)

    const iMousemove = ()=>{
      console.log(1111);
      
    }

    let uploadRef = ref();
    const upload = () => {
     uploadInfoDialogVisible  = true
    }
    return { classType, classList, classChange, searchText, searchHandle,  uploadRef, upload,iMousemove,uploadInfoDialogVisible }
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
      // position: relative;
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
  .templateUploadWrap {
    width: 63%;
    margin: 0 auto;
    .templateUpload {
      .supportedDocuments {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(119, 128, 141, 1);
        line-height: 22px;
      }
      .down {
        text-align: center;
        display: block;
        font-size: 67px;
        color: #c0c4cc;
        line-height: 50px;
        width: 44px;
        height: 45px;
        margin: 67px auto 20px;
        background-size: 100% !important;
        background: url("../../assets/inbox.png") no-repeat center;
        // background: url('../../../assets/inbox.png') no-repeat center;
      }
    }
  }
}
</style>