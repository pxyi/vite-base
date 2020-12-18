<template>
  <div class="cus__query__class__container">
    <!-- <div class="cus__class__item" v-for="item in searchRule" :key="item.id">
      <div class="cus__class__label">{{item.title}}</div>
      <div class="cus__class__box">
        <div class="cus__class__cell" v-for="cell in searchRules.years" :key="cell.id" @click="setQueryValue('year', cell.id)" :class="{ active: cell.id === queryForm.year }">{{ cell.name }}</div>
      </div>
    </div> -->
   
    </div> <div class="cus__class__item">
      <div class="cus__class__label">年份</div>
      <div class="cus__class__box">
        <div class="cus__class__cell" v-for="cell in searchRules.years" :key="cell.id" @click="setQueryValue('year', cell.id)" :class="{ active: cell.id === queryForm.year }">{{ cell.name }}</div>
      </div>
    </div>
    <div class="cus__class__item">
      <div class="cus__class__label">年纪</div>
      <div class="cus__class__box">
        <div class="cus__class__cell" v-for="cell in searchRules.grades" :key="cell.id" @click="setQueryValue('gradeId', cell.id)" :class="{ active: cell.id === queryForm.gradeId }">{{ cell.name }}</div>
      </div>
    <div class="cus__class__item">
      <div class="cus__class__label">班型</div>
      <div class="cus__class__box">
        <div class="cus__class__cell" v-for="cell in searchRules.courseTypes" :key="cell.id" @click="setQueryValue('courseTypes', cell.id)" :class="{ active: cell.id === queryForm.courseTypes }">{{ cell.name }}</div>
      </div>
    </div>
    <div class="cus__class__item">
      <div class="cus__class__label">学期</div>
      <div class="cus__class__box">
        <div class="cus__class__cell" v-for="cell in searchRules.terms" :key="cell.id" @click="setQueryValue('terms', cell.id)" :class="{ active: cell.id === queryForm.terms }">{{ cell.name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import axios from 'axios';
import emitter from './../../../utils/mitt';
import { AxResponse } from './../../../core/axios';
import { reactive, ref } from 'vue';
import { useStore } from 'vuex'

export default {
  // props: {
  //   searchRule: {
  //       type: Array,
  //       default: ()=> {
  //         return [
  //           {
  //             title: '年份',
  //             searchKey:'years'
  //           }
  //         ]
  //       }
  //     }
  //   },
  setup(props, { emit }) {
    let store = useStore();

    let loading = ref(true);

    let queryForm = reactive({
      year: null,
      gradeId: null,
      courseTypes:null,
      terms:null,
    })

    let searchRules = ref({});
    const getRules = async (subjectCode) => {
      let userId = store.getters.userInfo.user.id;
      let res = await axios.post<any, AxResponse>('/permission/user/userDataRules', { userId, subjectCode });
      let sources = [{ name: '单元测试', id: 1 }, { name: '月考', id: 2 }, { name: '期中', id: 3 }, { name: '期末', id: 4 }, { name: '竞赛', id: 5 }, { name: '错题本', id: 6 }]
      emitter.emit('queryClass', { years:  res.json.years, grades: res.json.grades, sources })
      res.json.years = [ { name: '全部', id: null }, ...res.json.years ];
      res.json.grades = [ { name: '全部', id: null }, ...res.json.grades ];
      res.json.courseTypes = [ { name: '全部', id: null }, ...res.json.courseTypes ];
      res.json.terms = [ { name: '全部', id: null }, ...res.json.terms ];
      
      // res.json.sources = [ { name: '全部', id: null }, ...sources ]
      console.log(res.json)
      searchRules.value = res.json;
    }
    emitter.emit('effect', getRules);

    const setQueryValue = (type, val) => {
      queryForm[type] = val;
      emit('query', queryForm);
    }

    return { searchRules, queryForm, setQueryValue }
  }
}
</script>
<style lang="scss" scoped>
.cus__query__class__container {
  margin-bottom: 20px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0px 1px 6px 0px rgba(91, 125, 255, .08);
  border: 1px solid #EBF0FC;
  .cus__class__item {
    display: flex;
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
      background: rgba(250, 173, 20, 0.14);
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
      flex: auto;
      padding: 0 24px;
      line-height: 40px;
      .cus__class__cell {
        display: inline-block;
        padding: 0 12px;
        margin-right: 22px;
        color: #77808D;
        height: 24px;
        line-height: 24px;
        border-radius: 16px;
        cursor: pointer;
        opacity: .8;
        transition: all .25s;
        &:hover {
          color: #FAAD14;
        }
        &.active {
          color: #fff;
          background: #FAAD14;
        }
      }
    }
  }
}
</style>