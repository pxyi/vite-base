<template>
  <div class="container">
    <div class="header">
      <!-- <div class="title"><input v-model="formGroup.title" placeholder="请输入试卷标题" /></div> -->
      <div class="btns"><el-button round @click="save" :loading="saveLoading">生成试卷</el-button></div>
    </div>
    <div class="content">
      <div class="generating-container">
        <div class="knowledge-tree"><KnowledgeTreeComponent @check-node-change="checkNodeChange" /></div>
        <div class="section-main">
          <div class="title">
            <h2><span>只需三步</span><i>快速组卷</i></h2>
            <div>选择知识点</div>
            <div><img src="/src/assets/test-paper/generating-allow-right.png" alt="."></div>
            <div>设置试题选项</div>
            <div><img src="/src/assets/test-paper/generating-allow-right.png" alt="."></div>
            <div>生成试卷</div>
          </div>
          <div class="main">
            <div class="section flex">
              <div class="label">已选知识点</div>
              <div class="group">
                <div class="tag-group" :class="{ active: showKnowledgeAll }" v-if="knowledgeCheckNodes.length">
                  <el-tag v-for="tag in knowledgeCheckNodes" :key="tag.id" @close="handleClose(tag)" size="small" type="info" effect="plain" closable :disable-transitions="false">{{ tag.name }}</el-tag>
                </div>
                <div class="not-data" v-else>请在左侧选择知识点</div>
              </div>
              <div class="tool-btn" v-if="knowledgeCheckNodes.length">
                <div @click="knowledgeCheckNodes = []"><i class="el-icon-delete" /><span>清空</span></div>
                <i :class="[`el-icon-arrow-${ showKnowledgeAll ? 'up' : 'down' }`]" @click="showKnowledgeAll = !showKnowledgeAll" />
              </div>
            </div>
            <div class="section">
              <div class="label">试卷设置/题量/分值</div>
              <div class="control">
                <label>整体难度：</label>
                <div class="group">
                  <el-radio-group v-model="formGroup.difficult" @change="getQuestionType">
                    <el-radio v-for="o in selectMap.difficultyList" :key="o.id" :label="o.id">{{ o.name }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="control">
                <label>组卷类型：</label>
                <div class="group">
                  <el-radio-group v-model="formGroup.paperType">
                    <el-radio v-for="o in selectMap.typeList" :key="o.id" :label="o.id">{{ o.name }}</el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="control">
                <label>题型设置：</label>
                <div class="group">
                  <div class="checkbox-group" v-if="questionTypeList.length">
                    <div class="checkbox" 
                      v-for="q in questionTypeList" 
                      :key="q.typeName" 
                      :class="{ active: !!questionCheckedList.find(i => i.typeName === q.typeName) }"
                      @click="checkedChange(q)"
                    >
                      <span>{{ q.typeName }}（{{ q.questionTotalCount }}）</span>
                      <i class="el-icon-check" />
                    </div>
                  </div>
                  <div class="not-data" v-else>暂无题型，请重新选择知识点、难度</div>
                </div>
              </div>
              <div class="control">
                <label>题量设置：</label>
                <div class="group">
                  <h6>共{{ questionTotal }}题</h6>
                  <div class="group-box">
                    <div v-for="n in questionCheckedList" :key="n.typeName">
                      <span>{{ n.typeName }}：</span>
                      <el-input-number v-model="n.count" size="mini" controls-position="right" :min="1" :max="n.questionTotalCount" />
                      <div class="append">道</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="control">
                <label>分值设置：</label>
                <div class="group">
                  <h6>共{{ qeestionScore }}分</h6>
                  <div class="group-box">
                    <div v-for="n in questionCheckedList" :key="n.typeName" class="hide-icon">
                      <span>{{ n.typeName }}：</span>
                      <el-input-number v-model="n.score" size="mini" controls-position="right" :min="0" :max="99" />
                      <div class="append">分/题</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref, reactive, computed, inject } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import KnowledgeTreeComponent from './../../question/components/knowledge-tree.vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import emitter from './../../../utils/mitt';

export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    close: {
      type: Function,
      default: () => (() => {})
    }
  },
  components: { KnowledgeTreeComponent },
  setup(props) {
    let store = useStore();
    let formGroup = reactive({
      difficult: 11,
      paperType: 1
    })
    let knowledgeCheckNodes = ref([]);
    let showKnowledgeAll = ref(false);
    const checkNodeChange = (nodes) => {
      knowledgeCheckNodes.value = nodes.filter(node => !node.childs || !node.childs.length);
      getQuestionType();
    }

    let selectMap = {
      difficultyList: [{ name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
      typeList: [{ name: '关联出题', id: 1 }, { name: '精准组卷', id: 2 }]
    }

    let questionTypeList = ref([]);
    const getQuestionType = async () => {
      let params = {
        subject: store.getters.subject.code,
        difficult: formGroup.difficult,
        knowledgePoints: knowledgeCheckNodes.value.map((i: {id}) => i.id)
      }
      let res = await axios.post<null, AxResponse>('/tiku/question/getQuestionCountByType', params, { headers: { 'Content-Type': 'application/json' } });
      questionTypeList.value = res.json;
      questionCheckedList.value = [];
    }
    getQuestionType();
    
    let questionCheckedList: Ref<any[]> = ref([]);
    let questionTotal = computed(() => questionCheckedList.value.reduce((t, n) => t += n.count, 0));
    let qeestionScore = computed(() => questionCheckedList.value.reduce((t, n) => t += n.score * n.count, 0));
    const checkedChange = (node) => {
      let index = questionCheckedList.value.findIndex((i: any) => i.typeName === node.typeName);
      index > -1 ? questionCheckedList.value.splice(index, 1) : questionCheckedList.value.push({...node, count: node.questionTotalCount, score: 0 });
    }
    let saveLoading = ref(false);
    const save = async () => {
      if (questionCheckedList.value.length) {
        saveLoading.value = true;
        let params = {
          ...props.data,
          ...formGroup,
          ...questionCheckedList.value.reduce((group, node) => {
            group.questionType.push(node.type);
            group.questionCount.push(node.count);
            group.questionScore.push(node.score);
            return group;
          }, { questionType: [], questionCount: [], questionScore: [] }),
          format: 1,
          sourceFrom: 2,
          knowledgeIds: knowledgeCheckNodes.value.map((i: {id}) => i.id)
        }
        let res = await axios.post<null, AxResponse>('/tiku/paper/intellectPaper', params, { headers: { 'Content-Type': 'application/json' } });
        ElMessage[res.result ? 'success' : 'warning'](res.result ? '生成试卷成功~！' : res.msg);
        saveLoading.value = false;
        if (res.result) {
          emitter.emit('add-test-paper-success', res.json);
          props.close();
        }
      } else {
        ElMessage.warning('请选择题型~！');
      }
    }

    return { save, saveLoading, formGroup, selectMap, getQuestionType, knowledgeCheckNodes, showKnowledgeAll, checkNodeChange, questionTypeList, questionCheckedList, questionTotal, qeestionScore, checkedChange }
  }
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #F4F5F9;
  .header {
    height: 60px;
    line-height: 60px;
    color: #fff;
    background: #1AAFA7;
    position: relative;
    .title {
      height: 60px;
      line-height: 60px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
      input {
        width: 300px;
        padding: 5px 20px;
        color: #fff;
        font-size: 24px;
        text-align: center;
        border: 0;
        border-bottom: solid 1px #fff;
        background: transparent;
        outline: none;
        &::placeholder {
          color: #eee;
        }
      }
    }
    .btns {
      margin-right: 30px;
      height: 60px;
      float: right;
      button {
        color: #1AAFA7;
        padding: 10px 23px;
      }
    }
  }
  .content {
    flex: 1 1 60px;
    padding: 20px 30px;
  }
}
.generating-container {
  display: flex;
  &, & > div {
    height: 100%;
  }
  .knowledge-tree {
    width: 250px;
    padding: 12px;
    margin-right: 20px;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #EBF0FC;
    box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
  }
  .section-main {
    display: flex;
    flex-direction: column;
    flex: 1 1 250px;
    height: 100%;
    overflow: auto;
  }
  .title {
    display: flex;
    margin-bottom: 20px;
    h2 {
      padding: 0 10px;
      margin-right: 20px;
      color: #fff;
      font-size: 12px;
      line-height: 42px;
      background: #FAAD14;
      position: relative;
      &::before {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border: solid 5px transparent;
        border-top-color: #FAAD14;
        border-left-color: #FAAD14;
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translate3d(0, 10px, 0);
      }
      i {
        font-size: 16px;
        margin-left: 15px;
      }
    }
    & > div {
      color: #77808D;
      line-height: 42px;
      img {
        display: inline-block;
        height: 20px;
        margin: 0 15px;
        vertical-align: sub;
      }
    }
  }
  .main {
    flex: 1 1 42px;
    padding: 20px 12px;
    background: #fff;
    .section {
      &.flex {
        display: flex;
        margin-bottom: 30px;
        .group {
          flex: 1 1 72px;
        }
        .tool-btn {
          text-align: right;
          cursor: pointer;
          div {
            color: #382A74;
            margin-bottom: 16px;
          }
        }
      }
      .not-data {
        color: #1AAFA7;
        line-height: 28px;
      }
      .tag-group {
        height: 67px;
        overflow: hidden;
        &.active {
          height: auto;
        }
        & > span {
          margin: 0 10px 10px 0;
        }
      }
    }
    .label {
      display: inline-block;
      height: 28px;
      padding: 0 10px;
      margin-right: 15px;
      line-height: 28px;
      background: rgba(26, 175, 167, 0.1);
      border-left: solid 2px #1AAFA7;
    }
    .control {
      display: flex;
      margin-top: 20px;
      & > label {
        display: block;
        width: 72px;
        line-height: 30px;
      }
      & > .group {
        flex: 1 1 72px;
        line-height: 30px;
        h6 {
          font-size: 12px;
          color: #77808D;
        }
        .group-box {
          display: flex;
          flex-wrap: wrap;
          & > div {
            margin-top: 10px;
            margin-right: 20px;
            position: relative;
            span {
              font-size: 12px;
            }
            .append {
              color: #909399;
              font-size: 12px;
              line-height: 30px;
              position: absolute;
              top: 0;
              right: 34px;
              pointer-events: none;
            }
          }
        }
        :deep(.group-box) {
          .el-input-number {
            width: 80px;
            input {
              padding-left: 10px;
              padding-right: 45px;
            }
          }
        }
        :deep(.hide-icon) {
          .append {
            right: 5px !important;
          }
          input {
            padding-right: 40px !important;
          }
          .el-input-number__increase,
          .el-input-number__decrease {
            display: none;
          }
        }
      }
    }
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;
      .checkbox {
        padding: 0 13px;
        margin-right: 10px;
        margin-bottom: 10px;
        height: 30px;
        font-size: 12px;
        line-height: 28px;
        border-radius: 3px;
        border: 1px solid #DCDFE6;
        position: relative;
        cursor: pointer;
        transition: all .2s;
        i { 
          height: 12px;
          color: #fff;
          text-align: center;
          line-height: 1;
          opacity: 0; 
          position: absolute;
          right: 0;
          bottom: 0;
        }
        &:hover {
          color: #1AAFA7;
          border-color: #1AAFA7;
        }
        &.active {
          color: #1AAFA7;
          border-color: #1AAFA7;
          i { opacity: 1; }
          &::before {
            content: '';
            display: block;
            width: 0;
            height: 0;
            border: solid 10px transparent;
            border-right-color: #1AAFA7;
            border-bottom-color: #1AAFA7;
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>