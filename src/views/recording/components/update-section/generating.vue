<template>
  <cus-skeleton :loading="loading">
    <cus-form ref="formRef" :nodes="controls" />
  </cus-skeleton>
</template>

<script lang="ts">
import { ref } from 'vue'
import axios from 'axios';
import { useStore } from 'vuex';
import { AxResponse } from './../../../../core/axios';
export default {
  props: ['questions', 'id'],
  setup(props) {
    let store = useStore();

    let controls = ref([
      { label: '试卷名称', key: 'title', type: 'input', rule: { required: 'true', message: '请输入试卷名称' } },
      { label: '学科', key: 'hide', type: 'input', disabled: true, default: store.getters.subject.name, rule: { required: 'true' } },
      { label: '年级', key: 'gradeId', type: 'select', options: [], rule: { required: 'true', message: '请选择年级' } },
      { label: '年份', key: 'year', type: 'select', options: [], rule: { required: 'true', message: '请选择年份' } },
      { key: 'subjectId', type: 'hidden', default: store.getters.subject.code },
    ]);

    let loading = ref(true);
    let userId = store.getters.userInfo.user.id;
    let subjectCode = store.getters.subject.code;
    axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode }).then(res => {
      controls.value[2].options = res.json.grades
      controls.value[3].options = res.json.years
      loading.value = false;
    })

    let formRef = ref();

    const save = (resolve, reject) => {
      formRef.value.validate(async valid => {
        let res = await axios.post<null, AxResponse>('/tiku/paper/addPaper', Object.assign(
          {
            questions: props.questions.map(i => ({ score: 0, subjectId: i.subjectId, questionId: i.id })),
            sourceFrom: 4
          },
          valid
        ), { headers: { 'Content-Type': 'application/json' } });
        if (res.result) {
          await axios.post<null, AxResponse>('/admin/questionImportLog/bindQuestionImportLogPaper', { importLogId: props.id, paperId: res.json.id })
          resolve(res)
        } else {
          reject();
        }
      })
    }
    return { controls, loading, formRef, save }
  }
}
</script>
