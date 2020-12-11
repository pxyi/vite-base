<template>
  <h1>index</h1>
  <i class="el-icon-edit"></i>
  <el-button type="primary">测试</el-button>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import emitter from './../utils/mitt';
import axios from 'axios';

export default {
  setup() {
    axios.post('/permission/user/userDataSubjects', {a: 1}).catch(err => console.log('err', err));
    axios.post('/permission/user/userDataSubjects', {a: 1}).catch(err => console.log('err2', err));
    axios.get('/permission/user/userDataSubjects', {params: {aa: 11}}).catch(err => console.log('err2', err));
  }
}
</script>
