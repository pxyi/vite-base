<template>
  <div>
    <p>以下是您选择题目的重复题（{{ dataset.length }}道）</p>
    <section>
      <div v-for="(data, index) in dataset" :key="data.id" :class="{'is__checked': checkedIndex === index}" @click="checkedIndex = index">
        <div class="title" v-html="data.title"></div>
        <div class="main" v-questhtml="data"></div>
        <el-radio :modelValue="checkedIndex === index" :label="true" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { ref, Ref } from 'vue';
import axios from 'axios';
import questHtml from '/@/views/utils/question.directive';
import { ElMessage } from 'element-plus';

export default {
  props: ['repeatInfos'],
  directives: { questhtml: questHtml },
  setup(props) {
    let dataset = ref([]);

    let checkedIndex: Ref<number> = ref(-1);
    axios.post('/tiku/question/querySimilarQuestions',
      { repeatInfos: props.repeatInfos },
      { headers: { 'Content-Type': 'application/json' }
    }).then((res: any) => {
      dataset.value = res.json;
    });

    const save = (resolve, reject) => {
      if (checkedIndex.value > -1) {
        resolve(dataset.value[checkedIndex.value]);
      } else {
        ElMessage.warning('请选择替换的试题！');
        reject();
      }
    }

    return { dataset, checkedIndex, save }
  }
}
</script>

<style lang="scss" scoped>
p {
  color: #77808D;
  font-size: 16px;
  margin-bottom: 20px;
}
section {
  & > div {
    padding: 20px;
    border-radius: 4px;
    border: 1px solid #DEE4F1;
    position: relative;
    cursor: pointer;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    &.is__checked,
    &:hover {
      border-color: #1aafa7
    }
    .title {
      margin-bottom: 15px;
    }
  }
}
:deep(.el-radio) {
  padding: 3px 5px;
  border-radius: 4px;
  background: #eee;
  position: absolute;
  top: 0;
  right: 0;
  .el-radio__label {
    display: none;
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
      flex-wrap: wrap;
      .c-t-item {
        flex: 1;
        white-space: nowrap;
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
