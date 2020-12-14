<template>
  <div class="index__container">
    <div class="index__content">
      <index-content :nick-name="nickName" />
    </div>
    <div class="index__fixed">
      <index-fixed :nick-name="nickName" />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import IndexContent from './components/content.vue';
import IndexFixed from './components/fixed.vue';

export default {
  components: { IndexContent, IndexFixed },
  setup() {
    let store = useStore();
    let nickName = store.getters.userInfo.user.nickname || '未知用户';
    return { nickName }
  }
}
</script>

<style lang="scss" scoped>
@import './../../cus-var.scss';
.index__container {
  display: flex;
  position: relative;
  overflow: hidden;
}
.index__content {
  flex: auto;
  padding-top: 20px;
}
.index__fixed {
  width: 515px;
  height: calc(100% - 60px);
  padding-top: 10px;
  padding-right: 25px;
  padding-left: 34px;
}

@media only screen and (max-width: 1680px) {
  .index__fixed { width: 450px; }
}
@media only screen and (max-width: 1440px) {
  .index__fixed { width: 380px; }
}
@media only screen and (max-width: 1280px) { 
  .index__fixed { width: 320px;  padding-top: 0; padding-right: 0px; padding-left: 20px;}
  .index__content { padding: 0; } 
}

</style>
