<template>
  <div class="file-upload-content">
    <el-upload drag :action="action" :file-list="fileList" multiple ref="uploadRef" :on-success="uploadSuccess" :on-remove="fileRemove" :before-upload="validator">
      <div class="upload-content">
        <i class="el-icon-upload" />
        <div>将文件拖到此处，或<span>点击上传</span></div>
        <p><span>支持扩展名：</span><i v-for="i in acceptFormat" :key="i">{{ i }}</i></p>
      </div>
    </el-upload>
  </div>
  <div class="public">
    <span>保存位置：</span>
    <el-radio-group v-model="isPublic">
      <el-radio :label="0">个人库</el-radio>
      <el-radio :label="1">公共库</el-radio>
    </el-radio-group>
  </div>
  <div>
    <h3>已选择章节：{{ knowledgeList.length }}章</h3>
    <div class="tag-box"><el-tag size="mini" v-for="o in knowledgeList" :key="o.id">{{ o.name }}</el-tag></div>
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
    },
    knowledgeList: {
      type: Array as PropType<any[]>,
      default: () => []
    },
    type: Number
  },
  setup(props) {
    let store = useStore();
    let uploadRef = ref();
    let action = `${import.meta.env.VITE_APP_BASE_URL}/system/file/uploadFile`;
    let acceptFormat = ['ppt', 'pptx', 'doc', 'docx', 'pdf', 'mp4', 'mp3', 'jpg', 'png' , 'jpeg', 'zip', 'rar'];

    let userId = store.getters.userInfo.user.id;
    let subjectCode = store.getters.subject.code;

    let fileList: Ref<any[]> = ref([]);
    let files = props.files.filter(file => {
      let idx = file.name.lastIndexOf('.');
      let ext = file.name.substr(idx + 1).toLocaleLowerCase();
      return acceptFormat.includes(ext);
    })
    if (files.length) {
      Promise.all(props.files.map(file => {
        let formdata = new FormData();
        formdata.append('file', file);
        return axios.post('/system/file/uploadFile', formdata, { headers: { 'Content-Type': 'multipart/form-data' } });
      })).then((list: any[]) => {
        fileList.value = list.map(res => ({ ...res.json, name: res.json.oriFilename, url: res.json.filePath }))
      });
    } else {
      ElMessage.warning(`请上传以下指定格式文件，${acceptFormat.join('、')}`)
    }

    const validator = (file) => {
      let idx = file.name.lastIndexOf('.');
      let ext = file.name.substr(idx + 1).toLocaleLowerCase();
      let valid = acceptFormat.includes(ext);
      !valid && ElMessage.warning(`请上传以下指定格式文件，${acceptFormat.join('、')}`)
      return valid;
    }

    const uploadSuccess = (res) => {
      fileList.value.push({ ...res.json, name: res.json.oriFilename, url: res.json.filePath });
    };
    const fileRemove = (file) => {
      fileList.value.splice(fileList.value.findIndex(f => file.filePath === f.filePath), 1);
    };

    let isPublic = ref(0);

    const save = (resolve, reject) => {
      if (fileList.value.length) {
        axios.post('/admin/material/batchSave', { 
          chapterId: props.knowledgeList.map(i => i.id),
          isPublic: isPublic.value,
          subject: subjectCode,
          type: props.type,
          fileList: fileList.value
        }, { headers: { 'Content-Type': 'application/json' } }).then((res: any) => {
          res.result ? resolve(res) : reject()
        })
      } else {
        ElMessage.warning('请上传文件！');
        reject();
      }
    };

    return { action, save, uploadRef, fileList, uploadSuccess, fileRemove, isPublic, acceptFormat, validator };
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
.upload-content {
  & > i {
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
    padding: 0 50px;
    i::after {
      content: '、';
      display: inline-block;
    }
  }
}
h3 {
  margin: 20px 0 10px;
}
:deep(.tag-box) {
  .el-tag {
    margin: 0 10px 10px 0;
  }
}
.public {
  margin: 20px 0;
  span {
    margin-right: 10px;
  }
}
</style>
