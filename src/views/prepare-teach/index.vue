<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="typeChange" @search="params.courseName = $event" :searchShow='listShow' />
  </template>
  <div>
    <cus-condition
      v-if="listShow === 1"
      :node-list="[
        { label: '年份', key: 'year' },
        { label: '年级', key: 'gradeId' },
        { label: '学期', key: 'semesterId' },
        { label: '班型', key: 'courseTypeId' },
      ]"
      @submit="$refs.list.request($event)"
    />
    <div class="cus-list" v-if="listShow == 1">
      <cus-list ref="list" has-page url="/course/queryByPage" :default="params" :auto-request="true" :headers='{ type: 1, "Content-Type": "application/json" }' >
        <template v-slot="{ data }">
          <div class="course-info" @click="godetails(data)">
          <div class="course-info-top">
            <p class="course-title">{{ data.courseName }}</p>
            <p class="course-trip">
              {{ data.gradeName || '--'}}/{{ data.courseTypeName || '--'}}/{{ data.semesterName || '--' }}</p>
          </div>
          <div class="course-img">
            <img src="/src/assets/prepare-teach/course-bg.png" width="60" alt="爱学标品">
          </div>
        </div>
        <div class="btn-box" @click="godetails(data)">
          <span>课程详情</span>
          <img src="/src/assets/prepare-teach/enter.png" width="16" height="16" alt="爱学标品">
        </div>
        </template>
      </cus-list>
    </div>
    <div  v-if="listShow === 0">
      <NearClass :listShow='listShow'/>
    </div>
  </div>
</template>

<script lang='ts'>
  import { ref, onMounted, Ref } from 'vue';
  import HeaderRefComponent from './components/header-ref.vue';
  import NearClass from './near-class/index.vue';
  import PreparePapers from './components/prepare-papers.vue';
  import emitter from '/@/utils/mitt';
  import Modal from '/@/utils/modal';

  export default {
    components: { HeaderRefComponent, NearClass },

    setup(props,{ emit }) {
      let headerRef = ref();
      onMounted(() => emitter.emit('slot', headerRef));

      let params: Ref<any> = ref({});
      let subjectId: Ref<any> = ref()
      emitter.emit('effect', (id) => {params.value.subjectId = id; subjectId.value = id})

      let listShow = ref(1)
      const typeChange = (e:any) =>{
        listShow.value = e
      }

      // 课程详情弹窗
      const godetails = (item) => {
        let courseId = item.id
        Modal.create({ title: item.courseName,
        width: 640, zIndex:998,
        footed: false ,
        component: PreparePapers,
        props: { courseId },
        headerStyle: { 'margin-bottom': '20px' },
        bodyStyle: { padding: '0 20px 28px' }
        })
      }

      return { headerRef, params,  typeChange, listShow, godetails }
    }
  }
</script>

<style lang="scss" scoped>
  .cus-list {
    :deep(.cus__list__container){
      padding: 18px 5px 18px 20px;
    }
    :deep(.cus__list__container .cus__list__main){
      display: flex;
      justify-content: flex-start;
      flex-flow: row wrap ;
    }
    :deep(.cus__list__item){
      flex: 0 0 24%;
      border-radius: 10px;
      border: 1px solid #DEE4F1;
      min-width: 180px;
      padding: 20px 10px 0;
      cursor: pointer;
      margin-right: 1%;
      margin-top: 10px;
      &:not(:last-child) {
        margin-bottom: 0px;
      }
    }
    .course-info {
      height: 90px;
      border-bottom: 1px solid #DEE4F1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .course-title {
        font-size: 16px;
        margin: 2px 0 12px;
        color: #1A2633;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;   /*以下为webkit系兼容必须写法*/
        -webkit-line-clamp: 2; /*在第2行显示省略号*/
        -webkit-box-orient: vertical;
      }
      .course-trip {
        font-size: 12px;
        color: #77808D;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;   /*以下为webkit系兼容必须写法*/
        -webkit-line-clamp: 1; /*在第2行显示省略号*/
        -webkit-box-orient: vertical;
      }
    }
    .btn-box {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #1AAFA7;
        margin-right: 10px;
      }
      img {
        margin-top: 2px;
        margin-left: -2px;
      }
      span:hover {
        opacity: .8;
      }
    }
  }
  @media only screen and (min-width: 1440px) {
    .cus-list {
      :deep(.cus__list__item){
        flex: 0 0 19%;
      }
    }
  }
  @media only screen and (min-width: 1680px) {
    .cus-list {
      :deep(.cus__list__item){
        flex: 0 0 15.6%;
      }
    }
  }
</style>
