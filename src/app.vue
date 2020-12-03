<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3.0 + Vite" />

  <!-- <el-date-picker v-model="val" type="year" placeholder="选择年" /> -->
  
  
  <div>
    <div>{{ name }}</div>
    <el-button @click="setName('phuhoang')">set</el-button>
  </div>
  <div>
    <div>{{ user }}</div>
  </div>
</template>
<script>
import HelloWorld from './components/HelloWorld.vue';
import { ref,reactive } from 'vue';
const useRef = (val) => {
  let state = ref(val)
  return [ state , (v) => { state.value = v } ]
}

export default {
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    let [ name, setName ] = useRef('huangpu');

    let user = reactive({
      name: 'phuhoang',
      age: 18
    })
    console.log(user)
    setTimeout(() => {
      user.name = 'huangpu'
    }, 2000);
    return { name, setName, user }
  }
}
</script>
