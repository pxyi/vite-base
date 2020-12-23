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
            <p><span class="span-title">科目：</span><span class="span-content">无</span><span class="span-title">课程类型：</span><span class="span-content">无</span></p>
            <p><span class="span-title">年级：</span><span class="span-content">无</span><span class="span-title">保存时间：</span><span class="span-content">无</span></p>
          </div>       
        </div>
      </div>
      <div class="main">

      </div>
      
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, reactive, inject } from 'vue';
export default {
  props: {
    id: String,
    title: String,
  },
  setup(props) {

    let close = inject('close')

    
    return { close }
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
          p{
            line-height: 25px;
            display: flex;
            span{
              font-weight: 500;
            }
            .span-content{
              width: 180px;
            }
          }
        }
      }
    }
  }
  
}
</style>