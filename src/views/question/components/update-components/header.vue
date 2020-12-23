<template>
  <div class="form-group">
    <div class="control">
      <span>知识点</span>
      <el-popover placement="bottom-start" :width="220">
        <KnowledgeTreeComponent hide-search @check-change="formGroup.knowledgePoints = $event" />
        <template #reference>
          <el-input readonly placeholder="选择知识点" size="small"
            :model-value="formGroup.knowledgePoints.length ? `已选择${formGroup.knowledgePoints.length}项` : null" 
          />
        </template>
      </el-popover>
    </div>
    <div class="control">
      <span>题型</span>
      <el-select size="small" placeholder="请选择题型" v-model="formGroup.questionType">
        <el-option />
      </el-select>
    </div>
    <div class="control">
      <span>难度</span>
      <el-select size="small" placeholder="请选择难度" v-model="formGroup.difficult">
        <el-option />
      </el-select>
    </div>
    <div class="control">
      <span>年份</span>
      <el-select size="small" placeholder="请选择年份" v-model="formGroup.year">
        <el-option />
      </el-select>
    </div>
    <div class="control">
      <span>来源</span>
      <el-select size="small" placeholder="请选择来源" v-model="formGroup.source">
        <el-option />
      </el-select>
    </div>
    <div class="control">
      <span>类别</span>
      <el-select size="small" placeholder="请选择类别" v-model="formGroup.category">
        <el-option />
      </el-select>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, computed } from 'vue'
import KnowledgeTreeComponent from './../knowledge-tree.vue';
import { useStore } from 'vuex';
import axios from 'axios';
import { AxResponse } from './../../../../core/axios';

export default {
  components: { KnowledgeTreeComponent },
  setup() {
    let store = useStore();
    let formGroup = reactive({
      knowledgePoints: [],
      questionType: null,
      difficult: null,
      year: null,
      source: null,
      category: null
    });
    let subject = computed(() => store.getters.subject.code);
    let userId = computed(() => store.getters.userInfo.user.id);

    let selectMap = reactive({
      gradeList: [],
      questionTypeList: [],
      difficultyList: [ { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
      yearList: [],
      sourceList: [ { name: '单元测试', id: 1 }, { name: '月考', id: 2 }, { name: '期中', id: 3 }, { name: '期末', id: 4 }, { name: '竞赛', id: 5 }, { name: '错题本', id: 6 } ],
      categoryList: [ { name: '真题', id: 1 }, { name: '好题', id: 2 }, { name: '常考题', id: 3 }, { name: '压轴题', id: 4 }, { name: '易错题', id: 5 } ],
    })
    axios.post<null, AxResponse>('/tiku/questionType/queryTypeBySubject', { subject }).then(res => selectMap.questionTypeList = res.json);
    axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode: subject }).then(res => {
      selectMap.gradeList = res.json.grades;
      selectMap.yearList = res.json.years;
    })

    return { formGroup, selectMap }
  }
}
</script>

<style lang="scss" scope>
.form-group {
  .control {
    display: inline-block;
    &:not(:last-child) {
      margin-right: 20px;
    }
    & > span {
      color: #333;
      font-size: 12px;
      margin-right: 6px;
    }
    & > div {
      width: 120px;
    }
  }
}
</style>