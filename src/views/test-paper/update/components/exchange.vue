<template>
  <el-skeleton :loading="loading">
    <div class="section" v-if="dataset.length">
      <div>备选：</div>
      <el-tag  size="small"
        :effect="checkedIndex === i - 1 ? 'dark' : 'plain'" 
        v-for="i in dataset.length" :key="i" 
        @click="checkedIndex = i - 1"
      >{{ i }}</el-tag>
      <div class="reset" @click="getQuestionList"><i class="iconfont iconhuanti" />换一批</div>
    </div>
    <div class="content">
      <div class="title" v-html="dataset[checkedIndex].title"></div>
      <div class="main" v-html="dataset[checkedIndex].html"></div>
    </div>
  </el-skeleton>
</template>

<script lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { questToHtml } from './../../../utils/question.directive';
import { cloneDeep } from 'lodash';

export default {
  props: ['id'],
  setup(props) {
    let loading = ref(true);
    let dataset = ref([]);
    let checkedIndex = ref(0);
    let current = 1;
    const getQuestionList = async () => {
      loading.value = true;
      let res: any = await axios.post('/tiku/question/querySimilar', { id: props.id, current,size: 10 });
      if (res.result) {
        checkedIndex.value = 0;
        dataset.value = res.json.records.map(i => { i.html = questToHtml(i); return i; });
        current = res.json.records.length < 10 || res.json.total <= current * 10 ? 1 : current + 1;
      }
      loading.value = false;
    }
    getQuestionList();

    const save = (resolve) => {
      resolve(cloneDeep(dataset.value[checkedIndex.value]))
    }

    return { loading, dataset, checkedIndex, getQuestionList, save };
  }
}
</script>

<style lang="scss" scoped>
.section {
  display: flex;
  line-height: 24px;
  margin-bottom: 20px;
  .el-tag {
    margin-right: 10px;
    cursor: pointer;
  }
  .reset {
    margin-left: auto;
    color: #1AAFA7;
    font-size: 12px;
    cursor: pointer;
    i {
      font-size: 14px;
      margin-right: 3px;
    }
  }
}
.content {
  .title {
    margin-bottom: 10px;
  }
  .main {
    padding-left: 10px;
  }
}

:deep(.main) .e-main {
  .e-m-cell {
    display: flex;
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .e-c-label {
      width: 40px;
    }
    .e-c-group {
      flex: 1 1 40px;
      display: flex;
      .c-t-item {
        flex: 1;
      }
    }
  }
  &-title {
    .e-m-cell {
      margin-bottom: 20px;
      .e-c-label {
        margin-bottom: 5px;
      }
      .e-c-group {
        line-height: 24px;
        text-indent: 20px;
      }
    }
  }
}
</style>