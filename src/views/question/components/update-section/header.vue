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
      grade: null
    });
    let subject = computed(() => store.getters.subject.code).value;
    let userId = computed(() => store.getters.userInfo.user.id).value;

    let selectMap: any = reactive({
      knowledgeList: [],
      gradeList: [],
      questionTypeList: [],
      difficultyList: [ { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
      sourceList: [ { name: '单元测试', id: 1 }, { name: '月考', id: 2 }, { name: '期中', id: 3 }, { name: '期末', id: 4 }, { name: '竞赛', id: 5 }, { name: '错题本', id: 6 } ],
      categoryList: [ { name: '真题', id: 1 }, { name: '好题', id: 2 }, { name: '常考题', id: 3 }, { name: '压轴题', id: 4 }, { name: '易错题', id: 5 } ],
    });
    
    axios.post<null, AxResponse>('/tiku/questionType/queryTypeBySubject', { subject }).then(res => selectMap.questionTypeList = res.json );
    axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode: subject }).then(res => {
      selectMap.gradeList = res.json.grades;
    });
    axios.post<any, AxResponse>('/tiku/knowledge/queryTree', { subjectId: subject }).then(res => selectMap.knowledgeList = res.json );

    const questionTypeChange = (e) => emit('question-type-change', selectMap.questionTypeList.find((q: any) => q.jyQuestionType === e));


    let knowledgeRef = ref();

    return { formGroup, selectMap, questionTypeChange, knowledgeRef }
  }
}
</script>

<style lang="scss" scope>
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
      }
    }
  }

  .knowledge-tree {
    .el-tree-node__content {
      height: 32px !important;
    }
  }
}
</style>