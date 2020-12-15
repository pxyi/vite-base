<template>
  <div>内容</div>
  <input type="text">
</template>
<script lang="ts">
import { PropType } from 'vue';
import emitter from './../utils/mitt';


export default {
  setup() {
    const save = (resolve, reject) => {
      setTimeout(() => {
        reject()
      }, 1000);
      // setTimeout(() => {
      //   resolve({ msg: '操作成功' })
      // }, 2000);
    }
    return { name: 'phuhoang', save }
  }
}

</script>