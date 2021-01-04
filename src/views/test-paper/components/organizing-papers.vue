<template>
  <cus-form
    ref="formRef"
    :nodes="nodes"
    :width="files ? '422px' : '500px'"
  ></cus-form>

  <template v-if="files">
    <div class="file-upload-content">
      <el-upload
        drag
        :action="action"
        accept=".pdf,doc,.docx"
        :file-list="fileList"
        multiple
        ref="uploadRef"
        :on-success="uploadSuccess"
        :on-remove="fileRemove"
      >
        <div class="upload-content">
          <i class="el-icon-upload" />
          <div>将文件拖到此处，或<span>点击上传</span></div>
          <p>支持扩展名：.doc、.docx、.pdf</p>
        </div>
      </el-upload>
    </div>
  </template>
  <template v-else>
    <div class="paper-mode">
      <span>组件方式</span>
      <div class="mode-radio-group">
        <div class="r-g-radio">
          <i class="el-icon-check" />
          <h4>智能选题</h4>
          <p>
            根据指定学科知识点，题目情况智能生成试卷结构和题目，支持手动调整
          </p>
        </div>
        <div class="r-g-radio">
          <i class="el-icon-check" />
          <h4>手动选题</h4>
          <p>根据个性化需求，手动添加试卷结构并完成选题</p>
        </div>
      </div>
    </div>
  </template>
</template>
<script lang="ts">
import { ref, Ref, PropType, onMounted, inject } from 'vue';
import { AxResponse } from './../../../core/axios';
import axios from 'axios';
import { useStore } from 'vuex';

export default {
  props: {
    queryClass: Object as any,
    files: Array as PropType<File[]>,
  },
  setup(props) {
    let store = useStore();
    let formRef = ref();
    let uploadRef = ref();
    let action = `${import.meta.env.VITE_APP_BASE_URL}/system/file/uploadFile`;

    let controls: any[] = [
      {
        label: "学科",
        key: "subjectId", 
        type: "cascader",
        url: "/permission/user/userDataSubjects",
        params: { userId: store.getters.userInfo.user.id },
        rule: { required: true, message: "请选择学科" },
      },
      {
        label: "年级",
        key: "gradeId",
        type: "select",
        options: props.queryClass.grades,
        rule: { required: true, message: "请选择年级" },
      },
      {
        label: "年份",
        key: "yearId",
        type: "select",
        options: props.queryClass.years,
        rule: { required: true, message: "请选择年份" },
      },
      {
        label: "来源",
        key: "sourceId",
        type: "select",
        options: props.queryClass.sources,
        rule: { required: true, message: "请选择来源" },
      },
    ];

    let fileList: Ref<any[]> = ref([]);
    if (props.files) {
      controls.push({ label: '共享范围', key: 'xxxx', type: 'checkbox', default: [0], options: [ { name: '我的试卷', id: 0 },{ name: '公共试卷', id: 1 } ] })
      Promise.all(props.files.map(file => {
        let formdata = new FormData();
        formdata.append('file', file);
        return axios.post('/system/file/uploadFile', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
      })).then((list: any[]) => {
        fileList.value = list.map(res => ({ name: res.json.oriFilename, url: res.json.filePath }))
      });
    } else {
      controls = [
        {
          label: "试卷名称",
          key: "paperTitle",
          type: "input",
          rule: { required: true, message: "请输入试卷名称" },
        },
        ...controls,
        {
          label: "共享范围",
          key: "xxxx",
          type: "checkbox",
          default: [2],
          options: [
            { name: "我的试卷", id: 2, disabled: true },
            { name: "公共试卷", id: 1 },
          ],
        },
      ];
    }
    let nodes: Ref<any[]> = ref(controls);

    const uploadSuccess = (response, file, fileList) => {
      console.log(response, file, fileList);
    };
    const fileRemove = (file, fileList) => {
      console.log(file, fileList);
    };

    const save = (resolve, reject) => {
      formRef.value.validate(valid => {
        valid ? resolve(valid) : reject();
      });
    };

    return {
      action,
      nodes,
      save,
      formRef,
      uploadRef,
      fileList,
      uploadSuccess,
      fileRemove,
    };
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100%;
  .el-upload-dragger {
    width: 100%;
    height: 160px;
    background: none;
  }
}
.file-upload-content {
  padding: 20px 70px;
  background: #ebf0fc;
  border: 1px solid #ebf0fc;
  border-radius: 4px;
}
.upload-content {
  i {
    margin-top: 24px;
    color: #1aafa7;
  }
  div {
    color: #1a2633;
    margin-bottom: 8px;
    span {
      color: #1aafa7;
    }
  }
  p {
    color: #999;
    font-size: 12px;
  }
}
.paper-mode {
  display: flex;
  margin-bottom: 22px;
  span {
    width: 80px;
    display: block;
    text-align: right;
    color: rgb(96, 98, 102);
    line-height: 40px;
    padding: 0px 12px 0px 0px;
    white-space: nowrap;
    &::before {
      content: "*";
      color: rgb(245, 108, 108);
      margin-right: 4px;
    }
  }
  .mode-radio-group {
    flex: auto;
    display: flex;
    .r-g-radio {
      flex: 1;
      padding: 25px;
      height: 140px;
      border-radius: 6px;
      border-width: 3px;
      border-style: solid;
      cursor: pointer;
      position: relative;
      transition: all 0.1s ease;
      i {
        color: #fff;
        font-size: 16px;
        position: absolute;
        top: 5px;
        right: 3px;
        opacity: 0;
        transition: all 0.1s ease;
      }
      &.active::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-width: 20px;
        border-style: solid;
        border-bottom-color: rgba($color: #000000, $alpha: 0);
        border-left-color: rgba($color: #000000, $alpha: 0);
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0;
        transition: all 0.1s ease;
      }
      &.active {
        i,
        &::before {
          opacity: 1;
        }
      }
      &:first-child {
        margin-right: 20px;
        border-color: rgba(255, 132, 33, 0.1);
        background: rgba(255, 132, 33, 0.1);
        &.active {
          border-color: rgba(255, 132, 33, 1);
          &::before {
            display: block;
            border-top-color: #ff8421;
            border-right-color: #ff8421;
          }
        }
      }
      &:last-child {
        border-color: rgba(69, 90, 247, 0.1);
        background: rgba(69, 90, 247, 0.1);
        &.active {
          border-color: rgba(69, 90, 247, 1);
          &::before {
            display: block;
            border-top-color: #455af7;
            border-right-color: #455af7;
          }
        }
      }
      h4 {
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 10px;
      }
      p {
        color: #77808d;
      }
    }
  }
}
</style>
