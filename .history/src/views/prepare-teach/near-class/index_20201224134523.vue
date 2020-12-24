<template>
  <div class="cus-list">
    <cus-list has-page url="/admin/prepareLesson/queryPageV2" :default="params" :auto-request="true" :headers='{ type: 1 }'>

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