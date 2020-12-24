<template>
  <div class="cus-list">
    <cust-list has-page url="/admin/prepareLesson/queryPageV2" :default="params" :auto-request="true" :headers='{ type: 1 }'>

    </cust-list>
  </div>
</template>

<script lang='ts'>
import { ref } from 'vue'

export default {
  setup() {
    let params = ref({})
  }
}
</script>