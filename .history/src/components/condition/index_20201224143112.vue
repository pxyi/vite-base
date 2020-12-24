<template>
  <div class="cus__condition__container">
    <cus-skeleton :loading="loading">
      <div class="cus__condition__content">
        <template v-for="node in showNodeList" :key="node.key">
          <div class="cus__class__item" v-show="!node.hide || isOpened">
            <div class="cus__class__label">{{ node.label }}</div>
            <div class="cus__class__box">
              <div 
                :class="{ active: cell.id === formGroup[node.key], 'cus__class__cell': true }"
                v-for="cell in (node.options || list[mapping.find(i => i.text === node.label).key])" 
                :key="cell.id" 
                @click="setQueryValue(node.key, cell.id)" 
              >
                <span>{{ cell.name }}</span>
              </div>
            </div>
          </div>
        </template>
        <template v-if="showMoreBtn">
          <div class="cus__condition--hide-list" ref="hideRef" v-show="isOpened">
            <template v-for="node in hideNodeList" :key="node.key">
              <div class="cus__class__item">
                <div class="cus__class__label">{{ node.label }}</div>
                <div class="cus__class__box">
                  <div 
                    :class="{ active: cell.id === formGroup[node.key], 'cus__class__cell': true }"
                    v-for="cell in (node.options || list[mapping.find(i => i.text === node.label).key])" 
                    :key="cell.id" 
                    @click="setQueryValue(node.key, cell.id)" 
                  >
                    <span>{{ cell.name }}</span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="cus__condition--toggle" @click="isOpened = !isOpened">
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
import { reactive, ref, Ref, PropType, onUnmounted } from 'vue';
import { useStore } from 'vuex';

interface ICondition {
  label : string;
  key   : string;
  default?: any;
  hide  : boolean;
  options?: any[]
}

const mapping = [
  { text: '题型', key: 'questionType' },
  { text: '难度', key: 'difficultyList' },
  { text: '年级', key: 'gradeList' },
  { text: '年份', key: 'yearList' },
  { text: '来源', key: 'sourceList' },
  { text: '题类', key: 'categoryList' },
  { text: '知识点', key: 'lnowledgeList' },
  { text: '学期', key: 'termList' },
  { text: '班型', key: 'courseTypes' },
]

export default {
  name: 'cus-condition',
  props: {
    nodeList: {
      type: Array as PropType<ICondition[]>,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: () => false
    }
  },
  emit: ['submit'],
  setup(props, { emit }) {
    
    let store = useStore();

    let showNodeList: ICondition[] = [];
    let hideNodeList: ICondition[] = [];

    let showMoreBtn = ref(false);
    let formGroup = reactive(props.nodeList.reduce( (controls, node) => {
      controls[node.key] = typeof node.default === 'undefined' ? null : node.default;
      if (node.hide) {
        hideNodeList.push(node);
        showMoreBtn.value = true;
      } else {
        showNodeList.push(node);
      }
      return controls;
    }, {}));

    onUnmounted(() => { emitter.off('effect', getRules) } );

    let list = ref({});
    let loading = ref(true);
    const getRules = async (subjectCode) => {
      loading.value = true;
      let userId = store.getters.userInfo.user.id;
      list.value = await getCondition(userId, subjectCode, props.nodeList);
      loading.value = false;
    }
    emitter.emit('effect', getRules);

    const setQueryValue = (type, val) => {
      formGroup[type] = val;
      emit('submit', Object.entries(formGroup).reduce((group, node) => { 
        node[1] !== '' && node[1] !== null && (group[node[0]] = node[1])
        return group;
      }, {}) );
    }

    let hideRef: Ref<HTMLElement | null> = ref(null);
    let isOpened = ref(false);

    return { list, showNodeList, hideNodeList,  formGroup, setQueryValue, mapping, showMoreBtn, hideRef, isOpened, loading }
  }
}

const getCondition = (userId, subjectCode, nodeList): Promise<any> => {
  return new Promise((resolve) => {
    let requestList = [
      axios.post<null, AxResponse>('/permission/user/userDataRules', { userId, subjectCode })
    ]
    nodeList.some(i => i.label === '题型') && requestList.push(axios.post<null, AxResponse>('/tiku/questionType/queryTypeBySubject', { subject: subjectCode }))
    Promise.all(requestList).then(list => {
      let condition: any = {
        sourceList: [{ name: '全部', id: null }, { name: '单元测试', id: 1 }, { name: '月考', id: 2 }, { name: '期中', id: 3 }, { name: '期末', id: 4 }, { name: '竞赛', id: 5 }, { name: '错题本', id: 6 }],
        difficultyList: [{ name: '全部', id: null }, { name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 } ],
        categoryList: [ { name: '全部', id: null }, { name: '真题', id: 1 }, { name: '好题', id: 2 }, { name: '常考题', id: 3 }, { name: '压轴题', id: 4 }, { name: '易错题', id: 5 } ],
        lnowledgeList: [ { name: '全部', id: null }, { name: '已绑定', id: 1 }, { name: '未绑定', id: 0 } ]
      }
      list.map(res => {
        if (Array.isArray(res.json)) {
          condition.questionType = [{ name: '全部', id: null }, ...(res.json.map(i => ({ name: i.jyQuestionTypeName, id: i.jyQuestionType }) )) ];
        } else {
          res.json.years && (condition.yearList = [{ name: '全部', id: null }, ...(res.json.years.map(i => ({ name: i.name, id: i.val }))) ]);
          res.json.grades && (condition.gradeList = [{ name: '全部', id: null }, ...res.json.grades ]);
          res.json.bookVersions && (condition.bookVersionList = [{ name: '全部', id: null }, ...res.json.bookVersions ]);
          res.json.courseTypes && (condition.courseTypeList = [{ name: '全部', id: null }, ...res.json.courseTypes ]);
          res.json.terms && (condition.termList = [{ name: '全部', id: null }, ...res.json.terms ]);

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
  .cus__condition__content {
    background: #fff;
    border-radius: 6px;
    box-shadow: 0px 1px 6px 0px rgba(91, 125, 255, .08);
    border: 1px solid #EBF0FC;
    overflow: hidden;
  }
  .cus__class__item {
    display: flex;
    background: rgba(250, 173, 20, 0.14);
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
      padding: 0 24px 8px;
      background: #fff;
      .cus__class__cell {
        display: inline-block;
        margin-right: 22px;
        margin-top: 8px;
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