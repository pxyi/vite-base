<template>
  <cus-form ref="formRef" :nodes="nodes" width="422px" />

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
<script lang="ts">
import { ref, Ref, PropType, onMounted, inject } from 'vue';
import { AxResponse } from './../../../core/axios';
import axios from 'axios';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default {
  props: {
    files: {
      type: Array as PropType<File[]>,
      default: () => []
    }
  },
  setup(props) {
    let store = useStore();
    let formRef = ref();
    let uploadRef = ref();
    let action = `${import.meta.env.VITE_APP_BASE_URL}/system/file/uploadFile`;

    let userId = store.getters.userInfo.user.id;
    let subjectCode = store.getters.subject.code;

    let nodes: Ref<any[]> = ref([
      {
        label: "学科",
        key: "subjectId", 
        type: "cascader",
        url: "/permission/user/userDataSubjects",
        params: { userId },
        rule: { required: true, message: "请选择学科" },
        valueKey: 'code',
        change: (v) => {
          axios.post('/permission/user/userDataRules', { userId, subjectCode: v[1] }).then((res: any) => {
            nodes.value[1].options = res.json.grades;
            nodes.value[2].options = res.json.years;
            formRef.value.formGroup.gradeId = null;
            formRef.value.formGroup.year = null;
          })
        }
      },
      {
        label: "年级",
        key: "gradeId", 
        type: "select",
        options: [],
        rule: { required: true, message: "请选择年级" },
      },
      {
        label: "年份",
        key: "year",
        type: "select",
        options: [],
        rule: { required: true, message: "请选择年份" },
      },
      {
        label: "来源",
        key: "source",
        type: "select",
        options: [{ name: '单元测试', id: 1 }, { name: '月考', id: 2 }, { name: '期中', id: 3 }, { name: '期末', id: 4 }, { name: '竞赛', id: 5 }, { name: '错题本', id: 6 }],
        rule: { required: true, message: "请选择来源" },
      },
      { 
        label: '共享范围', 
        key: 'isPublic', 
        type: 'radio', 
        default: 0, 
        options: [ { name: '我的试卷', id: 0 },{ name: '公共试卷', id: 1 } ] 
      }
    ]);

    let fileList: Ref<any[]> = ref([]);
    Promise.all(props.files.map(file => {
      let formdata = new FormData();
      formdata.append('file', file);
      return axios.post('/system/file/uploadFile', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
    })).then((list: any[]) => {
      fileList.value = list.map(res => ({ ...res.json, name: res.json.oriFilename, url: res.json.filePath }))
    });

    const uploadSuccess = (res) => {
      fileList.value.push({ ...res.json, name: res.json.oriFilename, url: res.json.filePath });
    };
    const fileRemove = (file) => {
      fileList.value.splice(fileList.value.findIndex(f => file.filePath === f.filePath), 1);
    };

    const save = (resolve, reject) => {
      formRef.value.validate(valid => {
        if (valid) {
          let parasm = { ...valid, papers: fileList.value, subjectId: valid.subjectId[1] };
          axios.post<null, AxResponse>('/tiku/paper/batchSavePaper', parasm, { headers: { 'Content-Type': 'application/json' } }).then(res => {
            if (res.result) {
              ElMessage.success('上传试卷成功~！');
              resolve(true)
            } else {
              ElMessage.warning(res.msg);
              reject()
            }
          })
        } else {
          reject()
        }
      });
    };

    return { action, nodes, save, formRef, uploadRef, fileList, uploadSuccess, fileRemove };
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
