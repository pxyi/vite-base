<template>
  <div class="tool-item-content" v-if="data">
    <h4>
      <i class="el-icon-arrow-left" @click.stop="indexChange(-1)" :class="{ 'is__disabled': index === 0 || isSync }" />
      <span>第<i>{{ index + 1 }}</i>题</span>
      <i class="el-icon-arrow-right" @click.stop="indexChange(1)" :class="{ 'is__disabled': index === dataset.length - 1 || isSync}" />
    </h4>
    <div class="tool-item-main" v-if="data && data.id">
      <div class="flex-box">
        <div class="flex-cell">
          <div class="tool-label">学科</div>
          <div class="tool-control"><span>{{ data.subjectName }}</span></div>
        </div>
        <div class="flex-cell">
          <div class="tool-label">年级</div>
          <div class="tool-control">
            <el-select size="medium" placeholder="选择年级" v-model="data.gradeId" v-if="selectMap.gradeList.length" @change="syncChange('grade')">
              <el-option v-for="option in selectMap.gradeList" :key="option.id" :value="option.id" :label="option.name" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="flex-box">
        <div class="flex-cell">
          <div class="tool-label">题型</div>
          <div class="tool-control">
            <el-select size="medium" placeholder="选择题型" :disabled="isSync" v-model="data.type" v-if="selectMap.questionTypeList.length" @change="typeChange($event)">
              <el-option v-for="option in selectMap.questionTypeList" :key="option.jyQuestionType" :value="option.jyQuestionType" :label="option.jyQuestionTypeName" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="flex-box">
        <div class="flex-cell">
          <div class="tool-label">类别</div>
          <div class="tool-control">
            <el-select size="medium" placeholder="选择类别" v-model="data.category" v-if="selectMap.categoryList.length" @change="syncChange('category')">
              <el-option v-for="option in selectMap.categoryList" :key="option.id" :value="option.id" :label="option.name" />
            </el-select>
          </div>
        </div>
        <div class="flex-cell">
          <div class="tool-label">难度</div>
          <div class="tool-control">
            <el-select size="medium" placeholder="选择难度" v-model="data.difficult" v-if="selectMap.difficultyList.length" @change="syncChange('difficult')">
              <el-option v-for="option in selectMap.difficultyList" :key="option.id" :value="option.id" :label="option.name" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="flex-box">
        <div class="flex-cell">
          <div class="tool-label">知识点</div>
          <div class="tool-control">
            <el-cascader collapse-tags clearable placeholder="选择知识点" size="medium" :show-all-levels="false"
              v-model="data.knowledgePoints" 
              :options="knowledgeList" 
              :props="{ children: 'childs', label: 'name', value: 'id', multiple: true, emitPath: false }" 
            />
          </div>
        </div>
      </div>
    </div>
    <template v-if="data.questionSources">
      <div class="source-section" v-for="(s, idx) in data.questionSources" :key="s">
        <h6><span>来源{{ idx + 1 }}</span><i class="el-icon-circle-close" @click="delSource(idx)" /></h6>
        <div class="source-item">
          <el-select placeholder="选择年份" size="medium" v-model="s.year">
            <el-option v-for="option in selectMap.YEAR" :key="option.id" :value="option.id" :label="option.name" />
          </el-select>
          <el-select placeholder="试卷类型" size="medium" v-model="s.dictSourceId">
            <el-option v-for="option in selectMap.QUES_SOURCE" :key="option.id" :value="option.id" :label="option.name" />
          </el-select>
        </div>
        <div class="source-item">
          <el-cascader placeholder="选择省市区"
            v-model="s.provinceCity"
            :props="{ lazy: true, lazyLoad: getProvinceCity, label: 'name', value: 'id' }"
            @change="getSchoolList($event, s)"
          />
        </div>
        <div class="source-item">
          <el-select placeholder="选择学校" filterable size="medium" v-model="s.publicSchoolId">
            <el-option v-for="option in s.schoolList" :key="option.id" :value="option.id" :label="option.name" />
          </el-select>
        </div>
      </div>
    </template>
    <div class="add-source"><el-button icon="el-icon-circle-plus" size="medium" @click="addSource">添加来源</el-button></div>
  </div>

  <div class="turn-sync-switch" v-if="data">
    <span>同步标签设置到所有题目</span><el-switch :modelValue="isSync" @update:modelValue="syncTag" />
  </div>
</template>

<script lang="ts">
import { ref, Ref, computed, reactive, watch } from 'vue';
import store from './../store';
import axios from 'axios';
import { AxResponse } from './../../../../core/axios';
import { useStore } from 'vuex';
import KnowledgeComponent from './knowledge.vue';
import { cloneDeep } from 'lodash';

export default {
  components: { KnowledgeComponent },
  setup() {
    let baseStore = useStore();
    let data: Ref<any> = computed(() => store.state.focusData);
    let dataset: Ref<any[]> =  computed(() => store.state.dataSet);
    let index: Ref<number> = computed(() => dataset.value.findIndex((i: any) => i.id === data.value.id) );

    let isSync: Ref<boolean> = computed(() => store.state.isSync);
    const syncTag = () => {
      if (!isSync.value) {
        let cloneData = cloneDeep(dataset.value);
        cloneData = cloneData.map(d => {
          d.gradeId = data.value.gradeId;
          d.category = data.value.category;
          d.difficult = data.value.difficult;
          d.knowledgePoints = cloneDeep(data.value.knowledgePoints);
          d.questionSources = cloneDeep(data.value.questionSources);
          return d;
        });
        store.commit('set_data_set', cloneData);
      }
      store.commit('set_is_sync', !isSync.value);
    }

    const indexChange = (n: number) => {
      store.dispatch('focus_data_change', dataset.value[index.value + n]);
    }

    let selectMap: any = reactive({
      gradeList: [],
      questionTypeList: [],
      difficultyList: [ { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
      sourceList: [ { name: '单元测试', id: 1 }, { name: '月考', id: 2 }, { name: '期中', id: 3 }, { name: '期末', id: 4 }, { name: '竞赛', id: 5 }, { name: '错题本', id: 6 } ],
      categoryList: [ { name: '真题', id: 1 }, { name: '好题', id: 2 }, { name: '常考题', id: 3 }, { name: '压轴题', id: 4 }, { name: '易错题', id: 5 } ],
      YEAR: [],
      QUES_SOURCE: [],
      provinceList: []
    });
    let knowledgeList = ref([]);
    (getters => {
      let subject = computed(() => getters.subject.code).value;
      let userId = computed(() => getters.userInfo.user.id).value;
      axios.post<null, AxResponse>('/tiku/questionType/queryTypeBySubject', { subject }).then(res => selectMap.questionTypeList = res.json );
      axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode: subject }).then(res => {
        selectMap.gradeList = res.json.grades;
      });
      axios.post<any, AxResponse>('/tiku/knowledge/queryTree', { subjectId: subject }).then(res => {
        knowledgeList.value = JSON.parse(JSON.stringify(res.json).replaceAll('"childs":[]', '"childs":null'));
      } );

      axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'YEAR,QUES_SOURCE' }).then(res => {
        selectMap.YEAR = res.json.YEAR;
        selectMap.QUES_SOURCE = res.json.QUES_SOURCE;
      });
    })(baseStore.getters);

    const getProvinceCity = async ({ data }, resolve) => {
      let res = await axios.post<null, AxResponse>('/system/area/queryByParentId', { parentId: data.id ? data.id : null });
      resolve(res.json);
    }

    const getSchoolList = async (e, source) => {
      let res = await axios.post<null, AxResponse>('/admin/publicSchool/queryAll', { areaId: e[2] });
      source.schoolList = res.json;
    }

    watch(data, () => {
      if (data.value && data.value.questionSources) {
        data.value.questionSources.map(source => source.areaId && !source.schoolList && getSchoolList(source.provinceCity, source));
      }
    })

    const addSource = () => {
      data.value.questionSources ? data.value.questionSources.push({}) : (data.value.questionSources = [ {} ]);
    }

    const delSource = (index) => {
      data.value.questionSources.splice(index, 1);
    }

    const typeChange = () => {
      data.value.basicQuestionType = selectMap.questionTypeList.find(i => i.jyQuestionType === data.value.type).toolQuestionType;
    }

    const syncChange = (type) => {
      if (isSync.value) {
        if (type === 'type') {
          let basicQuestionType = selectMap.questionTypeList.find(i => i.jyQuestionType === data.value.type).toolQuestionType;
          dataset.value.map(d => {d[type] = data.value[type]; d.basicQuestionType = basicQuestionType; return d});
        } else {
          dataset.value.map(d => {d[type] = data.value[type]; return d});
        }
      }
    }

    return { data, dataset, index, indexChange, isSync, syncTag, syncChange, selectMap, addSource, delSource, knowledgeList, typeChange, getProvinceCity, getSchoolList }
  }
}
</script>

<style lang="scss" scoped>
.tool-item-content {
  padding: 20px;
  flex: auto;
  overflow: auto;
  h4 {
    display: flex;
    margin-bottom: 30px;
    i {
      width: 16px;
      font-size: 16px;
      cursor: pointer;
      &.is__disabled {
        opacity: .6;
        pointer-events: none;
      }
    }
    span {
      display: block;
      flex: auto;
      text-align: center;
      i {
        color: #1AAFA7;
        margin: 0 8px;
      }
    }
  }
  .tool-item-main {
    .flex-box {
      display: flex;
      margin-bottom: 15px;
      .flex-cell {
        flex: 1;
        display: flex;
      }
      .tool-label {
        width: 42px;
        line-height: 36px;
        text-align: right;
        margin-right: 10px;
      }
      .tool-control {
        flex: 1 1 42px;
        span {
          color: #1AAFA7;
          line-height: 36px;
        }
      }
      :deep(.tool-control) {
        .el-cascader {
          width: 100%;
        }
        .el-select {
          width: 100%;
          input {
            padding-left: 10px;
          }
        }
      }
    }
  }
  .source-section {
    padding: 15px;
    background: #F5F7FA;
    border-radius: 6px;
    margin-bottom: 20px;
    h6 {
      margin-bottom: 10px;
      i {
        float: right;
        color: #999;
        font-size: 16px;
        cursor: pointer;
      }
    }
    .source-item {
      display: flex;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
      & > * {
        flex: auto;
        &:nth-child(2) {
          margin-left: 18px;
        }
      }
    }
  }
  .add-source {
    button {
      width: 100%;
      background: #F5F7FA;
      border-radius: 6px;
      border: 1px dashed #77808D;
    }
  }
}
.turn-sync-switch {
  padding: 0 20px;
  .el-switch {
    float: right;
  }
}
.knowledge-tree-wrapper {
  max-height: 450px;
  overflow: auto;
  .knowledge-tree {
    min-width: 250px;
    .el-tree-node__content {
      height: 32px !important;
    }
  }
}

</style>
