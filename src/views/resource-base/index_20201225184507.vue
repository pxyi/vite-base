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
        { label: '班型', key: 'courseTypeList' },
      ]"
      @submit="$refs.list.request($event)" 
    />
    <div class="cus-list clearfix" v-if="listShow == 1">
      <cus-list ref="list" has-page url="/course/queryByPage" :default="params" :auto-request="true" :headers='{ type: 1, "Content-Type": "application/json" }' >
        <template v-slot="{ data }">
          <div class="course-info" @click="godetails(data)">
          <div class="course-info-top">
            <p class="course-title">{{data.courseName}}</p>
            <p class="course-trip">
              {{ data.gradeName || '--'}}/{{ data.courseTypeName || '--'}}/{{ data.semesterName || '--' }}</p>
          </div>
          <div class="course-img">
            <img src="/@/assets/prepare-teach/course-bg.png" width="60" alt="爱学标品">
          </div>
        </div>
        <div class="btn-box" @click="godetails(data)">
          <span>课程详情</span>
          <img src="/@/assets/prepare-teach/enter.png" width="16" height="16" alt="爱学标品">
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
  import { ref, onMounted, Ref, reactive, watch } from 'vue';
  import HeaderRefComponent from './components/header-ref.vue';
  import NearClass from './near-class/index.vue';
  import PreparePapers from './components/prepare-papers.vue';
  import emitter from './../../utils/mitt';
  import axios from 'axios';
  import { ElMessage, ElLoading } from 'element-plus';
  import { AxResponse } from './../../core/axios';
  import createElement from './../../utils/createElement';
  import Modal from './../../utils/modal';
  import { useStore } from 'vuex';

  export default {
    components: { HeaderRefComponent, NearClass },
    
    setup(props,{ emit }) {
      let store = useStore()
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
        Modal.create({ title: item.courseName, width: 640, footed: false , component: PreparePapers, props: { courseId }})
      }

      return { headerRef, params,  typeChange, listShow, godetails }
    }
  }
</script>

<style lang="scss" scoped>
  .clearfix{
    content: '';
    clear: both;
    overflow: hidden;
  }
  .cus-list {
    :deep(.cus__list__container .cus__list__main){
      display: flex;
      justify-content: flex-start;
    }
    :deep(.cus__list__item){
      width: 275px;
      border-radius: 10px;
      border: 1px solid #DEE4F1;
      padding: 20px;
      margin-right: 25px;
      cursor: pointer;
    }
    .course-info {
      height: 90px;
      width: 100%;
      border-bottom: 1px solid #DEE4F1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .course-title {
        font-size: 16px;
        margin-top: 2px;
        margin-bottom: 10px;
        font-weight: 400;
        color: #1A2633;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
      }
      .course-trip {
        font-size: 12px;
        font-weight: 400;
        color: #77808D;
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
</style>