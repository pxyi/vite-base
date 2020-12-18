<template>
  <div>内容</div>
  <input type="text">

  <template>
    <div>主要内容</div>
  </template>
</template>
<script lang="ts">
import { PropType } from 'vue';
import emitter from './../utils/mitt';


export default {
  setup() {
    
    return { name: 'phuhoang' }
  }
}

</script>