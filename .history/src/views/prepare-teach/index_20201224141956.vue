<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="typeChange" @search="params.title = $event" :searchShow='listShow' />
  </template>
  <div>
    <cus-condition 
      v-if="listShow === 1"
      :node-list="[
        { label: '年份', key: 'year' },
        { label: '年级', key: 'gradeId' },
        { label: '学期', key: 'semesterId' },
        { label: '班型', key: 'courseTypeId' }
      ]"
      @submit="$refs.list.request($event)" 
    />
    <div class="cus-list clearfix" v-if="listShow === 1">
      <cus-list ref="list" has-page url="/course/queryByPage" :default="params" :auto-request="true" :headers='{ type: 1, "Content-Type": "application/json" }' >
        <template v-slot="{ data }">
          <div class="course-info" @click="godetails(data)">
          <div class="course-info-top">
            <p class="course-title">{{data.courseName}}</p>
            <p class="course-trip">
              {{ data.gradeName || '--'}}/{{ data.courseTypeName || '--'}}/{{ data.semesterName || '--' }}</p>
          </div>
          <div class="course-img">
            <img src="/@/assets/prepare-teach/courseBg.png" style="width: 60px" alt="">
          </div>
        </div>
        <div class="btn-box">
          <span>课程详情</span>
          <img src="/@/assets/prepare-teach/enter.png" width="16" height="16" alt="">
        </div>
        </template>
      </cus-list>
    </div> 
    <div  v-if="listShow === 0">
      <NearClass/>
    </div>   
  </div>
</template>

<script lang='ts'>
  import { ref, onMounted, Ref, reactive, watch } from 'vue';
  import HeaderRefComponent from './components/header-ref.vue';
  import NearClass from './near-class/index.vue';
  import PreparePapers from './components/prepare-papers.vue';
  import CurriculumPapers from './components/curriculum-papers.vue';
  import emitter from './../../utils/mitt';
  import axios from 'axios';
  import { ElMessage, ElLoading } from 'element-plus';
  import { AxResponse } from './../../core/axios';
  import createElement from './../../utils/createElement';
  import Modal from './../../utils/modal';
  import Screen from './../../utils/screen';
  import { useStore } from 'vuex';


  export default {
    components: { HeaderRefComponent ,NearClass },
    
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
        if (e == 1) {
          // request(params)
        } else if (e == 0) {
          // nearRequest()
        }
      }


      // 课程详情弹窗
      const godetails = (item) => {
        let courseId = item.id
        Modal.create({ title: item.courseName, width: 640, footed: false , component: PreparePapers, props: { courseId }})
      }

      const courseDetailFileList = (item,index) => {
        let id = listShow.value == 0 ? item.courseIndex : item.id;
        Screen.create( CurriculumPapers, { title: item.courseName, id: id })
      }

      return { headerRef, params,  typeChange, listShow, godetails, courseDetailFileList }
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
    :deep(.cus__list__item){
      width: 275px;
      float: left;
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