<template>
  <div class="paper__header__container">
    <div class="header">
      <div class="save"><div v-if="!isPreview" @click="save"><i class="el-icon-edit-outline" /><span>自动保存...</span></div></div>
      <div class="tabs_box" v-if="isPreview">
        <ul>
          <li v-for="p in classList" :key="p.id" :class="{ active: classType === p.id }" @click="classType = p.id">{{ p.name }}</li>
        </ul>
      </div>
      <div class="btns">
        <el-button round @click="close();$router.push('/teaching/question')" v-if="!isPreview">题库</el-button>
        <el-button round @click="download">下载</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, reactive, computed, inject } from 'vue';
import Modal from './../../../utils/modal';
import downloadComponent from './../components/download.vue';
import store from './store';
import axios from 'axios';

export default {
  setup(props) {
    let classType = computed({
      get: () => store.state.classType,
      set: (v) => store.commit('set_class_type', v)
    });
    let classList = [ { name: '教师版', id: 1 }, { name: '学生版', id: 2 }, { name: '解析版', id: 3 } ];
    let close = inject('close');
    let id = inject('id');
    let isPreview = inject('preview');

    const download = () => {
      Modal.create({
        title: '下载试卷',
        width: 640,
        zIndex: 2011,
        component: downloadComponent
      }).then((res: any) => {
        window.open(`${import.meta.env.VITE_APP_BASE_URL}/tiku/paper/downPaper?paperId=${ id }&type=${ res.type }&templateId=${ res.templateId }`);
      });
    }

    let paperInfo = computed(() => store.state.paperInfo);
    const save = () => {
      axios.post('/tiku/paper/addPaper', paperInfo.value,{ headers: { 'Content-Type': 'application/json' } })
    }
    return { classType, classList, close, download, isPreview, save }
  }
}
</script>
<style lang="scss" scoped>
@import './../../../cus-var.scss';
.paper__header__container {
  background: $--color-primary;
  .header {
    padding: 0 80px;
    display: flex;
    height: 60px;
    line-height: 60px;
  }
  .save {
    color: #fff;
    cursor: pointer;
    i {
      font-size: 24px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .btns {
    margin-left: auto;
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