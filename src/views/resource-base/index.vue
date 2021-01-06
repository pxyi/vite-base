<template>
  <template ref="headerRef">
    <HeaderRefComponent
      @type-change="params.type = $event"
      @handleClick="uploadInfo"
      v-model:fileList="upDateList"
      :tipShow="tipShow"
      @fileChange="handleChange"
    />
  </template>
  <!-- 内容主体区域 -->
  <div class="content">
    <!-- 左盒子 -->
    <div class="left_box">
      <!-- 左侧树状图 -->
      <TreeLeft @check-change="query('tree', $event)" :tipShow="tipShow" />
    </div>
    <!-- 右盒子 -->
    <div class="right_box">
      <div class="footer" v-if="tipShow">
        <p>选择一个章节开始上传吧</p>
        <span @click="tipShow = false"> 好的👌 </span>
      </div>
      <!-- //触发第一次input[type=file] -->
      <el-upload
        class="upload-demo"
        style="display: none"
        drag
        :action="active"
        :file-list="upDateList"
        :on-change="handleChange"
        :accept="upLoadDate"
        multiple
        :before-remove="remove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text iup">点击或将文件拖拽到这里上传</div>
      </el-upload>
      <!-- 触发第一次input[type=file]// -->
      <el-dialog title="上传资料" v-model="uploadInfoDialogVisible" @close="uploadInfoDeforeClose" :before-close="uploadInfoDeforeClose" @closed="close">
        <div class="templateUploadWrap">
          <div class="templateUpload">
            <el-upload class="upload-demo" drag :action="active" :file-list="upDateList" :on-change="handleChange" :accept="upLoadDate" multiple :before-remove="remove">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
              <span
                class="supportedDocuments"
                style="display: block; padding: 0 24px"
                >支持扩展名：.ppt .pptx .doc .docx .pdf .mp4 .mp3 .jpg .png.jpeg .zip .rar</span>
            </el-upload>
          </div>
          <p style="margin: 20px 0 0 40px">
            <span>保存路径：</span>
            <template
              v-if="dataStoragePath.textbookVersionName &&dataStoragePath.bookVersionName">
              {{ dataStoragePath.textbookVersionName }}/{{ dataStoragePath.bookVersionName}}
            </template>
            <br />
            {{ dataStoragePath.lastLevelName }}
          </p>
          <p style="margin:20px 0 0  40px">
            <span>保存位置：</span>
            <el-checkbox-group v-model="checkList" style="display: inline-block">
              <el-checkbox label="个人库"></el-checkbox>
              <el-checkbox label="公共库"></el-checkbox>
            </el-checkbox-group>
          </p>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="uploadInfoSure" :loading="loadingBol">
              确认
          </el-button>
          </span>
        </template>
      </el-dialog>
      <!-- tab切换 -->
      <div class="right_tab">
        <Tabs />
      </div>
    </div>
    
  </div>
</template>

<script lang="ts">
import {
  ref,
  onMounted,
  Ref,
  provide,
  reactive,
  toRefs,
  computed,
  nextTick,
} from "vue";
import axios from "axios";
import { AxResponse } from "~/@/core/axios";
import emitter from "../../utils/mitt";
import HeaderRefComponent from "../resource-base/components/header-ref.vue";
import TreeLeft from "../resource-base/components/tree-left.vue";
import Tabs from "./components/tabs.vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";

export default {
  name: "zjk",
  components: { HeaderRefComponent, TreeLeft, Tabs },
  setup(props, {emit}) {
    emitter.on('check-change',target=>{
      state.pageParam.chapterId = target.id
    })
    const state = reactive({
      upDateList: [] as any,
      arr2: [] as any,
      upDateShow: false,
      upLoadDate: "",
      active: `${import.meta.env.VITE_APP_BASE_URL}/system/file/uploadFile`,
      pageParam: {
        current: 1,
        size: 20,
        chapterId: [],
        isPublic: 1,
        lastLevelId: [],
        ext: null,
        fileName: "",
        courseId: "",
        subject: "",
        type: null,
      },
      knowledgePoints: [] as any,
      checkList: ["公共库"] as any,
      datumCategoryList: [] as any,
      isShow: false,
      tipShow: false,
      type: null,
      dataStoragePath: {} as any,
      textbookVersionId: "",
      textbookVersionList: [] as any,
      bookVersionId: "",
      bookVersionList: [] as any,
      lastLevelId: [] as any,
      lastLevelName: [] as any,
      uploadInfoDialogVisible: false,
      loadingBol: false,
      fileTypeAndCount: [] as Array<any>,
      tableData: [] as any,
      total: 0,
      subject: "",
      updateRef: {} as HTMLElement,
    });
    let headerRef = ref();
    let tableParam = {
      chapterId: [],
    };
    let isShow = false;
    const childTable = ref();
    const stateSelectId = computed(() => {
      return state.subject; //1; //NavModule.navSelectParams.selectId;
    });
    onMounted(() => {
      emitter.emit("slot", headerRef);
      emitter.emit("effect", (id) => {
        query("subject", id);
      });
    });
    const query = (key, val) => {
      if (key === "tree") {
        state.lastLevelId = val.checkedNodes.map((val: any) => val.id);
        state.lastLevelName = val.checkedNodes.map((val: any) => val.name);
        state.bookVersionList = "";
        return;
      }
      state[key] = val;
    };

    const okUpDate = (file, fileList)=> {
      state.upDateList = fileList;
      state.upDateShow = true;
    }

    const  uploadInfo=(item)=> {
   
      // if (!state.pageParam.chapterId.length) {
      //   state.isShow = true;
      //   return false;
      // } else {
      //      console.log(2);
      //   state.isShow = false;
      // }
      if (item === "zl") {
        state.upLoadDate =
          ".ppt,.pptx,.doc,.docx,.pdf,.mp4,.mp3,.jpg,.png,.zip,.rar,.jpeg";
        state.type = null;
      } else if (item === "ja") {
        // console.log('上传教案');
        state.upLoadDate = ".doc,.docx";
        (state.type as any) = 5;
        console.log("上傳教案");
      }
      if (state.lastLevelId.length === 0) {
        state.tipShow = true;
        return;
      }
      setTimeout(() => {
        if (document.querySelector(".el-upload__text.iup")) {
          (document.querySelector(
            ".el-upload__text.iup"
          ) as HTMLElement).click();
        }
      });
      state.dataStoragePath = {
        textbookVersionName: "",
        bookVersionName: "",
        lastLevelId: state.lastLevelId,
        lastLevelName: state.lastLevelName.join(" / "),
      };
      state.upDateList = [];
      // state.uploadInfoDialogVisible = true;
    }
    // 关闭弹窗方法
    const uploadInfoDeforeClose = ()=> {
      state.upDateList = []; //关闭弹窗清空
      state.uploadInfoDialogVisible = false;
    }
    const close =()=> {
      state.upDateList = [];
      state.upDateShow = false;
    }
    const remove = (file, fileList)=> {
      // return this.$confirm(`确定移除 ${file.name}？`);
    }
    const handleChange = (file, fileList) => {
      if (!state.uploadInfoDialogVisible) {
        state.uploadInfoDialogVisible = true;
      }
      state.arr2 = fileList;

      // console.log(state.upDateList);

      if (state.arr2.length === 1) {
        state.upDateList = state.arr2;
      }
      for (var i = 0; i < state.arr2.length; i++) {
        if (state.arr2.filter((item,index)=>i!==index).map(v=>v.name).includes(state.arr2[i].name)) {
          return state.arr2.splice(i, 1);
        } else {
          state.upDateList = state.arr2;
        }
      }
    }
   
    // 上传资料确认保存
    const uploadInfoSure = ()=> {
      state.loadingBol = true;
      state.upDateShow = false;
      let arr = [];
      state.upDateList.map((item) => {
        if (!item.response) {
          arr.push(item as never);
        } else {
          arr.push(item.response.json as never);
        }
      });
      const params = state.type
        ? {
            fileList: arr,
            subject: stateSelectId.value,
            version: state.textbookVersionId,
            isPublic: state.checkList.includes("公共库") ? 1 : 0,
            bookId: state.bookVersionId,
            chapterId: state.dataStoragePath.lastLevelId,
            type: state.type,
          }
        : {
            fileList: arr,
            subject: stateSelectId.value,
            version: state.textbookVersionId,
            isPublic: state.checkList.includes("公共库") ? 1 : 0,
            bookId: state.bookVersionId,
            chapterId: state.dataStoragePath.lastLevelId,
          };
      axios
        .post<any, AxResponse>("admin/material/batchSave", params, {
          headers: {
            type: "1",
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
        .then((res) => {
          state.loadingBol = false;
          if (!res.result) {
            ElMessage({
              type: "error",
              message: res.msg,
            });
            return false;
          } else {
            ElMessage({
              type: "success",
              message: "上传成功",
            });
          } // 上传成功关闭弹窗
          uploadInfoDeforeClose(); // this.uploadInfoDialogVisible = false;
          emitter.emit('uploadInfoSure',()=>{})
        });
         
    }
    
    return {
      ...toRefs(state),
      headerRef,
      isShow,
      query,
      uploadInfo,
      okUpDate,
      uploadInfoDeforeClose,
      remove,
      handleChange,
      close,
      uploadInfoSure,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.el-upload-dragger.el-icon-upload) {
  margin-top: 20px;
}
:deep(.el-dialog[aria-label="上传资料"]) {
  width: 31.6% !important;
}
:deep(.el-upload-dragger.el-upload-dragger) {
  margin:40px;
  // display: table;
  background-color: #f6f7f9;
  
}
:deep(.el-upload) {
  // margin:40px;
  // display: table;
  background-color: #f6f7f9;
}
.content {
  display: flex;
  .left_box {
   width: 250px;
    height: 860px;
    min-height: 860px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0px 1px 6px 0px rgba(91, 125, 255, 0.08);
    overflow: auto;
    .left_search {
      width: 226px;
      height: 40px;
      background: rgba(255, 255, 255, 1);
      border-radius: 3px;
      border: 1px solid rgba(235, 240, 252, 1);
    }
  }
  .right_box {
    // flex: 5;
    width: 930px;
    background-color: #fff;
    margin-left: 20px;
    height: 100%;
    box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
    min-height: 300px;
    .right_tab {
      width: 98%;
      height: 100%;
    }
    .footer {
      background-color: #333333;
      height: 70px;
      width: 200px;
      color: #fff;
      position: absolute;
      top: 250px;
      left: 350px;
      border-radius: 10px;
      text-align: center;
      line-height: 35px;
      // display: none;
      font-size: 14px;
      z-index: 999;
      span {
        display: block;
        text-align: right;
        padding-right: 20px;
        cursor: pointer;
      }
    }
    ul {
      background: rgb(244, 245, 249);
      :deep(.el-upload-list.el-upload-list--text) {
        display: none;
      }
    }
    li {
      width: 80px;
      height: 36px;
      background: #1aafa7;
      border-radius: 3px;
      text-align: center;
      line-height: 36px;
      border: 0;
      color: #ffffff;
      margin-right: 10px;
      cursor: pointer;
      display: inline-block;
      margin: 0 0 20px 0px;
      &:nth-of-type(2) {
        margin-left: 10px;
      }
    }
  }
}
.margin1{
  margin-left: 40px;
}
.tooltip {
  font-size: 12px;
  line-height: 30px;
}
</style>
