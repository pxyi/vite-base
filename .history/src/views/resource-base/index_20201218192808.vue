<template>
     <div>
  <LeftTree  />

     </div>
  
  
<tree />

</template>

<script lang="ts">
import { ref, onMounted, Ref } from 'vue';
import axios from 'axios';
import LeftTree from '../tree.vue'
    export default {
         components: { LeftTree }
    }
</script>

<style lang="scss" scoped>

</style>