<template>
  <div class="near-cus-list">
    <SearchTime :params='params' @search="searchTime"/>
    <cus-list has-page url="/admin/prepareLesson/queryPageV2" :default="params" :auto-request="true" :headers='{ type: 1 }' ref="nearList" >
      <template v-slot:avatar>
         <img src="/@/assets/prepare-teach/book_logo.png" width="36"  alt="爱学标品">
      </template>
      <template v-slot="{ data }">
         <div class="near-list-content">  
          <div class="title">{{ data.courseName }}</div>
          <div class="session" >{{ data.courseIndexName }}</div>
          <div class="time">上次保存时间：{{ data.lastSaveDate ||'无'}}</div>
        </div>
      </template>
      <template v-slot:actions="{ data }">
        <div class="menu">
          <el-button size="small" round :class="{ 'btn-hidden': data.checkStaus === 2 }"  @click="savePrepareClass(data)">提交备课</el-button>
          <el-button size="small" round type='primary' v-if="data.checkStaus === 1"  @click="courseDetailFileList(data)">继续备课</el-button>
          <el-button size="small" round type='primary' v-if="data.checkStaus === 2"  @click="courseDetailFileList(data)">查看备课</el-button>
        </div>  
      </template>
    </cus-list>
  </div>
</template>

<script lang='ts'>
import { ref, Ref, watch } from 'vue'
import Screen from './../../../utils/screen';
import CurriculumPapers from './../components/curriculum-papers.vue';
import axios from 'axios'
import { AxResponse } from './../../../core/axios'
import { ElMessage, ElLoading, locale } from 'element-plus'
import SearchTime from './search-time.vue'

export default {
  props: {
    listShow: Number
  },
  components: { SearchTime },
  setup(props) {
    let params: Ref<any> = ref({});
    let nearList: Ref<any> = ref();

    // 搜索时刷新接口
    const searchTime = (data) => {
      nearList.value.request(data)
    }

    // 查看备课、继续备课
    const courseDetailFileList = (item) => {
      let id = props.listShow === 0 ? item.courseIndex : item.id;
      Screen.create( CurriculumPapers, { title: item.courseName, id: id }).then((data: any) => {
        if(data) {
          nearList.value.request(params)
        }
      })
    }
   
    // 提交备课
    const savePrepareClass = async(data) => {
      //获取提交备课参数
      const prepareLessonRequest = new Promise((resolve, reject) => {
        axios.post<any,AxResponse>('/admin/prepareLesson/queryPrepareLessonByCourseIndexId',{ courseIndexId: data.courseIndex }).then(res => {
            if(res.result) {
              resolve(res.json)
            }else{
              ElMessage.error(res.msg)
              reject(false)
            }
        })
      })
      // 将获取的参数传到提交接口内
      prepareLessonRequest.then((res: any) => {
        let __params = {
          courseId: res.courseDto.id,
          courseIndexId: res.courseDto.courseIndexId,
          prepareLessonId: res.prepareLesson.id,
        }
        axios.post<any,AxResponse>('/admin/prepareLesson/submitPrepareLessonById', __params).then(res => {
          if(res.result){
            ElMessage.success('提交成功')
            nearList.value.request(params)
          }else {
            ElMessage.error(res.json)
          }
        })
      }) 
    }

    return { params, courseDetailFileList, nearList, savePrepareClass, searchTime }
  }
}
</script>

<style lang="scss" scoped>
.near-cus-list{
  :deep(.cus__list__container .cus__list__item){
    padding: 5px 10px;
    align-items: center;
  }
  :deep(.cus__list__container .cus__list__item):hover{
    background: #F5F7FA;
  }
  .near-list-content{
    display: flex;
    justify-content: space-around;
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
      flex: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 16px;
      font-weight: 400;
      color: #333333;
    }
    .session{
      flex: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 16px;
      font-weight: 500;
      color: #1A2633;
    }
    .time{
      flex: 3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 400;
      color: #909399;
    }
  }
  .menu{
    .el-button{
      margin-right: 10px;
    }
    .btn-hidden{
      visibility: hidden;
    }
  }
}
@media screen and(max-width: 1280px){
  .near-cus-list{
    .menu{
      .el-button{
        margin-right: 0;
      }
    }
  }
}
</style>