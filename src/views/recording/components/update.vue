<template>
  <div class="container">
    <div class="header">
      <el-button :loading="saveLoading" round @click="save">保存并返回</el-button>
      <el-button round @click="generatePaper">生成试卷</el-button>
    </div>
    <div class="content">
      <div class="main" @click="blur"><MainComponent /></div>
      <div class="toolbar"><ToolbarComponent /></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, inject, getCurrentInstance } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import store from './store';
import axios from 'axios';
import MainComponent from './update-section/main.vue';
import ToolbarComponent from './update-section/toolbar.vue';
import { cloneDeep } from 'lodash';
import Modal from './../../../utils/modal';
import GeneratingComponent from './update-section/generating.vue';

export default {
  components: { MainComponent, ToolbarComponent },
  props: ['id'],
  setup(props) {
    let loading = ElLoading.service();

    store.commit('reset');

    let focusData = computed(() => store.state.focusData);

    let dataset = computed(() => store.state.dataSet);

    axios.post<null, { json: any[] }>('/admin/questionImportLog/queryQuestionByImportId', { importId: props.id }).then(res => {
      let questions = res.json[1].map(data => {
        if (data.basicQuestionType === 2 || data.basicQuestionType === 3 || data.basicQuestionType === 9 || data.basicQuestionType === 10) {
          let f = data.basicQuestionType === 2 ? ';' : ''
          data.answer = data.rightAnswer ? data.rightAnswer.map(i => i.content).join(f) : '';
        } else {
          data.answer = data.rightAnswer ? data.rightAnswer[0].content : '';
        }
        data.questionSources && data.questionSources.map(i => { i.provinceCity = i.areaId ? [ i.provinceId, i.cityId, i.areaId ] : null; return i; })
        return data;
      })
      store.commit('set_error_list', res.json[0]);
      store.commit('set_data_set', questions);
      loading.close();
    });

    const blur = () => store.dispatch('focus_data_change', null);

    let saveLoading = ref(false);
    const save = async () => {
      saveLoading.value = true;
      let questions = __cloneData(dataset.value);
      await axios.post('/tiku/question/batchSaveQuestion', { questionImportLogId: props.id, questions }, { headers: { 'Content-Type': 'application/json' } });
      (document.querySelector('.el-icon-back') as any).click();
    }

    const __cloneData = (data) => {
      let questions = cloneDeep(data).map(data => {
        if (data.basicQuestionType === 2 || data.basicQuestionType === 3 || data.basicQuestionType === 9 || data.basicQuestionType === 10) {
          if (data.answer) { data.answer = data.answer.replace(/<.*?>/g, '').replace(/[\r\n]/g, '') }
          let f = data.basicQuestionType === 3 ? (data.answer.includes(';') ? ';' : '；') : '';
          data.rightAnswer = data.answer.split(f).filter(i => !!i).map((a, idx) => ({ no: idx + 1, content: a }));
        } else if (data.answer) {
          data.rightAnswer = [ {no: 1, content: data.answer } ]
        }
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

    const generatePaper = () => {
      let questions = __cloneData(dataset.value);
      Modal.create({ component: GeneratingComponent, title: '生成试卷', width: 420, props: { questions } }).then((res: any) => {
        ElMessage[res.result ? 'success' : 'warning'](res.result ? '生成试卷成功' : '生成试卷失败，请重试');
      })
    }

    return { blur, save, saveLoading, generatePaper };

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