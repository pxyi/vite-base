<template>
<cus-skeleton :loading="loading">
  <div class="form-group">
    <div class="flex-cell">
      <div class="f-item" style="flex: 2.1">
        <div class="f-i-label">知识点</div>
        <div class="f-i-control">
          <el-popover placement="bottom-start" :width="220">
            <el-tree 
              class="knowledge-tree"
              :data="selectMap.knowledgeList"
              ref="knowledgeRef"
              show-checkbox
              node-key="id"
              :props="{ children: 'childs', label: 'name' }"
              @check="(target, { checkedKeys }) => { formGroup.knowledgePoints = checkedKeys; }"
            />
            <template #reference>
              <el-input readonly placeholder="选择知识点" size="medium"
                :model-value="formGroup.knowledgePoints.length ? `已选择${formGroup.knowledgePoints.length}项` : null" 
              />
            </template>
          </el-popover>
        </div>
      </div>
      <div class="f-item">
        <div class="f-i-label">类别</div>
        <div class="f-i-control">
          <el-select size="medium" placeholder="选择类别" v-model="formGroup.category">
            <el-option v-for="option in selectMap.categoryList" :key="option.id" :value="option.id" :label="option.name" />
          </el-select>
        </div>
      </div>
    </div>
    <div class="flex-cell">
      <div class="f-item">
        <div class="f-i-label">题型</div>
        <div class="f-i-control">
          <el-select size="medium" placeholder="选择题型" v-model="formGroup.type" v-if="selectMap.questionTypeList.length" @change="questionTypeChange">
            <el-option v-for="option in selectMap.questionTypeList" :key="option.jyQuestionType" :value="option.jyQuestionType" :label="option.jyQuestionTypeName" />
          </el-select>
        </div>
      </div>
      <div class="f-item">
        <div class="f-i-label">难度</div>
        <div class="f-i-control">
          <el-select size="medium" placeholder="选择难度" v-model="formGroup.difficult">
            <el-option v-for="o in selectMap.difficultyList" :key="o.id" :value="o.id" :label="o.name" />
          </el-select>
        </div>
      </div>
      <div class="f-item">
        <div class="f-i-label">年级</div>
        <div class="f-i-control">
          <el-select size="medium" placeholder="选择年级" v-model="formGroup.grade" v-if="selectMap.gradeList.length">
            <el-option v-for="option in selectMap.gradeList" :key="option.id" :value="option.id" :label="option.name" />
          </el-select>
        </div>
      </div>
    </div>
    <div class="source-box" v-for="(s, idx) in formGroup.questionSources" :key="s">
      <div class="source-label">来源{{ idx + 1 }}</div>
      <div class="source-main">
        <div class="source-cell">
          <div class="source-control">
            <el-select size="medium" placeholder="选择年份" v-model="s.year" v-if="selectMap.YEAR.length">
              <el-option v-for="o in selectMap.YEAR" :key="o.id" :value="o.id" :label="o.name" />
            </el-select>
          </div>
          <div class="source-control">
            <el-cascader placeholder="选择省市区" size="medium"
              v-model="s.provinceCity" 
              :props="{ lazy: true, lazyLoad: getProvinceCity, label: 'name', value: 'id' }" 
              @change="getSchoolList($event, s)"
            />
          </div>
        </div>
        <div class="source-cell">
          <div class="source-control">
            <el-select placeholder="试卷类型" size="medium" v-model="s.dictSourceId"  v-if="selectMap.QUES_SOURCE.length">
              <el-option v-for="option in selectMap.QUES_SOURCE" :key="option.id" :value="option.id" :label="option.name" />
            </el-select>
          </div>
          <div class="source-control">
            <el-select placeholder="选择学校" size="medium" v-model="s.publicSchoolId" >
              <el-option v-for="option in s.schoolList" :key="option.id" :value="option.id" :label="option.name" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="source-delete-btn" @click="formGroup.questionSources.splice(idx, 1)">删除</div>
    </div>

    <div class="add-source-btn" @click="addSource"><i class="el-icon-circle-plus" /><span>添加来源</span></div>
  </div>
</cus-skeleton>
</template>

<script lang="ts">
import { ref, reactive, computed } from 'vue'
import KnowledgeTreeComponent from './../knowledge-tree.vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { AxResponse } from './../../../../core/axios';

export default {
  props: ['loading'],
  components: { KnowledgeTreeComponent },
  setup(props, { emit }) {
    let store = useStore();
    let formGroup: any = reactive({
      knowledgePoints: [],
      type: 2,
      difficult: 11,
      year: null,
      source: null,
      category: null,
      grade: null,
      questionSources: [
        {
          year: null,
          dictSourceId: null,
          provinceCity: null,
          publicSchoolId: null
        }
      ]
    });
    let subject = computed(() => store.getters.subject.code).value;
    let userId = computed(() => store.getters.userInfo.user.id).value;

    let selectMap: any = reactive({
      knowledgeList: [],
      gradeList: [],
      questionTypeList: [],
      difficultyList: [ { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
      yearList: [],
      sourceList: [ { name: '单元测试', id: 1 }, { name: '月考', id: 2 }, { name: '期中', id: 3 }, { name: '期末', id: 4 }, { name: '竞赛', id: 5 }, { name: '错题本', id: 6 } ],
      categoryList: [ { name: '真题', id: 1 }, { name: '好题', id: 2 }, { name: '常考题', id: 3 }, { name: '压轴题', id: 4 }, { name: '易错题', id: 5 } ],
      YEAR: [],
      QUES_SOURCE: []
    });
    
    axios.post<null, AxResponse>('/tiku/questionType/queryTypeBySubject', { subject }).then(res => selectMap.questionTypeList = res.json );
    axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode: subject }).then(res => {
      selectMap.gradeList = res.json.grades;
      selectMap.yearList = res.json.years;
    });
    axios.post<any, AxResponse>('/tiku/knowledge/queryTree', { subjectId: subject }).then(res => selectMap.knowledgeList = res.json );
    axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'YEAR,QUES_SOURCE' }).then(res => {
      selectMap.YEAR = res.json.YEAR;
      selectMap.QUES_SOURCE = res.json.QUES_SOURCE;
    });

    const questionTypeChange = (e) => emit('question-type-change', selectMap.questionTypeList.find((q: any) => q.jyQuestionType === e));


    const getProvinceCity = async ({ data }, resolve) => {
      let res = await axios.post<null, AxResponse>('/system/area/queryByParentId', { parentId: data.id ? data.id : null });
      resolve(res.json);
    }

    const getSchoolList = async (e, source) => {
      let res = await axios.post<null, AxResponse>('/admin/publicSchool/queryAll', { areaId: e[2] });
      source.schoolList = res.json;
    }

    const addSource = () => {
      formGroup.questionSources.push({
        year: null,
        dictSourceId: null,
        provinceCity: null,
        publicSchoolId: null
      })
    }

    let knowledgeRef = ref();

    return { formGroup, selectMap, questionTypeChange, getProvinceCity, getSchoolList, addSource, knowledgeRef }
  }
}
</script>

<style lang="scss" scope>
.form-group {

  .flex-cell {
    display: flex;
    margin-bottom: 12px;
    .f-item {
      flex: 1;
      display: flex;
      &:not(:last-child) {
        margin-right: 20px;
      }
      .f-i-label {
        width: 44px;
        margin-right: 12px;
        color: #1AAFA7;
        line-height: 36px;
        text-align: right;
      }
      .f-i-control {
        flex: 1 1 44px;
      }
    }
  }
  .source-box {
    display: flex;
    padding: 10px;
    background: rgba(26, 175, 167, 0.1);
    border-radius: 6px;
    margin-bottom: 10px;
    .source-label {
      margin-right: 12px;
      color: #1AAFA7;
      line-height: 36px;
    }
    .source-main {
      flex: auto;
      .source-cell {
        display: flex;
        margin-bottom: 12px;
        .source-control {
          &:first-child {
            width: 130px;
            margin-right: 20px;
          }
          &:last-child {
            flex: 1 1 130px;
            & > div {
              width: 100%;
            }
          }
        }
      }
    }
    &:hover .source-delete-btn { 
      width: 20px;
    }
    .source-delete-btn {
      width: 0;
      height: 116px;
      padding-top: 24px;
      margin: -10px -10px -22px 10px;
      color: #fff;
      line-height: 30px;
      text-align: center;
      background: rgb(25 174 166);
      border-radius: 0 6px 6px 0;
      cursor: pointer;
      overflow: hidden;
      transition: all .25s;
    }
  }
  .add-source-btn {
    height: 36px;
    color: #1AAFA7;
    line-height: 36px;
    text-align: center;
    background: #DFEFF0;
    border-radius: 6px;
    border: 1px dashed #1AAFA7;
    cursor: pointer;
    &:active {
      opacity: .7;
    }
  }

  .knowledge-tree {
    .el-tree-node__content {
      height: 32px !important;
    }
  }
}
</style>