<template>
  <div class="paper-update-container">
    <div class="header"><HeaderComponent /></div>
    <div class="content">
      <ToolbarComponent v-if="!preview" />
      <ContentComponent />
    </div>
  </div>

</template>
<script lang="ts">
import { ref, Ref, reactive, provide } from 'vue';
import axios from 'axios';
import HeaderComponent from './header.vue';
import ToolbarComponent from './toolbar.vue';
import ContentComponent from './content.vue';
import store from './store/index';
import emitter from '/@/utils/mitt';
import { ElLoading } from 'element-plus';
import { useRoute } from 'vue-router';

export default {
  components: { HeaderComponent, ToolbarComponent, ContentComponent },
  setup(props) {
    let route = useRoute();

    let preview = route.params.preview === 'true';
    let id = route.params.id;

    provide('id', id)
    provide('preview', preview)

    const loading = ElLoading.service();
    axios.post<null, { json: any }>('/tiku/paper/getPaper', { id }).then((res) => {
      res.json.paperCharpts = res.json.paperCharpts.map(quest => { quest.questions.map(q => {q.question = q.question || { title: '默认标题' }; return q;}); return quest } )
      store.commit('set_paper_info', res.json);
      loading.close();
      setTimeout(() => emitter.emit('ready') );
    });

    return { preview }
  }
}
</script>
<style lang="scss" scoped>
.paper-update-container {
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