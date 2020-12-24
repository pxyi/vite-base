<template>
  <div class="near-cus-list">
    <cus-list has-page url="/admin/prepareLesson/queryPageV2" :default="params" :auto-request="true" :headers='{ type: 1 }'>
      <template v-slot="{ data }">
         <div class="near-list-left" >  
          <div class="courseTitle">
            <img src="/@/assets/prepare-teach/book_logo.png" width="36"  alt="">
            <div class="title">{{ data.courseName }}</div>
          </div>
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