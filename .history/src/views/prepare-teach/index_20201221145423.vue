<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="params.value = $event" @search="params.title = $event" :searchShow='params.value' />
  </template>
  <div>
    <QueryClassComponent @query="request($event)" :searchShow='params.value'/>
    <div>
      <div class="cus-list clearfix" v-if="params.value == 1"  v-loading='loading'>
        <div class="course-list" v-for="item in courseList" :key="item">
          <div class="course-info">
            <div class="course-info-top">
              <p class="course-title">{{item.courseName}}</p>
              <p class="course-trip">
                {{item.gradeName||'--'}}/{{item.courseTypeName||'--'}}/{{item.semesterName||'--'}}</p>
            </div>
            <div class="course-img">
              <img src="/@/assets/prepare-teach/courseBg.png" style="width: 60px" alt="爱学标品">
            </div>
          </div>
          <div class="btn-box">
            <span>课程详情</span>
            <img src="/@/assets/prepare-teach/enter.png" width="16" height="16" alt="">
          </div>
        </div>
      </div>
      <div  v-if="params.value == 0">
          <div class="near-list">
              <ul>
                <li v-for="item in courseDatials" :key="item">
                    <div class="near-list-left" >  
                        <div class="courseTitle">
                            <img src="/@/assets/prepare-teach/book_logo.png" width="36"  alt="">
                            <div class="title">{{item.courseName}}</div>
                        </div>
                        <div class="session">{{item.courseIndexName}}</div>
                        <div class="time">上次保存时间:{{item.lastSaveDate ||'无'}}</div>
                    </div>
                </li>  
              </ul>
          </div>
      </div>
    </div>
    
  </div>
</template>

<script lang='ts'>
  import { ref, onMounted, Ref, reactive } from 'vue';
  import HeaderRefComponent from './components/header-ref.vue';
  import QueryClassComponent from './components/query-class.vue';
  import emitter from './../../utils/mitt';
  import axios from 'axios';
  import { ElMessage, ElLoading } from 'element-plus'
  import { AxResponse } from './../../core/axios';
  import createElement from './../../utils/createElement';
  import Modal from './../../utils/modal';


  export default {
    components: { HeaderRefComponent, QueryClassComponent },
    
    setup(props,{ emit }) {
      let headerRef = ref();
      onMounted(() => emitter.emit('slot', headerRef));

      let params: Ref<any> = ref({});
      
      emitter.emit('effect', (id) => params.value.subjectId = id)

      let courseList = ref([
        {
          courseName: '学习学习学习学习学习学习',
          gradeName: 222,
          courseTypeName: 333,
          semesterName: 2323,
        }
      ])

      let loading = ref(false);
      let page = reactive({
        current: 1,
        size: 10,
        total: courseList.value.length
      });
      const request = async (params?) => {
        loading.value = true;
        let res = await axios.post<any,AxResponse>(
            '/course/queryByPage',
            { ...params, current: page.current, size: page.size, },
            { headers: { type: 1, 'Content-Type': 'application/json'}}
        );
        if (res.result) {
            page.total = res.json.total;
            courseList.value = res.json.records;
        }
        loading.value = false;
      }


      let courseDatials = ref([
          {
            courseName: '十以内加法',
            courseIndexName:'十以内加法十以内加法十以内加法十以内加法十以内加法十以内加法十以内加法十以内加法',
            lastSaveDate:'10点10点10点10点10点10点10点10点10点10点'
          },{},{}
      ])  

      return { headerRef, params, request, loading, courseList, courseDatials }
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
    background: #fff;
    border: 1px solid rgb(235, 240, 252);
    box-shadow: raba(91, 125, 255, 0.08) 0 1px 6px 0;
    border-radius: 6px;
    padding: 5px 0px 30px 30px;
    .course-list {
      width: 275px;
      float: left;
      border-radius: 10px;
      border: 1px solid #DEE4F1;
      padding: 20px;
      margin: 30px 25px 0 0;
      height: 150px;
      cursor: pointer;
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
        //   width: 100%;
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

    .course-list:hover {
      box-shadow: 0px 2px 11px 0px rgba(23, 18, 45, 0.2);
    }
  }

  .near-list{
    background: rgb(255, 255, 255);
    border: 1px solid rgb(235, 240, 252);
    border-radius: 6px;
    padding: 10px 30px;
    ul{
        li{
            padding: 0 30px 0 10px;
            min-height: 60px;
            display: flex;
            border: 1px solid #DEE4F1;
            margin: 15px 0px;
            border-radius: 10px;
            .near-list-left{
              width: 65%;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              line-height: 58px;
              .courseTitle{
                display: flex;
                justify-content: space-between;
                align-items: center;
                img{
                  margin-right: 20px;
                }
              }
              .title{
                width: 220px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 16px;
                font-weight: 400;
                color: #333333;
              }
              .session{
                width: 40%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 16px;
                font-weight: 500;
                color: #1A2633;
              }
              .time{
                width: 300px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                font-weight: 400;
                color: #909399;
              }
            }
        }
    }
    
  }
</style>