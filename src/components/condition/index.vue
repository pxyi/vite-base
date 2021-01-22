<template>
  <div class="cus__condition__container">
    <cus-skeleton :loading="loading">
      <div class="cus__condition__content">
        <div class="cus__condition__header">
          <template v-for="key in Object.keys(multipleGroup)" :key="key">
            <el-tag type="warning" effect="plain" size="small" closable v-if="multipleGroup[key].value.length" @close="multipleGroup[key].value = []; submit()">
              <i>{{ multipleGroup[key].label }}：</i>
              <span v-for="cell in multipleGroup[key].value" :key="cell.id">{{ cell.name }}</span>
            </el-tag>
          </template>
        </div>
        <template v-for="node in conditions" :key="node.key">
          <div class="cus__class__item" v-show="(!node.isHide || !multipleGroup[node.key]) && !multipleGroup[node.key]?.value.length">
            <div class="cus__class__label">{{ node.label }}</div>
            <div :class="['cus__class__box', { 'is__element': !!node.type, 'is__multiple': !!node.multiple }]">
              <template v-if="node.type === 'input'">
                <el-input size="mini" suffix-icon="el-icon-search"
                  v-model="formGroup[node.key]"
                  :placeholder="node.placeholder || `根据${node.label}搜索`"
                  @keydown.enter="setQueryValue(node, formGroup[node.key])"
                />
              </template>
              <template v-else>
                <template v-for="(cell, idx) in (node.options || list[mapping.find(i => i.text === node.label).key])" :key="cell.id">
                  <div :class="['cus__class__cell', { active: cell.id === formGroup[node.key] || formGroup[node.key] && cell.id === formGroup[node.key][0] }]"
                    @click="setQueryValue(node, cell.id)"
                    v-if="!node.isMultiple"
                  >
                    <span>{{ cell.name }}</span>
                  </div>
                  <template v-else>
                    <div class="cus__class__cell" v-if="idx > 0" @click.prevent="multipleChange(node, cell)">
                      <el-checkbox readonly :modelValue="!!node[node.key]?.find(i => i.id === cell.id)">{{ cell.name }}</el-checkbox>
                    </div>
                  </template>
                </template>
              </template>
              <template v-if="!!node.multiple">
                <div :class="['cus__switch__btn', { 'is__active': node.isMultiple }]" @click="node.isMultiple = true">
                  <span>多选</span>
                </div>
              </template>
            </div>
          </div>

          <div v-show="node.isMultiple" class="cus__cell__multiple">
            <el-tag size="small" effect="plain" type="info" @click="node[node.key] = null; node.isMultiple = false">取消</el-tag>
            <el-tag size="small" effect="dark" type="warning" @click="multipleSubmit(node)">提交</el-tag>
          </div>
        </template>
        <template v-if="showMoreBtn">
          <div class="cus__condition--toggle" @click="slideChange">
            <span>高级筛选</span>
            <i :class="[`el-icon-caret-${isOpened ? 'top' : 'bottom'}`]" />
          </div>
        </template>
      </div>
    </cus-skeleton>
  </div>
</template>
<script lang="ts">
import axios from 'axios';
import emitter from './../../utils/mitt';
import { AxResponse } from './../../core/axios';
import { reactive, ref, Ref, PropType } from 'vue';
import { useStore } from 'vuex';
import { ElInput } from 'element-plus';

interface ICondition {
  label : string;
  key   : string;
  default?: any;
  hide  : boolean;
  options?: any[];
  hidden?: boolean;
  isHide?: boolean;
  multiple?: string;
}

const mapping = [
  { text: '题型', key: 'questionType' },
  { text: '难度', key: 'difficultyList' },
  { text: '年级', key: 'gradeList' },
  { text: '年份', key: 'yearList' },
  { text: '来源', key: 'sourceList' },
  { text: '题类', key: 'categoryList' },
  { text: '知识点', key: 'lnowledgeList' },
  { text: '班型', key: 'courseTypeList'},
  { text: '学期', key: 'termList'}
]

export default {
  name: 'cus-condition',
  props: {
    nodeList: {
      type: Array as PropType<ICondition[]>,
      default: () => []
    }
  },
  components: { ElInput },
  emit: ['submit'],
  setup(props, { emit }) {

    let store = useStore();

    let conditions: Ref<ICondition[]> = ref([]);

    let multipleGroup = reactive({});

    let showMoreBtn = ref(false);
    let formGroup = reactive(props.nodeList.reduce( (controls, node) => {
      controls[node.key] = typeof node.default === 'undefined' ? null : node.default;
      node.options && (node.options = [{ name: '全部', id: null }, ...node.options]);
      if (node.hidden) { return controls; }
      if (node.hide) { showMoreBtn.value = true; }
      if (node.multiple) { multipleGroup[node.key] = { label: node.label, value: []}; }
      conditions.value.push({...node, isHide: !!node.hide })
      return controls;
    }, {}));

    const multipleChange = (node, cell) => {
      if (node[node.key]) {
        let index = node[node.key].findIndex(i => i.id === cell.id);
        index > -1 ? node[node.key].splice(index, 1) : node[node.key].push(cell)
      } else {
        node[node.key] = [ cell ]
      }
    }
    const multipleSubmit = (node) => {
      if (node[node.key] && node[node.key].length) {
        multipleGroup[node.key].value = node[node.key];
      }
      formGroup[node.key] = null;
      node[node.key] = null;
      node.isMultiple = false;
      submit();
    }

    let isOpened = ref(false);
    const slideChange = () => {
      conditions.value.map(c =>  c.hide && (c.isHide = isOpened.value) )
      isOpened.value = !isOpened.value;
    }

    let list = ref({});
    let loading = ref(true);
    const getRules = async (subjectCode) => {
      loading.value = true;
      let userId = store.getters.userInfo.user.id;
      list.value = await getCondition(userId, subjectCode, props.nodeList);
      loading.value = false;
    }
    emitter.emit('effect', getRules);

    const setQueryValue = (node, val) => {
      formGroup[node.key] = node.multiple ? [val] : val;
      submit();
    }
    const submit = () => {
      let val = props.nodeList.reduce((group, node) => {
        group[node.key] = node.multiple && multipleGroup[node.key].value.length ? multipleGroup[node.key].value.map(i => i.id) : formGroup[node.key];
        return group;
      }, {});
      console.log(val)
      emit('submit', val);
    }

    return { list, conditions, formGroup, setQueryValue, mapping, showMoreBtn, isOpened, loading, slideChange, multipleGroup, multipleChange, multipleSubmit, submit }
  }
}

const getCondition = (userId, subjectCode, nodeList): Promise<any> => {
  return new Promise((resolve) => {
    let requestList = [
      axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode }),
      axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'YEAR,QUES_SOURCE' })
    ]
    nodeList.some(i => i.label === '题型') && requestList.push(axios.post<null, AxResponse>('/tiku/questionType/queryTypeBySubject', { subject: subjectCode }))
    nodeList.some(i => i.label === '题类') && requestList.push(axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'QUES_CATEGORY' }))
    Promise.all(requestList).then(list => {
      let condition: any = {
        sourceList: [{ name: '全部', id: null }],
        difficultyList: [{ name: '全部', id: null }, { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
        categoryList: [ { name: '全部', id: null } ],
        lnowledgeList: [ { name: '全部', id: null }, { name: '已绑定', id: 1 }, { name: '未绑定', id: 0 } ]
      }
      list.map(res => {
        if (Array.isArray(res.json)) {
          condition.questionType = [{ name: '全部', id: null }, ...(res.json.map(i => ({ name: i.jyQuestionTypeName, id: i.jyQuestionType }) )) ];
        } else {
          res.json?.YEAR && (condition.yearList = [{ name: '全部', id: null }, ...(res.json.YEAR.map(i => ({ name: i.name, id: i.id }))) ]);
          res.json?.grades && (condition.gradeList = [{ name: '全部', id: null }, ...res.json.grades ]);
          res.json?.bookVersions && (condition.bookVersionList = [{ name: '全部', id: null }, ...res.json.bookVersions ]);
          res.json?.courseTypes && (condition.courseTypeList = [{ name: '全部', id: null }, ...res.json.courseTypes ]);
          res.json?.terms && (condition.termList = [{ name: '全部', id: null }, ...res.json.terms ]);
          res.json?.QUES_SOURCE && (condition.sourceList = [{ name: '全部', id: null }, ...(res.json.QUES_SOURCE.map(i => ({ name: i.name, id: i.id }))) ])
          res.json?.QUES_CATEGORY && (condition.categoryList = [{ name: '全部', id: null }, ...(res.json.QUES_CATEGORY.map(i => {i.id = i.val; return i;})) ]);
        }
      });
      resolve(condition)
    })
  })
}
</script>
<style lang="scss" scoped>
.cus__condition__container {
  margin-bottom: 20px;
  position: relative;
  .cus__condition__header {
    padding: 0 24px;
    .el-tag {
      margin: 10px 17px 10px 0;
      vertical-align: top;
      padding-right: 20px;
      margin-right: 17px;
      border-radius: 14px;
      overflow: hidden;
      position: relative;
      span:not(:last-of-type)::after {
        content: '、'
      }
      :deep(.el-icon-close) {
        font-size: 16px;
        position: absolute;
        top: 3px;
        right: 4px;
      }
    }
  }
  .cus__condition__content {
    background: #fff;
    border-radius: 6px;
    box-shadow: 0px 1px 6px 0px rgba(91, 125, 255, .08);
    border: 1px solid #EBF0FC;
    overflow: hidden;
  }
  .cus__class__item {
    display: flex;
    background: rgba(250, 173, 20, .14);
    &:not(:last-child) {
      border-bottom: solid 1px #fff;
    }
    .cus__class__label {
      color: #1A2633;
      width: 124px;
      height: 40px;
      padding: 0 34px;
      color: #1A2633;
      line-height: 40px;
      text-align: justify;
      opacity: .8;
      &::after {
        display: inline-block;
        width: 100%;
        content: '';
        height: 0;
      }
    }
    .cus__class__box {
      display: flex;
      flex-wrap: wrap;
      flex: 1 1 124px;
      padding: 7px 0 0 24px;
      background: #fff;
      position: relative;
      &.is__element {
        .el-input {
          width: 300px;
          height: 28px;
        }
      }
      &.is__multiple {
        padding-right: 64px;
      }
      .cus__class__cell {
        display: inline-block;
        margin-right: 22px;
        margin-bottom: 7px;
        opacity: .8;
        & > span {
          display: inline-block;
          padding: 0 12px;
          color: #77808D;
          height: 24px;
          line-height: 24px;
          border-radius: 16px;
          cursor: pointer;
          transition: all .25s;
        }
        &:hover span {
          color: #FAAD14;
        }
        &.active span {
          color: #fff;
          background: #FAAD14;
        }
        &.active {
          pointer-events: none;
        }
      }
      .cus__switch__btn {
        padding: 0 12px;
        color: #77808D;
        height: 24px;
        line-height: 24px;
        border-radius: 16px;
        border: 1px solid #E6E6E6;
        cursor: pointer;
        transition: all .25s;
        position: absolute;
        top: 7px;
        right: 12px;
        &.is__active {
          color: #FAAD14;
          border-color: #FAAD14;
        }
      }
    }
  }

  .cus__cell__multiple {
    height: 34px;
    line-height: 34px;
    text-align: center;
    background: #FEF3DE;
    border-bottom: solid 1px #fff;
    .el-tag {
      margin: 0 8px;
      cursor: pointer;
      &:active {
        opacity: .8;
      }
    }
  }

  :deep(.cus__class__item) {
    .el-input {
      input {
        font-size: 13px;
        border-radius: 0;
        border-top: 0;
        border-right: 0;
        border-left: 0;
      }
    }
  }
  .cus__condition--toggle {
    height: 34px;
    padding: 0 10px;
    color: #FAAD14;
    line-height: 32px;
    background: #fff;
    box-shadow: rgba(91, 125, 255, 0.08) 0px 3px 6px 0px;
    border: 1px solid rgb(235, 240, 252);
    border-top: 0;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate3d(-50%, 33px, 0);
    cursor: pointer;
    z-index: 9;
  }
}
</style>

