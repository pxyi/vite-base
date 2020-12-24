<template>
  <div class="near-cus-list">
    <cus-list has-page url="/admin/prepareLesson/queryPageV2" :default="params" :auto-request="true" :headers='{ type: 1 }'>
      <template v-slot:avatar>
         <img src="/@/assets/prepare-teach/book_logo.png" width="36"  alt="">
      </template>
      <template v-slot="{ data }">
         <div class="near-list-left">  
          <div class="title">{{ data.courseName }}</div>
          <div class="session" >{{ data.courseIndexName }}</div>
          <div class="time">上次保存时间：{{ data.lastSaveDate ||'无'}}</div>
        </div>
      </template>
      <template v-slot:actions="{ data }">
        <div class="menu">
          <el-button size="small" v-if="data.checkStaus == 1"  @click="courseDetailFileList(data,index)">继续备课</el-button>
          <el-button size="small" v-if="data.checkStaus == 2"  @click="courseDetailFileList(data,index)">查看备课</el-button>
        </div>  
      </template>
    </cus-list>
  </div>
</template>

<script lang='ts'>
import { ref, Ref } from 'vue'

export default {
  setup() {
    let params: Ref<any> = ref({});

    return { params }
  }
}
</script>

<style lang="scss" scoped>
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
        
      }
      li:hover{
        background: #E1E6F2;
        box-shadow: 0px 2px 4px 0px rgba(69, 90, 247, 0.05), 0px 0px 8px 0px rgba(69, 90, 247, 0.06);
      }
    }
  }
</style>