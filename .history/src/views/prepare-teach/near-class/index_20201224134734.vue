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