<template>
  <HeaderComponent :loading="loading" ref="headerRef" @question-type-change="change" />
  <ContentComponent :loading="loading" ref="contentRef" />
  <SourceComponent :loading="loading" ref="sourceRef" />
</template>

<script lang="ts">
import { ref, Ref, reactive, computed, getCurrentInstance, onMounted } from 'vue';
import HeaderComponent from './update-section/header.vue';
import ContentComponent from './update-section/content.vue';
import SourceComponent from './update-section/source.vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash';

export default {
  components: { HeaderComponent, ContentComponent, SourceComponent },
  props: ['id'],
  setup(props) {
    let store = useStore()
    let headerRef: Ref<any> = ref(null);
    let contentRef: Ref<any> = ref(null);
    let sourceRef: Ref<any> = ref(null);

    /* ------------- 保存 ------------- */
    let subjectId = computed(() => store.getters.subject.code).value;
    const save = async (resolve, reject) => {
      let contentGroup = contentRef.value.validator();
      let headerGroup = cloneDeep(headerRef.value.formGroup);
      let sourceGroup = cloneDeep(sourceRef.value.questionSources);
      if (contentGroup) {
         sourceGroup && sourceGroup.map(s => {
          if (s.provinceCity && s.provinceCity[2]) {
            let [ provinceId, cityId, areaId ] = s.provinceCity;
            s.provinceId = provinceId; s.cityId = cityId; s.areaId = areaId;
          }
          delete s.schoolList;
          delete s.provinceCity;
          return s;
        })
        contentGroup.basicQuestionType = contentGroup.baseType;
        let params = { ...contentGroup, ...headerGroup, subjectId, id: props.id, questionSources: sourceGroup, operationType: 1 };
        let url = `/tiku/question/${props.id ? 'editQuestion' : 'add'}`
        let res = await axios.post<null, AxResponse>(url, params, { headers: { 'Content-Type': 'application/json' } });
        ElMessage[res.result ? 'success' : 'warning'](res.msg || `${props.id ? '编辑' : '添加'}试题成功`);
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
      let { knowledgePoints, type, difficult, year, source, category, title, analysis, basicQuestionType, gradeId} = info;
      info.questionSources && info.questionSources.map(s => {
        if (s.areaId) {
          s.provinceCity = [ s.provinceId, s.cityId, s.areaId ];
          sourceRef.value.getSchoolList(s.provinceCity, s);
        }
        return s;
      })

      headerRef.value.formGroup.knowledgePoints = knowledgePoints || [];
      headerRef.value.formGroup.type = type;
      headerRef.value.formGroup.difficult = difficult;
      headerRef.value.formGroup.year = year;
      headerRef.value.formGroup.source = source;
      headerRef.value.formGroup.category = category;
      headerRef.value.formGroup.gradeId = gradeId;


      if (basicQuestionType === 9) {
        contentRef.value.formGroup.title = `${ title }<br>${ info.childs.map((i, idx) => `${idx + 1}.${i.title}<br>${ i.option ? i.option.map(c => `${c.name}.${c.content}`).join('<br>') : [] }`).join('<br>') }`
      } else if (basicQuestionType === 10) {
        contentRef.value.formGroup.title = `${ title }<br>${ info.option.map(i => `${i.name}.<br>${ i.childs.map(c => `${c.name}.${c.content}`).join('<br>') }`).join('<br>') }`
      } else {
        contentRef.value.formGroup.title = title;
      }
      contentRef.value.formGroup.analysis = analysis;
      contentRef.value.baseType = basicQuestionType;

      if (basicQuestionType < 3) {
        contentRef.value.options = info.option && info.rightAnswer !== null ? info.option.map(i => {i.checked = !!info.rightAnswer.find(a => a.no === i.no); return i}) : [
          { no: 1, content: null, checked: false },
          { no: 2, content: null, checked: false },
          { no: 3, content: null, checked: false },
          { no: 4, content: null, checked: false }
        ];
      } else if (basicQuestionType === 3) {
        contentRef.value.options = info.rightAnswer;
      } else {
        contentRef.value.answer = info.rightAnswer[0].content;
      }
      loading.value = false;
      setTimeout(() => {
        sourceRef.value.questionSources = info.questionSources || [];
      });
      
    }

    return { headerRef, contentRef, sourceRef, save, change, loading }
  }
}
</script>

<style lang="scss" scoped>
</style>
