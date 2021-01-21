<template>
  <div class="paper-attribute">
    <h2>试卷属性</h2>
    <el-cascader placeholder="选择学科" v-model="formGroup.subjectId" :options="subjectList" :props="{ value: 'code', label: 'name', children: 'child' }" size="medium" @change="getSelectList" />
    <el-select placeholder="选择年级" v-model="formGroup.gradeId" size="medium">
      <el-option v-for="o in selectMap.gradeList" :key="o.id" :value="o.id" :label="o.name" />
    </el-select>
    <el-select placeholder="选择年份" v-model="formGroup.year" size="medium">
      <el-option v-for="o in selectMap.yearList" :key="o.id" :value="o.id" :label="o.name" />
    </el-select>
    <el-select placeholder="选择来源" v-model="formGroup.source" size="medium" v-if="selectMap.sourceList.length > 1">
      <el-option v-for="o in selectMap.sourceList" :key="o.id" :value="o.id" :label="o.name" />
    </el-select>
    <h2>试卷排版</h2>
    <div class="paper-typesetting">
      <el-radio-group v-model="formGroup.format" @change="formatChange">
        <el-radio :label="1">普通试卷</el-radio>
        <el-radio :label="2">正式试卷</el-radio>
      </el-radio-group>
      <div class="format-child" v-show="formGroup.format === 1">
        <el-checkbox :modelValue="!!formGroup.showTitle" @change="formGroup.showTitle = Number($event)">试卷名称</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showTime" @change="formGroup.showTime = Number($event)">时间&总分</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showOrgInfo" @change="formGroup.showOrgInfo = Number($event)">机构信息</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showStuInfo" @change="formGroup.showStuInfo = Number($event)">考生信息</el-checkbox>
      </div>
      <div class="format-child" v-show="formGroup.format === 2">
        <el-checkbox :modelValue="!!formGroup.showTitle" @change="formGroup.showTitle = Number($event)">试卷名称</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showTime" @change="formGroup.showTime = Number($event)">时间&总分</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showOrgInfo" @change="formGroup.showOrgInfo = Number($event)">机构信息</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showStuInfo" @change="formGroup.showStuInfo = Number($event)">考生信息</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showScore" @change="formGroup.showScore = Number($event)">大题评分区</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showSealing" @change="formGroup.showSealing = Number($event)">密封线</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showSideTitle" @change="formGroup.showSideTitle = Number($event)">试卷副标题</el-checkbox>
        <el-checkbox :modelValue="!!formGroup.showChapterScore" @change="formGroup.showChapterScore = Number($event)">大题分值</el-checkbox>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import store from './../store/index';
import axios from 'axios';
import { AxResponse } from '/@/core/axios'
import { useStore } from 'vuex';
import emitter from '/@/utils/mitt';

export default {
  setup() {
    let baseStore = useStore();

    let subjectList = ref([]);
    axios.post<any, AxResponse>('/permission/user/userDataSubjects').then(res => subjectList.value = res.json )

    let selectMap: any = reactive({
      gradeList: [{ name: '所有', id: '' }],
      yearList: [{ name: '所有', id: '' }],
      sourceList: [{ name: '所有', id: '' }]
    });

    let paperInfo = computed(() => store.state.paperInfo);

    let formGroup: any = reactive({});

    watch(formGroup, (v) => store.commit('set_paper_info', v))

    const getSelectList = (val?) => {
      let userId = computed(() => baseStore.getters.userInfo.user.id).value;
      axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode: val && val[1] ? val[1] : formGroup.subjectId }).then(res => {
        selectMap.gradeList = [{ name: '所有', id: '' }, ...res.json.grades];
        selectMap.yearList = [{ name: '所有', id: '' }, ...res.json.years];
        selectMap.courseTypeList = [{ name: '所有', id: '' }, ...res.json.courseTypes];
        if (val) {
          formGroup.gradeId = '';
          formGroup.year = '';
        }
      });
    }
    
    emitter.on('ready', () => {
      Object.keys(paperInfo.value).map(key => formGroup[key] = paperInfo.value[key]);
      axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'QUES_SOURCE' }).then(res => selectMap.sourceList = res.json['QUES_SOURCE'])
      getSelectList();
    });

    const formatChange = () => {
      formGroup.showTitle = 1;
      formGroup.showTime = 1;
      formGroup.showOrgInfo = 1;
      formGroup.showStuInfo = 1;
      formGroup.showScore = formGroup.format === 1 ? 0 : 1;
      formGroup.showSealing = formGroup.format === 1 ? 0 : 1;
      formGroup.showSideTitle = formGroup.format === 1 ? 0 : 1;
      formGroup.showChapterScore = formGroup.format === 1 ? 0 : 1;
      emitter.emit('test-paper-change');
    }

    return { selectMap, subjectList, formGroup, getSelectList, formatChange }
  }
}
</script>
<style lang="scss">
.paper-attribute {
  h2 {
    margin-bottom: 15px;
    line-height: 40px;
    text-align: center;
    background: #F5F7FA;
    border-radius: 4px;
  }
  & > .el-select,
  & > .el-cascader {
    width: 100%;
    margin-bottom: 15px;
  }
  & > .el-select:last-of-type {
    margin-bottom: 30px;
  }
  .paper-typesetting {
    padding: 0 5px;
  }
  .format-child .el-checkbox {
    margin-top: 17px;
    margin-right: 8px;
    &:nth-child(2n) {
      margin-right: 0;
    }
    .el-checkbox__label {
      width: 80px;
    }
  }
}
</style>
