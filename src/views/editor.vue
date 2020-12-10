<template>
  <cus-editor v-model="value" />
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import CusEditor from './../components/editor/index.vue';

export default {
  components: { CusEditor },
  setup() {
    let value = ref('默认值');
    return { value }
  }
}
</script>
