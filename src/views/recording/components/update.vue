<template>
  <div class="container">
    <div class="header">
      <el-button round>保存并返回</el-button>
      <el-button round>保留原卷</el-button>
    </div>
    <div class="content">
      <div class="main" @click="blur"><MainComponent /></div>
      <div class="toolbar"><ToolbarComponent /></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, provide } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import store from './store';
import axios from 'axios';
import MainComponent from './update-section/main.vue';
import ToolbarComponent from './update-section/toolbar.vue';

export default {
  components: { MainComponent, ToolbarComponent },
  props: ['id'],
  setup(props) {
    let loading = ElLoading.service();

    store.commit('reset');

    axios.post<null, { json: any[] }>('/admin/questionImportLog/queryQuestionByImportId', { importId: props.id }).then(res => {
      store.commit('set_data_set', res.json[1]);
      loading.close();
    });

    const blur = () => store.commit('set_focus_data', null);

    return { blur };

  }
}
</script>

<style lang="scss" scope>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  & > .header {
    height: 60px;
    line-height: 60px;
    text-align: right;
    background: #1AAFA7;
    box-shadow: 0px 0px 3px 0px rgba(45, 113, 183, 0.15);
    button {
      color: #999;
      padding: 10px 23px;
      margin-right: 20px;
      margin-left: 0;
      &:first-child {
        color: #1AAFA7;
      }
    }
  }
  .content {
    display: flex;
    flex: 1 1 60px;
    height: 100%;
    background: #F4F5F9;
    overflow: hidden;
    .main {
      flex: 1 1 340px;
      height: 100%;
      padding: 20px;
      overflow: auto;
    }
    .toolbar {
      width: 340px;
      height: 100%;
      background: #fff;
    }
  }
}
</style>