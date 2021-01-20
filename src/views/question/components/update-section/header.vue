<template>
<cus-skeleton :loading="loading">
  <div class="form-group">
    <div class="flex-cell">
      <div class="f-item" style="flex: 2.1">
        <div class="f-i-label">知识点</div>
        <div class="f-i-control">
          <el-cascader
            v-model="formGroup.knowledgePoints"
            :options="selectMap.knowledgeList"
            :props="{ multiple: true, children: 'childs', label: 'name', value: 'id', emitPath: false}"
            clearable
            size="medium"
            placeholder="选择知识点"
            :show-all-levels="false"
            collapse-tags
          />
        </div>
      </div>
      <div class="f-item">
        <div class="f-i-label">类别</div>
        <div class="f-i-control">
          <el-select size="medium" clearable placeholder="选择类别" v-model="formGroup.category">
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
          <el-select size="medium" clearable placeholder="选择难度" v-model="formGroup.difficult">
            <el-option v-for="o in selectMap.difficultyList" :key="o.id" :value="o.id" :label="o.name" />
          </el-select>
        </div>
      </div>
      <div class="f-item">
        <div class="f-i-label">年级</div>
        <div class="f-i-control">
          <el-select size="medium" clearable placeholder="选择年级" v-model="formGroup.gradeId" v-if="selectMap.gradeList.length">
            <el-option v-for="option in selectMap.gradeList" :key="option.id" :value="option.id" :label="option.name" />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</cus-skeleton>
</template>

<script lang="ts">
import { ref, reactive, computed, Ref } from 'vue'
import KnowledgeTreeComponent from './../knowledge-tree.vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import { log } from 'util';

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
      gradeId: null
    });
    let subject = computed(() => store.getters.subject.code).value;
    let userId = computed(() => store.getters.userInfo.user.id).value;
    let selectMap: any = reactive({
      knowledgeList: [],
      gradeList: [],
      questionTypeList: [], 
      difficultyList: [ { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
      categoryList: [ ],
    });

    axios.post<null, AxResponse>('/tiku/questionType/queryTypeBySubject', { subject }).then(res => selectMap.questionTypeList = res.json );
    axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode: subject }).then(res => {
      selectMap.gradeList = res.json.grades;
    });

    axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'QUES_CATEGORY' }).then(res => selectMap.categoryList = res.json.QUES_CATEGORY.map(i => { i.id = i.val; return i }) );
    axios.post<any, AxResponse>('/tiku/knowledge/queryTree', { subjectId: subject }).then(res => selectMap.knowledgeList = JSON.parse(JSON.stringify(res.json).replaceAll('"childs":[]', '"childs":null')));

    const questionTypeChange = (e) => emit('question-type-change', selectMap.questionTypeList.find((q: any) => q.jyQuestionType === e));

    let chooseArr: Ref<any>= ref([])

    return { formGroup, selectMap, questionTypeChange }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 20px;
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
        :deep(.el-cascader) {
          width:100%;
        }
      }
    }
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
