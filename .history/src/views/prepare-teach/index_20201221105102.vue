<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="params.value = $event" @search="params.title = $event" :searchShow='params.value' />
  </template>
  <div>
    <QueryClassComponent @query="request($event)" :searchShow='params.value'/>
    <div>
      <div class="cus-list clearfix" v-if="params.value == 1"  ref='cusList' v-loading="loading">
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
      <div class="cus-list" v-if="params.value == 0">
        <cus-list  has-page url="/teachbook/Courseware/queryPage" :default="params" :auto-request="false">
          <template v-slot:avatar>
            <img src="/@/assets/prepare-teach/book_logo.png" style="width: 36px" alt="爱学标品">
          </template>
           <template v-slot="{ data }">
            <div class="cus_content">
              <h2>{{ data.title }}</h2>
              <p>来源：<span class="cus_tag">{{ data.source }}</span></p>
              <div>
                <div><span>题目数：{{ data.questionCount || 0 }}</span><span>下载次数：{{ data.downloadCount || 0 }}</span></div>
                <div><span>创建人：{{ data.creatorName }}</span><span>创建时间：{{ data.createTime }}</span></div>
              </div>
            </div>
          </template>
        </cus-list>
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
      
      emitter.emit('effect', (id) => {params.value.subjectId = id; console.log(id,111)})

      let courseList = reactive([
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
        total: courseList.length
      });
      const request = async (params?) => {
        loading.value = true;
        let res = await axios.post<any, AxResponse>('/course/queryByPage', { ...params, current: page.current, size: page.size });
        // if (res.result) {
        //   page.total = res.json.total;
        //   courseList = res.json.records;
        // }
        loading.value = false;
      }

      return { headerRef, params, courseList, request }
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

</style>