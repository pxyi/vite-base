<template>
  <div class="paper__update__container">
    <div class="header">
      <div class="tabs_box">
        {{title}}
      </div>
      <div class="btns">
        <el-button round @click="close();$router.push('/')">提交备课</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content-top">
        <div class="course-img">
          <img src="/@/assets/prepare-teach/courseBg.png" style="width: 130px" alt="">
        </div>
        <div class="class-top">
          <h2>{{title}}</h2>
          <div class="class-list">
            <div>
              <p class="front"><span class="span-title">科目：</span><span class="span-content">{{'无'}}</span></p>
              <p><span class="span-title">课程类型：</span><span class="span-content">{{'无'}}</span></p>
            </div>
            <div>
              <p class="front"><span class="span-title">年级：</span><span class="span-content">{{'无'}}</span></p>
              <p><span class="span-title">保存时间：</span><span class="span-content">{{'无'}}</span></p>
            </div>
          </div>       
        </div>
      </div>
      <div class="main">
         <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">
            <div class="btn-box">
              <el-button type="primary" @click="uploadPlan" round>上传我的教案</el-button>
              <el-button type="primary" @click="uploadVideo" round>上传我的说课</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div> 
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, reactive, inject } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';

export default {
  props: {
    id: String,
    title: String,
  },
  setup(props) {
    let close = inject('close')
    let activeName = ref('first')

    // 获取tab标签数据
    let tabCountList = ref([
      { name: '全部', nameKey: 'totalCount', num: '' }, 
      { name: '课件', nameKey: 'courseWareCount', num: '' }, 
      { name: '讲义', nameKey: 'handoutCount', num: '' }, 
      { name: '标准教案', nameKey: 'teachplanCount', num: '' }, 
      { name: '说课视频', nameKey: 'otherCount', num: '' },
      { name: '其他', nameKey: 'totalCount', num: '' },
      ])
    axios.post<any,AxResponse>(
      '/admin/prepareLesson/queryMaterialCountByCourseIndexId',
      { courseIndexId: props.id},
      { headers: { type: 1 }}).then(res => {
        if(res.result) {
          let arr = Object.entries(res.json)
          arr.map(([key, value]) => {
            tabCountList.value.map(item => {
              console.log(value)
              if(item.nameKey == key){
                item.num = value
              }
            })
          })
          console.log(Object.entries(res.json))
        }
      })
  
  

    return { close, activeName }
  }
}
</script>
<style lang="scss" scoped>
@import './../../../cus-var.scss';
.paper__update__container {
  background: $--background-color-base;
  height: 100%;
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
        padding: 8px 50px;
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
      :deep(.el-tabs__nav){
        border: none;
      }
    }
  }
}
</style>