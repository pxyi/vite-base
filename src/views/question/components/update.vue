<template>
  <HeaderComponent :loading="loading" ref="headerRef" @question-type-change="change" />
  <ContentComponent :loading="loading" ref="contentRef" />
</template>

<script lang="ts">
import { ref, Ref, reactive, computed, getCurrentInstance, onMounted } from 'vue';
import HeaderComponent from './update-section/header.vue';
import ContentComponent from './update-section/content.vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

export default {
  components: { HeaderComponent, ContentComponent },
  props: ['id'],
  setup(props) {
    let store = useStore()
    let headerRef: Ref<any> = ref(null);
    let contentRef: Ref<any> = ref(null);

    /* ------------- 保存 ------------- */
    let subjectId = computed(() => store.getters.subject.code).value;
    const save = async (resolve, reject) => {
      let contentResult = contentRef.value.validator();
      if (contentResult) {
        let params = { ...contentResult, ...headerRef.value.formGroup, subjectId, id: props.id };
        let url = `/tiku/question/${props.id ? 'editQuestion' : 'add'}`
        let res = await axios.post<null, AxResponse>(url, params, { headers: { 'Content-Type': 'application/json' } });
        ElMessage[res.result ? 'success' : 'warning'](res.msg || '添加题目成功');
        resolve();
      } else {
        reject();
      }
    }

    /* ------------- 题型更改 ------------- */
    const change = (e) => contentRef.value.questionTypeChange(e);

    /* ------------- 编辑回显 ------------- */
    let loading = ref(false);
    if (props.id) {
      loading.value = true;
      axios.post<null, AxResponse>('/tiku/question/getQuestion', { id: props.id }).then(res => __init(res.json));
    }
    const __init = (info) => {
      let { knowledgePoints, type, difficult, year, source, category, title, analysis, basicQuestionType } = info;
      headerRef.value.formGroup.knowledgePoints = knowledgePoints || [];
      headerRef.value.formGroup.type = type;
      headerRef.value.formGroup.difficult = difficult;
      headerRef.value.formGroup.year = year;
      headerRef.value.formGroup.source = source;
      headerRef.value.formGroup.category = category;

      contentRef.value.formGroup.title = title;
      contentRef.value.formGroup.analysis = analysis;
      contentRef.value.baseType = basicQuestionType;
      if (basicQuestionType < 3) {
        contentRef.value.options = info.option;
      } else if (basicQuestionType === 3) {
        contentRef.value.options = info.rightAnswer;
      } else {
        contentRef.value.answer = info.rightAnswer[0].content;
      }
      loading.value = false;
    }

    return { headerRef, contentRef, save, change, loading }
  }
}
</script>

<style lang="scss" scope>
</style>