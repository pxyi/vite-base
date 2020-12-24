<template>
  <div class="near-cus-list">
    <cus-list has-page url="/admin/prepareLesson/queryPageV2" :default="params" :auto-request="true" :headers='{ type: 1 }'>
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
          <el-button size="small" v-if="data.checkStaus === 0 || data.checkStaus === 1"  @click="courseDetailFileList(data,index)">提交备课</el-button>
          <el-button size="small" type='primary' v-if="data.checkStaus === 1"  @click="courseDetailFileList(data,index)">继续备课</el-button>
          <el-button size="small" type='primary' v-if="data.checkStaus === 2"  @click="courseDetailFileList(data,index)">查看备课</el-button>
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
    :deep(.el-button){
      margin-right: 10px;
      float: right;
      border-radius: 20px;
    }
  }
}
</style>