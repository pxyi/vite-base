<template>

</template>

<script lang="ts">
import { ref, Ref, watch } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../../core/axios';
import { useStore } from 'vuex';

export default {
  props: ['dateSet'],
  emits: ['check-change'],
  setup(props, { emit }) {
    const checkChange = (target, { checkedKeys }) => { emit('check-change', checkedKeys) }

    return { checkChange };
  }
}
</script>

<style lang="scss" scoped>
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> 48b271bf50e1353d058a6ad97ded261a5542f404
