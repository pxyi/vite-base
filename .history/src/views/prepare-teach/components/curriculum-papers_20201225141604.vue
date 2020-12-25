<template>
  <div class="paper__update__container">
    <div class="header">
      <div class="tabs_box">
        {{title}}
      </div>
      <div class="btns">
        <el-button round @click="savePrepareClass" :disabled="prepareLesson === '' && prepareLesson.id === null " v-if="!prepareLesson.checkStatus || prepareLesson.checkStatus === 0">提交备课</el-button>
        <el-button round @click="savePrepareClass" v-if="prepareLesson.checkStatus === 1"  >已提交</el-button>
        <el-button round v-if="prepareLesson.checkStatus === 2" disabled>已备课</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content-top">
        <div class="course-img">
          <img src="/@/assets/prepare-teach/courseBg.png" style="width: 130px" alt="">
        </div>
        <div class="class-top">
          <h2>{{courseDto.courseName}}</h2>
          <div class="class-list">
            <div>
              <p class="front"><span class="span-title">科目：</span><span class="span-content">{{ courseDto.subjectName ||'无' }}</span></p>
              <p><span class="span-title">课程类型：</span><span class="span-content">{{ courseDto.gradeName ||'无' }}</span></p>
            </div>
            <div>
              <p class="front"><span class="span-title">年级：</span><span class="span-content">{{ courseDto.courseTypeName ||'无' }}</span></p>
              <p><span class="span-title">保存时间：</span><span class="span-content">{{ prepareLesson.modifyTime ||'无' }}</span></p>
            </div>
          </div>       
        </div>
      </div>
      <div class="main">
         <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="item in tabCountList" :key="item"  :name="item.nameKey">
          <template #label>
            <span>{{item.name}}</span>
            <span class="num">{{item.num}}</span>
          </template>
            <div class="btn-box">
              <el-button type="primary" round @click="uploadMyPlan(item)" >上传我的教案</el-button>
              <el-button type="primary" round @click="uploadMyVideo(item)">上传我的说课</el-button>
            </div>
            <div class="content-list-box">
              <div class="content-list-box-item" v-for="(item,index) in allFileList" :key="index">
                <div class="content-list-box-item-bg">
                  <img class="img-cover" style="width:116px;" v-if="item.ext !== 'mp3' && item.ext !== 'zip' && item.ext !== 'rar' && item.mediaType == null" :src="`/test${item.imgPath}`" alt="">
                  <img v-else src="/@/assets/prepare-teach/weizhiwenjian.png" alt="">
                </div>
                <div class="content-list-box-item-title">
              <span>{{ item.fileName }}</span>
            </div>
            <div class="btn-group">
              <div class="btn-box">
                <div>
                  <el-button size="mini" icon="el-icon-search" @click="preview(item)" round >预览</el-button>
                </div>
              </div>
              <div class="private">
                <i class="el-icon-lock" v-if="item.isPublic == 0" style="font-size: 12px"></i>
              </div>
            </div>
              </div>
              <div v-if="allFileList.length == 0" style="text-align:center;">暂无数据</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div> 
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, reactive, inject, watch, } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';
import Modal from './../../../utils/modal';
import MyPlanUpload from './my-plan-upload.vue'
import MyVideoUpload from './my-video-upload.vue'
import { ElMessage } from 'element-plus'

export default {
  props: {
    id: String,
    title: String,
  },
  setup(props) {
    let close: any = inject('close')
    let activeName = ref('totalCount')

    // 获取上部展示数据
    let courseDto: any = ref({})
    let prepareLesson: any = ref({})
      axios.post<any,AxResponse>('/admin/prepareLesson/queryPrepareLessonByCourseIndexId', { courseIndexId: props.id}).then(res => {
        if(res.result){
          courseDto.value = res.json.courseDto
          res.json.prepareLesson ? prepareLesson.value = res.json.prepareLesson : {};
        }
      })

    // 获取tab标签数据
    let tabCountList = ref([
      { name: '全部', nameKey: 'totalCount', num: 0, type: null }, 
      { name: '课件', nameKey: 'courseWareCount', num: 0, type: 1 }, 
      { name: '讲义', nameKey: 'handoutCount', num: 0, type: 2 }, 
      { name: '标准教案', nameKey: 'teachplanCount', num: 0, type: 5 }, 
      { name: '说课视频', nameKey: 'mediaCount', num: 0, type: 3 },
      { name: '其他', nameKey: 'otherCount', num: 0, type: 4 },
    ])
    const tabCountRequest = async() => {
      let res = await axios.post<any,AxResponse>('/admin/prepareLesson/queryMaterialCountByCourseIndexId', { courseIndexId: props.id});
      if(res.result) {
        let arr = Object.entries(res.json)
        arr.map (( [key, value] ) => {
          tabCountList.value.map( ( item: any ) => {
            if( item.nameKey == key ) {
              item.num = value
            }
          })
        })
      }
    }
    tabCountRequest()

    // 获取内容图片数据
    let allFileList = ref([])
    const request = async (type) =>{
      let res = await axios.post<any,AxResponse>('/admin/prepareLesson/queryMaterialByCourseIndexId', { courseIndexId: props.id, type })
      if(res.result) {
        allFileList.value = res.json
      }
    }
    request('')

    // 切换标签获取数据
    let type = ref()
    const handleClick = (e) => {
      tabCountList.value.map( ( item: any,index ) => {
        if( index == e.index ){
          type.value = item.type
          request(type.value)
        }
      })
    }

    // 上传我的教案
    const uploadMyPlan = () => {
      Modal.create({ title: '上传我的教案', width: 640, component: MyPlanUpload, props: { id: props.id }, zIndex: 999 }).then((data: any) => {
        if(data.json){
           request(type.value)
           tabCountRequest()
        }
      })
    }

    // 上传我的说课
    const uploadMyVideo = () => {
      Modal.create({ title: '上传我的说课', width: 640, component: MyVideoUpload, props: { id: props.id }, zIndex: 999 }).then((data: any) => {
        if(data.json){
           request(type.value)
           tabCountRequest()
        }
      })
    }
    // 提交备课
    const savePrepareClass = (resolve, reject ) => {
      let __params = {
        courseId: courseDto.value.id,
        courseIndexId: courseDto.value.courseIndexId,
        prepareLessonId: prepareLesson.value.id,
      }
      axios.post<any,AxResponse>('/admin/prepareLesson/submitPrepareLessonById', __params).then(res => {
        if(res.result){
          ElMessage.success('提交成功')
          resolve(res)
          // close(res)
        }
      })
      
    }

    return { 
      close, activeName, tabCountList, courseDto, request, allFileList, handleClick, prepareLesson, uploadMyPlan, 
      prepareLessonRequest, tabCountRequest, uploadMyVideo, savePrepareClass, type
    }
  }
}
</script>
<style lang="scss" scoped>
@import './../../../cus-var.scss';
.paper__update__container {
  background: $--background-color-base;
  padding-bottom: 1px;
  min-height: 100%;
  .header {
    background: $--color-primary;
    padding: 0 80px;
    display: flex;
    height: 60px;
    line-height: 60px;
  }
  .save {
    color: #fff;
    i {
      font-size: 24px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .btns {
    margin-left: 30px;
    button {
      color: #1AAFA7;
      padding: 10px 23px;
      input {
        display: none;
      }
    }
  }
  .save, .btns {
    width: 200px;
    text-align: right;
  }
  .tabs_box {
    flex: auto;
    color: #fff;
    font-size: 18px;
    ul {
      display: inline-block;
    }
    li {
      float: left;
      padding: 0 20px;
      color: #fff;
      font-size: 18px;
      list-style: none;
      position: relative;
      cursor: pointer;
      &.active::after {
        content: '';
        display: block;
        width: 100%;
        height: 6px;
        background: #FAAD14;
        border-radius: 3px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .content{
    width: 1200px;
    margin: 20px auto;
    .content-top{
      padding: 20px 30px;
      background: #fff;
      border-radius: 10px;
      display: flex;
      justify-content: flex-start;
      .class-top{
        padding: 10px 50px;
        h2{
          font-size: 18px;
          color: #333;
        }
        .class-list{
          margin-top: 30px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          div{
            line-height: 25px;
            .front{
              width: 300px;
            }
            .span-title{
              font-weight: 500;
            }
            .span-content{
              color: #77808D;
            }
          }
        }
      }
    }
    .main{
      margin-top: 30px;
      background: #fff;
      border-radius: 10px;
      .num{
        margin-left: 5px;
        padding: 0 15px;
        background: rgba(119, 128, 141, 0.2);
        color: #77808D;
        height: 20px;
        width: 50px;
        border-radius: 15px;
      }
      .content-list-box{
        padding: 20px 0;
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        flex-wrap: wrap;
        &-item{
          margin-bottom: 15px;
          position: relative;
          box-sizing: border-box;
          padding: 10px 10px;
          width: 160px;
          height: 155px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          cursor: pointer;
          margin-right: 15px;
          &:hover .btn-group{
            display: flex;
          }
          .btn-group{
            top: 0;
            left: 0;
            width: 160px;
            height: 155px;
            border-radius: 6px;
            position: absolute;
            display: none;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.15);
            .btn-box{
              margin-top: -8px;
              width: 100px;
              height: 60px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
            }
            .private{
              display: block;
            }
          }
          &-bg{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 116px;
            height: 87px;
            position: relative;
            .img-cover{
              object-fit: cover;
              width: 100%;
              height: 100%;
            }
            .btn-group{
              position: absolute;
              top: 33px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              height: 60px;
            }
          }
          &-title{
            width: 100%;
            text-align:center;
            text-justify:inter-ideograph;
            margin-top: 8px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            overflow: hidden;
            word-break: break-all;
            word-wrap: break-word;
            white-space: pre-wrap;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .private{
            display: none;
            position: absolute;
            left: 4px;
            bottom: 4px;
            z-index: 10;
            padding: 0 5px;
            background: rgba(0, 0, 0, 0.52);
            border-radius: 5px;
            color: #fff;
          }
        }
      }
      :deep(.el-tabs__header){
        margin-bottom: 0;
      }
      :deep(.el-tabs__content){
        padding: 20px 30px;
      }
      :deep(.el-tabs__nav-scroll){
        background: $--background-color-base;
      }
      :deep(.el-tabs__item){
        background: #fafbfd;
        border: none;
        position: relative;
        height: 44px;
        width: 120px;
        line-height: 44px;
        text-align: center;
        margin-left: 25px;
        &:nth-child(1){
          margin-left: 0;
        }
      }
      :deep(.el-tabs__item)::before{
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: #fafbfd;
        -webkit-box-shadow: 0 -2px 6px 0 rgba(91,125,255,.08);
        box-shadow: 0 -2px 6px 0 rgba(91,125,255,.08);
        border-bottom: none;
        -webkit-transform: perspective(1em) scale(1.3,1.35) rotateX(5deg);
        transform: perspective(1em) scale(1.3,1.35) rotateX(5deg);
        z-index: -1;
        -webkit-transform-origin: bottom;
        transform-origin: bottom left;
      }
      :deep(.el-tabs__item):hover{
        color: #333;
      }
      :deep(.el-tabs__item.is-active){
        color: #333;
        background: #fff;
      }
      :deep(.el-tabs__item.is-active)::before{
        background: #fff;
      }
      :deep(.el-tabs__item.is-active) > .num{
        color: #FFFFFF;
        background: rgba(250, 173, 20, 1);
      }
      :deep(.el-tabs__nav){
        border: none;
      }
    }
  }
}
</style>