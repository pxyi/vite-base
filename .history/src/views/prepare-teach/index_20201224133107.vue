<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="typeChange" @search="params.title = $event" :searchShow='listShow' />
  </template>
  <div>
    <QueryClassComponent @query="$refs.list.request($event)" :searchShow='listShow'/>
    <div>
      <div class="cus-list clearfix" v-if="listShow == 1">
        <cus-list ref="list" has-page url="/course/queryByPage" :default="params" :auto-request="true" :headers='{ type: 1, "Content-Type": "application/json" }' >
          <template v-slot="{ data }">
           <div class="course-info">
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
      <div  v-if="listShow == 0">
        <div class="near-list" v-loading='nearLoading'>
          <ul>
            <li v-for="item in courseDatials" :key="item">
              <div class="near-list-left" >  
                <div class="courseTitle">
                  <img src="/@/assets/prepare-teach/book_logo.png" width="36"  alt="">
                  <div class="title">{{item.courseName}}</div>
                </div>
                <div class="session" >{{item.courseIndexName}}</div>
                <div class="time">上次保存时间：{{item.lastSaveDate ||'无'}}</div>
              </div>
                <div class="menu">
                <el-button size="small" v-if="item.checkStaus == 1"  @click="courseDetailFileList(item,index)">继续备课</el-button>
                <el-button size="small" v-if="item.checkStaus == 2"  @click="courseDetailFileList(item,index)">查看备课</el-button>
              </div>  
            </li>     
          </ul>
          <!-- <div  v-if="courseDatial.length == 0" class="noData">暂无数据</div> -->
          <div v-if="courseDatials" class="pagination">
            <el-pagination 
              v-model:current-page="nearPage.current" 
              v-model:page-size="nearPage.size" 
              :total="nearPage.total"
              @current-change="nearRequest()"
              layout="prev, pager, next"
            />
          </div>
        </div>
      </div>
    </div>   
  </div>
</template>

<script lang='ts'>
  import { ref, onMounted, Ref, reactive, watch } from 'vue';
  import HeaderRefComponent from './components/header-ref.vue';
  import QueryClassComponent from './components/query-class.vue';
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
    components: { HeaderRefComponent, QueryClassComponent,},
    
    setup(props,{ emit }) {
      let store = useStore()
      let headerRef = ref();
      onMounted(() => emitter.emit('slot', headerRef));

      let params: Ref<any> = ref({});
      // let subjectId: Ref<any> = ref()
      emitter.emit('effect', (id) => params.value = id)

      
      let listShow = ref(1)
      const typeChange = (e:any) =>{
        listShow.value = e
        if (e == 1) {
          // request(params)
        } else if (e == 0) {
          nearRequest()
        }
      }

      //最近备课
      let courseDatials = ref([]) 
      let nearPage = reactive({
        current: 1,
        size: 10, 
        total: courseDatials.value.length,   
      })

      let nearLoading = ref(true)
      let creatorId = store.getters.userInfo.user.id
      const nearRequest = async () => {
        nearLoading.value = true
        let res = await axios.post<any,AxResponse>(
          '/admin/prepareLesson/queryPageV2',
          { current: nearPage.current, size: nearPage.size, subjectCode: subjectId.value, creatorId: creatorId },
          { headers: { type: 1 }}
        );
          courseDatials.value = res.json.records;
          nearLoading.value = false
      }

      // 学科改动，刷新数据
      // watch(subjectId, () => {request(params);nearRequest()});

      setTimeout(() => {
        // request(params)  
        nearRequest()
      }, 100);

      // 课程详情弹窗
      const godetails = (item) => {
        let courseId = item.id
        Modal.create({ title: item.courseName, width: 640, footed: false , component: PreparePapers, props: { courseId }})
      }

      const courseDetailFileList = (item,index) => {
        let id = listShow.value == 0 ? item.courseIndex : item.id;
        Screen.create( CurriculumPapers, { title: item.courseName, id: id })
      }

      return { 
        headerRef, params, 
         courseDatials, typeChange, listShow, nearRequest, godetails, nearLoading,
        courseDetailFileList, nearPage
       }
    }
  }
</script>

<style lang="scss" scoped>
  .noData{
    text-align: center;
    margin-top: 10px;
  }
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
  .near-list{
    background: rgb(255, 255, 255);
    border: 1px solid rgb(235, 240, 252);
    border-radius: 6px;
    padding: 10px 30px 40px;
    position: relative;
    ul{
      min-height: 30px;
      li{
        cursor: pointer;
        padding: 0 30px 0 10px;
        min-height: 60px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #DEE4F1;
        margin: 15px 0px;
        border-radius: 10px;
        .near-list-left{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 70%;
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
            width: 200px;
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
        .menu{
          display: flex;
          justify-content: flex-end;
          width: 30%;
          align-items: center;
        }
      }
      li:hover{
        background: #E1E6F2;
        box-shadow: 0px 2px 4px 0px rgba(69, 90, 247, 0.05), 0px 0px 8px 0px rgba(69, 90, 247, 0.06);
      }
    }
    .pagination{
      position: absolute;
      right: 100px;
      bottom: 10px;
    }
  }
  
</style>