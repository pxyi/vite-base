<template>
  <div class="tool-item-content" v-if="data">
    <div class="go-back"><span @click="goBack"><i class="el-icon-arrow-left" /><i class="el-icon-arrow-left" /><i class="el-icon-arrow-left" /><span>返回题目列表</span></span></div>
    <h4 class="title">
      <i class="el-icon-arrow-left" @click.stop="indexChange(-1)" :class="{ 'is__disabled': index === 0 }" />
      <span>第<i>{{ index + 1 }}</i>题</span>
      <i class="el-icon-arrow-right" @click.stop="indexChange(1)" :class="{ 'is__disabled': index === dataset.length - 1 }" />
    </h4>

    <!-- <div class="tool-tabs">
      <div v-for="t in toolTabList" :key="t.i" :class="{ 'is__current': t.i === currentToolIndex }" @click="currentToolIndex = t.i">{{ t.n }}</div>
    </div> -->

    <!-- <div v-show="currentToolIndex === 1"> -->
      <div class="tool-item-main">
        <div class="flex-box">
          <div class="flex-cell">
            <div class="tool-label">学科</div>
            <div class="tool-control"><span>{{ data.subjectName }}</span></div>
          </div>
          <div class="flex-cell">
            <div class="tool-label">年级</div>
            <div class="tool-control">
              <el-select size="medium" placeholder="选择年级" v-model="data.gradeId" v-if="selectMap.gradeList.length">
                <el-option v-for="option in selectMap.gradeList" :key="option.id" :value="option.id" :label="option.name" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="flex-box">
          <div class="flex-cell">
            <div class="tool-label">题型</div>
            <div class="tool-control">
              <el-select size="medium" placeholder="选择题型" v-model="data.type" v-if="selectMap.questionTypeList.length" @change="typeChange($event)">
                <el-option v-for="option in selectMap.questionTypeList" :key="option.jyQuestionType" :value="option.jyQuestionType" :label="option.jyQuestionTypeName" />
              </el-select>
            </div>
          </div>
        </div>
        <div class="flex-box">
          <div class="flex-cell">
            <div class="tool-label">类别</div>
            <div class="tool-control">
              <el-select size="medium" placeholder="选择类别" v-model="data.category" v-if="selectMap.categoryList.length">
                <el-option v-for="option in selectMap.categoryList" :key="option.val" :value="option.val" :label="option.name" />
              </el-select>
            </div>
          </div>
          <div class="flex-cell">
            <div class="tool-label">难度</div>
            <div class="tool-control">
              <el-select size="medium" placeholder="选择难度" v-model="data.difficult" v-if="selectMap.difficultyList.length">
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
              :props="{ lazy: true, lazyLoad: getProvinceCity, label: 'name', value: 'id', checkStrictly: true }"
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
      <div class="add-source"><el-button icon="el-icon-circle-plus" size="small" @click="addSource">添加来源</el-button></div>

    <!-- </div>

    <div v-show="currentToolIndex === 2">
      <KnowledgeTreeComponent />
    </div>

    <div v-show="currentToolIndex === 3">
      <ChapterTreeComponent />
    </div> -->

  </div>

  <div class="turn-sync-switch" v-if="data">
    <el-popconfirm title="确认同步标签设置到所有题目吗？" confirmButtonText="确定" cancelButtonText="取消" @confirm="syncLabel">
      <template #reference>
        <el-button size="mini" type="primary" plain>点击同步标签设置到所有题目</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script lang="ts">
import { ref, Ref, computed, reactive, watch, nextTick } from 'vue';
import KnowledgeTreeComponent from '/@/views/common/knowledge-tree.vue';
import ChapterTreeComponent from '/@/views/common/chapter-tree.vue';
import store from './../store';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import { useStore } from 'vuex';
import { cloneDeep } from 'lodash';
import { ElMessage } from 'element-plus';
import { ScrollTop } from "/@/utils/base";

export default {
  components: { KnowledgeTreeComponent, ChapterTreeComponent },
  setup() {
    let baseStore = useStore();
    let dataset: Ref<any[]> =  computed({
      get: () => store.state.dataSet,
      set: (val) => store.commit('set_data_set', val)
    });
    let data: Ref<any> = computed(() => dataset.value[store.state.checkedIndex]);
    let index: Ref<number> = computed(() => dataset.value.findIndex((i: any) => i.id === data.value.id) );

    const indexChange = (n: number) => {
      store.dispatch('checked_index_change', dataset.value.findIndex(i => i.id === dataset.value[index.value + n].id));
      nextTick(() => {
        let top = (document.querySelector('.main-content .item.is__focus') as HTMLElement).offsetTop;
        ScrollTop(document.querySelector('.main-content') as Element, top - 60, 300);
      })
    }

    let selectMap: any = reactive({
      gradeList: [],
      questionTypeList: [],
      difficultyList: [ { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
      categoryList: [],
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

      axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'YEAR,QUES_SOURCE,QUES_CATEGORY' }).then(res => {
        selectMap.YEAR = res.json.YEAR;
        selectMap.QUES_SOURCE = res.json.QUES_SOURCE;
        selectMap.categoryList = res.json.QUES_CATEGORY;
      });
    })(baseStore.getters);

    const getProvinceCity = async ({ data }, resolve) => {
      let res = await axios.post<null, AxResponse>('/system/area/queryByParentId', { parentId: data.id ? data.id : null });
      resolve(res.json);
    }

    const getSchoolList = async (e, source) => {
      if (e && e[2]) {
        let res = await axios.post<null, AxResponse>('/admin/publicSchool/queryAll', { areaId: e[2] });
        source.schoolList = res.json;
      }
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
      let current = selectMap.questionTypeList.find(i => i.jyQuestionType === data.value.type);

      data.value.basicQuestionType = current.toolQuestionType;
      data.value.questionTypeName = current.jyQuestionTypeName;
      let focusId = data.value.id;

      let cloneData = cloneDeep(dataset.value);
      cloneData = cloneData.map(q => {
        if (q.id === focusId) {
          q.basicQuestionType = current.toolQuestionType;
          q.questionTypeName = current.jyQuestionTypeName;
        }
        return q;
      });
      dataset.value = cloneData;
    }

    const goBack = () => store.dispatch('checked_index_change', -1);

    const syncLabel = () => {
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
      ElMessage.success('同步标签至所有题目完毕~！');
    }

    let toolTabList = [ { n: '设置熟悉', i: 1 }, { n: '知识点绑定', i: 2 }, { n: '章节绑定', i: 3 } ];
    let currentToolIndex = ref(1);

    return { data, dataset, index, indexChange, selectMap, addSource, delSource, knowledgeList, typeChange, getProvinceCity, getSchoolList, goBack, syncLabel, toolTabList, currentToolIndex }
  }
}
</script>

<style lang="scss" scoped>
.tool-item-content {
  padding: 10px 20px 20px;
  flex: auto;
  overflow: auto;
  .go-back {
    width: 100%;
    padding-left: 24px;
    color: #3D4145;
    font-size: 12px;
    line-height: 24px;
    background: #F5F9FD;
    position: absolute;
    top: 0;
    left: 0;
    i {
      margin-left: -6px;
    }
    span {
      cursor: pointer;
    }
  }
  h4.title {
    display: flex;
    padding: 0 10px;
    margin: 0 0 10px;
    i {
      width: 16px;
      font-size: 16px;
      line-height: 40px;
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
        margin: 0 8px;
      }
    }
  }
  .tool-tabs {
    display: flex;
    padding: 0 10px;
    margin-bottom: 20px;
    & > div {
      padding: 8px 6px;
      color: #77808D;
      position: relative;
      cursor: pointer;
      &:first-child {
        margin-right: auto;
      }
      &:nth-child(2) {
        margin: 0 auto;
      }
      &:last-child {
        margin-left: auto;
      }
      &.is__current::after {
        opacity: 1;
      }
      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 4px;
        background: #1AAFA7;
        border-radius: 4px;
        position: absolute;
        bottom: 0;
        left: 0;
        opacity: 0;
        transition: all .25s;
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
    padding: 10px 15px 15px;
    background: #F5F7FA;
    border-radius: 6px;
    margin-bottom: 20px;
    h6 {
      margin-bottom: 10px;
      span {
        color: #1AAFA7;
      }
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
  .el-button {
    width: 100%;
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
