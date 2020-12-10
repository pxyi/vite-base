<template>
  <div class="cus__query__container">
    <input type="text" style="display:none" />

    <div class="query__cell" v-for="node in nodes" :key="node.key" :data-before="node.label">

    </div>
  </div>
</template>
<script lang="ts">
export default {
  setup(props) {
    
  } 
}
</script>
<style lang="scss" scoped>

</style>