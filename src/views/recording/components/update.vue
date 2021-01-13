<template>
  <div class="container">
    <div class="header">
      <el-button :loading="saveLoading" round @click="save">保存并返回</el-button>
      <el-button round @click="generatePaper" v-show='allowGenerate'>生成试卷</el-button>
      <el-button round :disabled="!allowGenerate" v-show='!allowGenerate'>已生成试卷</el-button>
    </div>
    <div class="content">
      <div class="main" @click="blur"><MainComponent /></div>
      <div class="toolbar"><ToolbarComponent /></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, inject, provide } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import store from './store';
import axios from 'axios';
import MainComponent from './update-section/main.vue';
import ToolbarComponent from './update-section/toolbar.vue';
import { cloneDeep } from 'lodash';
import Modal from './../../../utils/modal';
import GeneratingComponent from './update-section/generating.vue';
import { questionFormat } from './../utils/question-format'

export default {
  components: { MainComponent, ToolbarComponent },
  props: ['id', 'close'],
  setup(props) {
    let loading = ElLoading.service();

    store.commit('reset');

    let dataset = computed(() => store.state.dataSet);

    let focusData = computed(() => dataset.value[store.state.checkedIndex]);

    const isSync = computed(() => store.state.isSync);

    axios.post<null, { json: any }>('/admin/questionImportLog/queryQuestionByImportId', { importId: props.id }).then(res => {
      let questions = res.json.questionList.map(data => questionFormat(data));
      store.commit('set_error_list', res.json.failInfo);
      store.commit('set_data_set', questions);

      allowGenerate.value = !res.json.paperId;
      setTimeout(() => loading.close(), 100);
    });

    const blur = () => !isSync.value ? store.dispatch('checked_index_change', -1) : false;

    let saveLoading = ref(false);
    const save = async () => {
      saveLoading.value = true;
      let questions = __cloneData(dataset.value);
      let res = await axios.post<null, { result: boolean, msg: string }>('/tiku/question/batchSaveQuestion', { questionImportLogId: props.id, questions }, { headers: { 'Content-Type': 'application/json' } });
      !res.result && ElMessage.warning(res.msg);
      props.close(res);
    }

    const __cloneData = (data) => {
      let questions = cloneDeep(data).map(data => {
        data.questionSources && data.questionSources.length && data.questionSources.map(i => {
          if (i.provinceCity) {
            i.provinceId = i.provinceCity[0];
            i.cityId = i.provinceCity[1];
            i.areaId = i.provinceCity[2];
          };
          return i;
        })
        return data;
      });

      return questions;
    }

    let allowGenerate = ref(true);
    const generatePaper = () => {
      let questions = __cloneData(dataset.value);
      Modal.create({ component: GeneratingComponent, title: '生成试卷', width: 420, zIndex: 2010, props: { questions, id: props.id } }).then((res: any) => {
        ElMessage[res.result ? 'success' : 'warning'](res.result ? '生成试卷成功' : '生成试卷失败，请重试');
        allowGenerate.value = !res.result;
      })
    }

    return { blur, save, saveLoading, generatePaper, allowGenerate };

  }
}
</script>

<style lang="scss" scoped>
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
      color: #1AAFA7;
      padding: 10px 23px;
      margin-right: 20px;
      margin-left: 0;
      &:last-child {
        color: #999;
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
