<template>
  <template ref="slot">
    <el-button>取消</el-button>
    <el-button type="primary" @click="handle">确定</el-button>
  </template>
</template>

<script>
import { ref, onMounted } from 'vue';
import emitter from './../utils/mitt';
import axios from 'axios';
import Drawer from './../utils/drawer'
import Modal from './../utils/modal';
import com from './drawer.vue';

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

    let handle = () => { console.log(slot); Drawer.create({component: com, title: '标题'}) }

    // let pca = async () => { let res = await import('./../utils/pca'); return res.default};
    // console.log(pca())
    // Modal.create({component: 'form', title: '标题', props: { 
    //   nodes: [
    //     { type: 'input', key: 'name', label: '姓名' },
    //     { type: 'between', keys: ['s', 'n'], label: '区间' }
    //   ]
    // }}).then(console.log)
    // Modal.create({component: com, title: '标题'})

    return { slot, handle } 
  }
}
</script>
