<template>
  <div class="tool-item-content">
    <h4>
      <i class="el-icon-arrow-left" @click.stop="indexChange(-1)" :class="{ 'is__disabled': index === 0 }" />
      <span>第<i>{{ index + 1 }}</i>题</span>
      <i class="el-icon-arrow-right" @click.stop="indexChange(1)" :class="{ 'is__disabled': index === dataset.length - 1}" />
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
            <el-select size="medium" placeholder="选择年级" v-model="data.grade" v-if="selectMap.gradeList.length">
              <el-option v-for="option in selectMap.gradeList" :key="option.id" :value="option.id" :label="option.name" />
            </el-select>
          </div>
        </div>
      </div>
      <div class="flex-box">
        <div class="flex-cell">
          <div class="tool-label">题型</div>
          <div class="tool-control">
            <el-select size="medium" placeholder="选择题型" v-model="data.type" v-if="selectMap.questionTypeList.length">
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
              <el-option v-for="option in selectMap.categoryList" :key="option.id" :value="option.id" :label="option.name" />
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
            <el-popover placement="bottom-start" :width="220">
              <KnowledgeComponent @check-change="data.knowledgePoints = $event" />
              <template #reference>
                <el-input :model-value="data.knowledgePoints && data.knowledgePoints.length ? `已选择${data.knowledgePoints.length}项` : null" readonly placeholder="选择知识点" size="medium" />
              </template>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <template v-if="data.questionSources">
      <div class="source-box" v-for="(s, idx) in data.questionSources" :key="s">
        <h6><span>来源{{ idx + 1 }}</span><i class="el-icon-circle-close" @click="delSource(idx)" /></h6>
        <div class="source-item">
          <el-select placeholder="选择年份" size="medium" v-model="s.year"></el-select>
          <el-select placeholder="选择来源" size="medium" v-model="s.dictSourceId"></el-select>
        </div>
        <div class="source-item">
          <el-select placeholder="选择省市区" size="medium"></el-select>
        </div>
        <div class="source-item">
          <el-select placeholder="选择学校" size="medium" v-model="s.publicSchoolId"></el-select>
        </div>
      </div>
    </template>
    <div class="add-source-btn"><el-button icon="el-icon-circle-plus" size="medium" @click="addSource">添加来源</el-button></div>
  </div>

  <div class="turn-sync-switch">
    <span>同步标签设置到所有题目</span><el-switch :modelValue="isSync" @update:modelValue="isSyncChange" />
  </div>
</template>

<script lang="ts">
import { ref, Ref, computed, reactive } from 'vue';
import store from './../store';
import axios from 'axios';
import { AxResponse } from './../../../../core/axios';
import { useStore } from 'vuex';
import KnowledgeComponent from './knowledge.vue';

export default {
  components: { KnowledgeComponent },
  setup() {
    let baseStore = useStore();
    let data: Ref<any> = computed(() => store.state.focusData);
    let dataset: Ref<any[]> =  computed(() => store.state.dataSet);
    let index: Ref<number> = computed(() => dataset.value.findIndex((i: any) => i.id === data.value.id) );

    let isSync: Ref<boolean> = computed(() => store.state.isSync);
    const isSyncChange = () => store.commit('set_is_sync', !isSync.value);

    const indexChange = (n: number) => {
      store.commit('set_focus_data', dataset.value[index.value + n]);
    }

    let selectMap: any = reactive({
      gradeList: [],
      questionTypeList: [],
      difficultyList: [ { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
      yearList: [],
      sourceList: [ { name: '单元测试', id: 1 }, { name: '月考', id: 2 }, { name: '期中', id: 3 }, { name: '期末', id: 4 }, { name: '竞赛', id: 5 }, { name: '错题本', id: 6 } ],
      categoryList: [ { name: '真题', id: 1 }, { name: '好题', id: 2 }, { name: '常考题', id: 3 }, { name: '压轴题', id: 4 }, { name: '易错题', id: 5 } ],
    });
    (getters => {
      let subject = computed(() => getters.subject.code).value;
      let userId = computed(() => getters.userInfo.user.id).value;
      axios.post<null, AxResponse>('/tiku/questionType/queryTypeBySubject', { subject }).then(res => selectMap.questionTypeList = res.json );
      axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode: subject }).then(res => {
        selectMap.gradeList = res.json.grades;
        selectMap.yearList = res.json.years;
      });
    })(baseStore.getters);

    const addSource = () => {
      let init = {};
      data.value.questionSources ? data.value.questionSources.push(init) : (data.value.questionSources = [ init ]);
    }

    const delSource = (index) => {
      data.value.questionSources.splice(index, 1);
    }

    return { data, dataset, index, indexChange, isSync, isSyncChange, selectMap, addSource, delSource }
  }
}
</script>

<style lang="scss" scope>
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
        .el-select {
          width: 100%;
          input {
            padding-left: 10px;
          }
        }
      }
    }
  }
  .source-box {
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
  .add-source-btn {
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
</style>