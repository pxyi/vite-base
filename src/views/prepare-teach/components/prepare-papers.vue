<template>
  <div class="course-details" v-loading="dialogLoading">
    <ul>
      <li v-for="(item,index) in courseIndexList" :key="index">
        <div class="detaias">第{{ item.orderNo }}讲 {{ item.courseIndexName }}</div>
        <div class="menu">
          <el-button round size="small" v-show="item.lessonStatus === 1" @click="savePrepareClass(item)">提交备课</el-button>
          <el-button type="primary" round size="small" v-show="item.lessonStatus === 0" @click="courseDetailFileList(item)">去备课</el-button>
          <el-button type="primary" round size="small" v-show="item.lessonStatus === 1" @click="courseDetailFileList(item)">继续备课</el-button>
          <el-button type="primary" round size="small" v-show="item.lessonStatus === 2" @click="courseDetailFileList(item)">已备课</el-button>
        </div>
      </li>
    </ul>
    <cus-empty v-if="!courseIndexList.length && !dialogLoading" />
  </div>
</template>

<script lang='ts'>
import { ref, inject } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import { ElLoading, ElMessage } from 'element-plus';
import Screen from './../../../utils/screen';
import CurriculumPapers from './curriculum-papers.vue';


export default {
  props: {
    courseId: String
  },
  setup(props, { emit }) {
    // 列表数据
    let courseIndexList = ref([])
    let dialogLoading = ref(false)
    let close: any = inject('close');
    const queryData = async() => {
      dialogLoading.value = true
      let res = await axios.post<any,AxResponse>('/courseIndex/query', { courseId: props.courseId}, { headers: { type: 1, 'Content-Type': 'application/json' }});
      if(res.result) {
        courseIndexList.value = res.json
      }
      dialogLoading.value = false
    }
    queryData()
    const courseDetailFileList = (item, index) => {
      Screen.create( CurriculumPapers, { title: item.courseIndexName, id: item.id }).then((data: any) => {
        if(data) {
          queryData()
          close(data)
        };
      }).catch((data: any) => {
        if(!data) {
          queryData()
          close(data)
        };
      })
    }

    // 提交备课
    let prepareLessonId = ref()
    const savePrepareClass = async(item) => {
      //获取提交备课参数
      const prepareLessonRequest = new Promise((resolve, reject) => {
        axios.post<any,AxResponse>('/admin/prepareLesson/queryPrepareLessonByCourseIndexId',{ courseIndexId: item.id }).then(res => {
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
        prepareLessonId.value = res.prepareLesson.id
        let __params = {
          courseId: res.courseDto.id,
          courseIndexId: res.courseDto.courseIndexId,
          prepareLessonId: prepareLessonId.value,
        }
        axios.post<any,AxResponse>('/admin/prepareLesson/submitPrepareLessonById', __params).then(res => {
          if(res.result){
            ElMessage.success('提交成功')
            queryData()
          }else {
            ElMessage.error(res.json)
          }
        })
      })
    }
    return { courseIndexList, dialogLoading, courseDetailFileList, queryData, savePrepareClass }
  }
}
</script>

<style lang="scss" scoped>
    :deep(.modal-confirm .modal-body){
      padding: 0 20px 30px;
    }
    :deep(.modal-confirm .modal-header){
      margin-bottom: 20px;
    }
  .course-details{
    ul{
      max-height: 500px;
        li{
          height: 60px;
          background: #FFFFFF;
          border-radius: 10px;
          display: flex;
          justify-content: space-between;
          margin: 10px 0px;
          border: 1px solid #DEE4F1;
          align-content: center;
          line-height: 60px;
          .detaias{
            text-indent: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #77808D;
          }
          .menu{
            margin-right: 20px;
            & > .el-button:last-child{
              background: #faad14;
              border: #faad14;
            }
          }
          &:hover{
            background: #F5F7FA;
          }
        }
      }
    }
</style>
