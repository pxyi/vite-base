<template>
  <div class="container">
    <div class="fixed-header">
      <div class="cell"
        @click="orderChange(cell.key)"
        v-for="cell in [{key: 0, text: '上传时间'}, {key: 1, text: '试题难度'}, {key: 2, text: '引用次数'}]"
        :key="cell.key"
      >
        <span>{{ cell.text }}</span>
        <i v-show="pageAorder.order === cell.key"  :class="[ 'iconfont', `${ pageAorder.orderType === 1 ? 'iconpaixu-xia' : 'iconpaixu-shang1' }` ]" />
      </div>
      <div class="statistics">
        <span>共计<i>{{ pageAorder.total }}</i>道相关试题</span>
        <div @click="showAnswer = !showAnswer" v-if="!isSelected">
          <i class="iconfont" :class="[ showAnswer ? 'iconchakandaan' : 'iconbukandaan' ]" />
          <span>查看答案</span></div>
      </div>
    </div>
    <cus-skeleton :loading="loading">
      <div class="section">
        <div class="item" 
          v-for="data in dataset" :key="data.id" 
          @click="isSelected && checkedChange(data)" 
          :class="{
            'is__checked': isSelected && !!checkedList.find(n => n.id === data.id), 
            'is__selected': isSelected,
            'is__disabled': isSelected && disabledList.find(id => id === data.id)
          }"
        >
          <div class="update-icon" v-if="!isSelected" v-permissions="'update'" @click="update(data.id)"><i class="el-icon-edit-outline" /></div>
          <div class="update-icon" v-else><el-checkbox :disabled="isSelected && !!disabledList.find(id => id === data.id)" :modelValue="!!checkedList.find(n => n.id === data.id) || !!disabledList.find(id => id === data.id)" /></div>
          <div class="content-text">
            <div class="title" v-html="data.title"></div>
            <div v-question="data"></div>
          </div>
          <div class="flex-box" v-show="showAnswer">
            <div class="label">答案</div>
            <div class="flex-main" v-html="data.answer"></div>
          </div>
          <div class="flex-box" v-show="data.showAnalysis">
            <div class="label">解析</div>
            <div class="flex-main"><span v-html="data.analysis" v-if="data.analysis" /><span v-else>暂无解析</span></div>
          </div>
          <div class="footer">
            <p>{{ data.questionTypeName }}</p>
            <p><span>收录：</span><span>{{ data.createTime }}</span></p>
            <p><span>难度：</span><span>{{ data.difficult }}</span></p>
            <p><span>引用：</span><span>{{ data.useCount || 0 }}</span></p>
            <div v-if="!isSelected">
              <p><i @click="data.showAnalysis = !data.showAnalysis">解析</i></p>
              <!-- <p><i @click="similarPreview(data.id)">相似题</i></p> -->

              <a class="cart-icon" @click.prevent="addCart(data)" :class="{ active: !!cartList.find(i => i.id === data.id) }" />

              <a @click="remove(data)" v-if="userId === data.creatorId" :class="{ 'is__loading': data.loading }">
                <i class="el-icon-loading" v-if="data.loading" />
                <span>删除</span>
              </a>
            </div>
          </div>
        </div>

        <template v-if="!dataset.length && !loading">
          <cus-empty />
        </template>
        <template v-if="dataset.length && !loading">
          <el-pagination
            v-model:current-page="pageAorder.current"
            v-model:page-size="pageAorder.size"
            :total="pageAorder.total"
            @current-change="request()"
            layout="prev, pager, next"
          />
        </template>
      </div>
    </cus-skeleton>
  </div>

  <TestBasketComponent v-if="!isSelected" :question-list="cartList" />
</template>

<script lang="ts">
import { ref, Ref, reactive, computed, watch } from 'vue';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import updateComponent from './update.vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';
import TestBasketComponent from './test-basket.vue';
import QuestionDirective from '/@/views/utils/question.directive'
import drawer from '/@/utils/drawer';
const difficultFilter = (v) => ([{ name: '易', id: 11 }, { name: '较易', id: 12 }, { name: '中档', id: 13 }, { name: '较难', id: 14 }, { name: '难', id: 15 }].find(i => i.id === v)?.name);

export default {
  props: {
    isSelected: {         // true => 选择试题页面  fale => 题库首页
      type: Boolean,
      default: () => false
    },
    disabledList: {
      type: Array,
      default: () => []
    },
    onCheckChange: {
      type: Function,
      default: () => (() => {})
    }
  },
  components: { TestBasketComponent },
  directives: { question: QuestionDirective },
  setup(props) {
    let store = useStore()
    let userId = computed(() => store.getters.userInfo.user.id)
    let dataset: Ref<any[]> = ref([]);

    let showAnswer = ref(false);

    let pageAorder = reactive({
      order: 0,                   // 0：时间排序  1：试题难度  2：引用次数
      orderType: 1,               // 时间排序 1：降序 0：升序
      searchType: 2,
      current: 1,
      size: 10,
      total: 0
    });

    let checkedList: Ref<any[]> = ref([]);     // 选中的试题集合
    const checkedChange = (data: any) => {
      let index = checkedList.value.findIndex(n => n.id === data.id)
      index > -1 ? checkedList.value.splice(index, 1) : checkedList.value.push(data);
      props.onCheckChange(checkedList.value);
    }

    let __params: any = {};

    let loading = ref(false);
    const request = async (params?) => {
      loading.value = true;
      params && (__params = params);
      let res = await axios.post<null, AxResponse>(`/tiku/question/queryPage`, { ...__params, ...pageAorder}, { headers: { 'Content-Type': 'application/json' } });
      if (res.result) {
        dataset.value = res.json.records.map(n => ({
          ...n,
          ...{
              createTime: n.createTime.split('-').join('/'),
              difficult: difficultFilter(n.difficult),
              answer: n.rightAnswer ? n.rightAnswer.map(a => a[n.basicQuestionType === 1 ? 'name' : 'content']).join('、') : '-'
            }
          })
        );
        pageAorder.total = res.json.total;
      }
      loading.value = false;
    }

    /* ------------- 排序设置 ------------- */
    const orderChange = (order) => {
      pageAorder.order === order ? (pageAorder.orderType = pageAorder.orderType === 1 ? 0 : 1) : (pageAorder.order = order);
      request();
    }
    /* ------------- 查看相似题 ------------- */
    const similarPreview = async (id) => {
      let res = await axios.post<null, AxResponse>('/tiku/question/querySimilar', { id, subject: __params.subject, count: 10 })
    }

    const update = (id) => {
      drawer.create({ title: '编辑题目', component: updateComponent, width: 840, props: { id } }).then(_ => request() );
    }

    const remove = async (data) => {
      data.loading = true;
      let res = await axios.post<null, AxResponse>('/tiku/question/delete', { id: data.id });
      ElMessage[res.result ? 'success' : 'warning'](res.result ? '删除成功~！' : res.msg);
      document.querySelector('.section-main')!.scrollTop = 0;
      request();
    }

    let cartList: Ref<any[]> = ref([]);
    const addCart = (data) => {
      let index = cartList.value.findIndex(d => d.id === data.id);
      index > -1 ? cartList.value.splice(index, 1)  : cartList.value.push(data);
    }

    return { request, loading, dataset, pageAorder, orderChange, similarPreview, update, showAnswer, remove, userId, checkedList, checkedChange, cartList, addCart }
  }
}
</script>

<style lang="scss" scoped>
.container {
  flex: auto;
  display: flex;
  flex-direction: column;
  & > .fixed-header {
    padding: 0 28px;
    color: #fff;
    line-height: 34px;
    background: #1AAFA7;
    border-radius: 6px 6px 0px 0px;
    border: 1px solid #EBF0FC;
    .cell {
      width: 76px;
      white-space: nowrap;
      display: inline-block;
      margin-right: 20px;
      cursor: pointer;
      i {
        margin: 0 3px;
        color: #FAAD14;
        font-size: 18px;
        vertical-align: bottom;
      }
    }
    .statistics {
      float: right;
      span {
        display: inline-block;
        height: 16px;
        line-height: 16px;
        vertical-align: middle;
      }
      i {
        color: #FAAD14;
        margin: 0 3px;
        font-style: normal;
      }
      div {
        display: inline-block;
        height: 16px;
        padding-left: 10px;
        margin-left: 10px;
        line-height: 16px;
        vertical-align: middle;
        border-left: 1px solid rgb(255, 255, 255);
        cursor: pointer;
        i {
          display: inline-block;
          width: 20px;
          text-align: center;
          vertical-align: bottom;
          font-size: 16px;
          transform: scale(.8);
          &.iconbukandaan {
            font-size: 12px;
          }
        }
      }
    }
  }
  .section {
    flex: 1 1 36px;
    background: #fff;
    padding: 20px 28px;
    .item {
      padding: 20px 20px 0;
      border-radius: 10px;
      border: 1px solid #EBEEF6;
      position: relative;
      transition: all .25s;
      &.is__selected {
        cursor: pointer;
      }
      &.is__disabled {
        pointer-events: none;
        background: #f9f9f9;
      }
      &.is__checked {
        border-color: #19AEA5;
      }
      :deep(.update-icon) .el-checkbox {
        vertical-align: top;
        pointer-events: none;
      }
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      &:hover {
        box-shadow: 0px 2px 11px 0px rgba(23, 18, 45, 0.2);
      }
      .title {
        margin-bottom: 20px;
      }
      .update-icon {
        width: 40px;
        color: #1AAFA7;
        font-size: 24px;
        line-height: 34px;
        text-align: center;
        background: url('./../../../assets/question/edit-bg.png') no-repeat;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
        img{
          background: #fff;
          border-top-right-radius: 10px;
          display: inline-block;
          position: absolute;
          top: 0;
          right: 0;
        }
        &:active > i {
          transform: scale(.95);
        }
      }
      .content-text {
        margin-right: 20px;
        overflow: hidden;
        img {
          display: inline-block;
        }
      }
      .flex-box {
        font-size: 13px;
        display: flex;
        margin-top: 14px;
        .label {
          display: inline-block;
          height: 20px;
          padding: 0 7px;
          color: #3ABAB3;
          font-size: 12px;
          line-height: 20px;
          background: rgba(58, 186, 179, 0.15);
          border-radius: 4px;
          margin-right: 8px;
        }
        .flex-main {
          flex: auto;
          color: #77808d;
        }
      }
      .footer {
        height: 36px;
        margin: 20px -20px 0;
        font-size: 12px;
        line-height: 36px;
        background: #F2F1F6;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-top: solid 1px #EBF0FC;
        p {
          float: left;
          margin-left: 18px;
          color: #1A2633;
          span {
            color: #77808D;
          }
          i {
            color: #382A74;
            cursor: pointer;
            &:active {
              opacity: .6;
            }
          }
        }
        div {
          float: right;
          padding-right: 20px;
          a {
            display: inline-block;
            padding: 0 10px;
            margin-left: 20px;
            color: #1AAFA7;
            line-height: 20px;
            border: solid 1px #1AAFA7;
            border-radius: 12px;
            transition: all .25s;
            cursor: pointer;
            &.is__loading {
              pointer-events: none;
              opacity: .6;
            }
            &.cart-icon.active {
              color: #FAAD14;
              border: solid 1px #FAAD14;
              background: #FFF7E9;
              &::before {
                content: '移出试题篮'
              }
            }
            &.cart-icon::before {
              content: '加入试题篮';
              display: inline-block;
            }
          }

          & > i {
            color: #5B7DFF;
            font-size: 18px;
            line-height: 36px;
            margin-right: 20px;
            vertical-align: top;
            cursor: pointer;
            &:active {
              opacity: .8;
            }
          }
        }
      }
    }
  }

  :deep(.el-pagination) {
    text-align: right;
  }
}

:deep(.item) {
  .e-main {
    display: flex;
    flex-wrap: wrap;
    padding-left: 20px;
    .e-m-cell {
      &.w-1 {
        width: 100%;
      }
      &.w-2 {
        width: 50%;
      }
      &.w-4 {
        width: 25%;
      }
      margin-bottom: 10px;
      .e-c-label {
        width: 40px;
      }
      .e-c-group {
        flex: 1 1 40px;
        display: flex;
        flex-wrap: wrap;
        .c-t-item {
          flex: 1;
          white-space: nowrap;
        }
      }
    }
    &-title {
      .e-m-cell {
        margin-bottom: 20px;
        .e-c-label {
          margin-bottom: 5px;
        }
        .e-c-group {
          line-height: 24px;
          text-indent: 20px;
        }
      }
    }
  }
}
</style>
