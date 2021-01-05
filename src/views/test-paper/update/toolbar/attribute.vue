<template>
  <div>
    <h2>试卷属性</h2>
    <el-select placeholder="选择年份" size="medium">
      <el-option />
    </el-select>
    <el-select placeholder="选择年级" size="medium">
      <el-option />
    </el-select>
    <el-select placeholder="选择年级" size="medium">
      <el-option />
    </el-select>
    <el-select placeholder="选择年级" size="medium">
      <el-option />
    </el-select>
    <h2>试卷排版</h2>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import store from './../store/index';

export default {
  setup() {
  }
}
</script>

<style lang="scss" scope>

</style>