<template>
  <div class="near-cus-list">
    <cus-list has-page url="/admin/prepareLesson/queryPageV2" :default="params" :auto-request="true" :headers='{ type: 1 }' ref="nearList">
      <template v-slot:avatar>
         <img src="/@/assets/prepare-teach/book_logo.png" width="36"  alt="">
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
          <el-button size="small" round :class="data.checkStaus === 1?'btn-hidden':''"  @click="savePrepareClass(data)">提交备课</el-button>
          <el-button size="small" round type='primary' v-if="data.checkStaus === 1"  @click="courseDetailFileList(data)">继续备课</el-button>
          <el-button size="small" round type='primary' v-if="data.checkStaus === 2"  @click="courseDetailFileList(data)">查看备课</el-button>
        </div>  
      </template>
    </cus-list>
  </div>
</template>

<script lang='ts'>
import { ref, Ref } from 'vue'
import Screen from './../../../utils/screen';
import CurriculumPapers from './../components/curriculum-papers.vue';
import axios from 'axios'
import { AxResponse } from './../../../core/axios'
import { ElMessage } from 'element-plus'


export default {
  props: {
    listShow: Number
  },
  setup(props) {
    let params: Ref<any> = ref({});

    const courseDetailFileList = (item) => {
      let id = props.listShow === 0 ? item.courseIndex : item.id;
      Screen.create( CurriculumPapers, { title: item.courseName, id: id })
    }


    //获取提交备课参数
    let courseDto: any = ref({})
    let prepareLesson: any = ref({})
    const prepareLessonRequest = new Promise((resolve, reject) => {
      resolve(
        axios.post<any,AxResponse>('/admin/prepareLesson/queryPrepareLessonByCourseIndexId').then(res => {
          if(res.result){
            console.log(res)
          }
        })
      )
        
    })
    // 提交备课
    let  nearList: Ref<any> = ref()
    const savePrepareClass = async(data) => {
      Promise.all([prepareLessonRequest]).then(res => {
        console.log(res)
      })
        console.log(courseDto.value.id)

      let __params = {
        courseId: courseDto.value.id,
        courseIndexId: courseDto.value.courseIndexId,
        prepareLessonId: prepareLesson.value.id,
      }
      console.log(__params)
      // let res = await axios.post<any,AxResponse>('/admin/prepareLesson/submitPrepareLessonById', __params);
      // if(res.result){
      //   ElMessage.success('提交成功')
      //   nearList.value.request(params)
      // }else {
      //   ElMessage.error(res.json)
      // }
    }
    return { params, courseDetailFileList, savePrepareClass, nearList, prepareLessonRequest }
  }
}
</script>

<style lang="scss" scoped>
.near-cus-list{
  :deep(.cus__list__container .cus__list__item){
    padding: 5px 20px;
  }
  .cus__list__avatar > *{
    margin-top: 12px;
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
    width: 200px;
    margin-top: 13px;
    .el-button{
      margin-right: 10px;
    }
    .btn-hidden{
      visibility: hidden;
    }
  }
}
</style>