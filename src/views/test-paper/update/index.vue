<template>
  <div class="paper__update__container">
    <div class="header">
      <div class="save"><i class="el-icon-edit-outline" /><span>自动保存...</span></div>
      <div class="tabs_box">
        <ul>
          <li v-for="p in classList" :key="p.id" :class="{ active: classType === p.id }" @click="classType = p.id">{{ p.name }}</li>
        </ul>
      </div>
      <div class="btns">
        <el-button round @click="close();$router.push('/')">题库</el-button>
        <el-button round>下载</el-button>
      </div>
    </div>
    <div class="content">
      <div class="toobar">

      </div>
      <div class="main">

      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, reactive, inject } from 'vue';
export default {
  props: {
    id: String
  },
  setup(props) {
    let classType = ref(1);
    let classList = [ { name: '教师版', id: 1 }, { name: '学生版', id: 2 }, { name: '解析版', id: 3 } ];
    let close = inject('close')
    return { classType, classList, close }
  }
}
</script>
<style lang="scss" scoped>
@import './../../../cus-var.scss';
.paper__update__container {
  background: $--color-primary;
  .header {
    padding: 0 80px;
    display: flex;
    height: 60px;
    line-height: 60px;
  }
  .save {
    color: #fff;
    i {
      font-size: 24px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .btns {
    margin-left: 30px;
    button {
      color: #1AAFA7;
      padding: 10px 23px;
      input {
        display: none;
      }
    }
  }
  .save, .btns {
    width: 200px;
    text-align: right;
  }
  .tabs_box {
    flex: auto;
    text-align: center;
    ul {
      display: inline-block;
    }
    li {
      float: left;
      padding: 0 20px;
      color: #fff;
      font-size: 18px;
      list-style: none;
      position: relative;
      cursor: pointer;
      &.active::after {
        content: '';
        display: block;
        width: 100%;
        height: 6px;
        background: #FAAD14;
        border-radius: 3px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>