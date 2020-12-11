<template>
  <template ref="slot">
    <el-button>取消</el-button>
    <el-button type="primary" @click="handle">确定</el-button>
  </template>
</template>

<script>
import { ref, onMounted } from 'vue';
import emitter from './../utils/mitt';
import axios from 'axios'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  setup(props, ctx) {
    let slot = ref();
    onMounted(() => { emitter.emit('slot', slot); })
    const getList = (subject) => {
      // axios.post('/xxxx', {})
      // console.log(subject, '子组件打印')
    }
    emitter.emit('effect', [ getList ])

    let handle = () => { console.log(slot); }
    return { slot, handle } 
  }
}
</script>
