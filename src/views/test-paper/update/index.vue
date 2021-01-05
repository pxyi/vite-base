<template>
  <div class="container">
    <div class="header"><HeaderComponent /></div>
    <div class="content">
      <ToolbarComponent />
      <ContentComponent />
    </div>
  </div>

</template>
<script lang="ts">
import { ref, Ref, reactive } from 'vue';
import HeaderComponent from './header.vue';
import ToolbarComponent from './toolbar.vue';
import ContentComponent from './content.vue';

export default {
  props: {
    id: String
  },
  components: { HeaderComponent, ToolbarComponent, ContentComponent },
  setup(props) {
    
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  & > .header {
    height: 60px;
  }
  & > .content {
    flex: 1 1 60px;
    position: relative;
    overflow: hidden;
  }
  .toolbar {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>