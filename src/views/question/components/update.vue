<template>
  <ContentComponent :loading="loading" ref="contentRef" />
  <HeaderComponent :loading="loading" ref="headerRef" @question-type-change="change" />
</template>

<script lang="ts">
import { ref, Ref, reactive, computed, getCurrentInstance, onMounted } from 'vue';
import HeaderComponent from './update-section/header.vue';
import ContentComponent from './update-section/content.vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash';

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
      let contentGroup = contentRef.value.validator();
      let headerGroup = cloneDeep(headerRef.value.formGroup)
      if (contentGroup) {
        headerGroup.questionSources.length && headerGroup.questionSources.map(s => {
          if (s.provinceCity) {
            let [ provinceId, cityId, areaId ] = s.provinceCity;
            s.provinceId = provinceId; s.cityId = cityId; s.areaId = areaId;
          }
          delete s.schoolList;
          delete s.provinceCity;
          return s;
        })
        let params = { ...contentGroup, ...headerGroup, subjectId, id: props.id };
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
      let { knowledgePoints, type, difficult, year, source, category, title, analysis, basicQuestionType} = info;
      info.questionSources && info.questionSources?.map(s => { 
        s.provinceCity = [ s.provinceId, s.cityId, s.areaId ];
        s.areaId && headerRef.value.getSchoolList(s.provinceCity, s)
        return s; 
      })

      headerRef.value.formGroup.knowledgePoints = knowledgePoints || [];
      headerRef.value.formGroup.type = type;
      headerRef.value.formGroup.difficult = difficult;
      headerRef.value.formGroup.year = year;
      headerRef.value.formGroup.source = source;
      headerRef.value.formGroup.category = category;
      headerRef.value.formGroup.questionSources = info.questionSources;

      contentRef.value.formGroup.title = title;
      contentRef.value.formGroup.analysis = analysis;
      contentRef.value.baseType = basicQuestionType;

      if (basicQuestionType < 3) {
        contentRef.value.options = info.option.map(i => {i.checked = !!info.rightAnswer.find(a => a.no === i.no); return i;});
      } else if (basicQuestionType === 3) {
        contentRef.value.options = info.rightAnswer;
      } else {
        contentRef.value.answer = info.rightAnswer[0].content;
      }
      loading.value = false;
      setTimeout(() => {
        headerRef.value.knowledgeRef.setCheckedKeys(knowledgePoints || []);
      });
    }

    return { headerRef, contentRef, save, change, loading }
  }
}
</script>

<style lang="scss" scope>
</style>