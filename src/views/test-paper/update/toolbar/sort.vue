<template>
  <draggable v-model="paperCharpts" @update:modelValue="sortChange" tag="transition-group" animation="250" item-key="id">
    <template #item="{ element, index }">
      <div class="section">
        <div class="title">
          <span>{{ toChinesNum(index + 1) }}. {{ element.title }}</span>
          <el-dropdown @command="sortHandle($event, index)">
            <span>难度排序</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="down">难度由低到高</el-dropdown-item>
                <el-dropdown-item command="up">难度由高到低</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="content">
          <draggable v-model="element.questions" @update:modelValue="sortChange" tag="transition-group" animation="250" item-key="id">
            <template #item="data">
              <div class="item" @click="scrollTo(index, data.index)">{{ data.index + 1 }}</div>
            </template>
          </draggable>
        </div>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import { computed } from 'vue';
import draggable from 'vuedraggable';
import store from './../store';
import { toChinesNum } from './../utils';
import $, { emitter } from "$";

export default {
  components: { draggable },
  setup() {
    let paperCharpts = computed({
      get: () => store.getters.paperCharpts,
      set: (val) => store.commit('set_paper_charpts', val)
    });

    const sortHandle = (type, index) => {
      let data = $.clone(paperCharpts.value);
      data[index].questions = data[index].questions.sort((a, b) => (type === 'down' ? (a.question.difficult - b.question.difficult) : (b.question.difficult - a.question.difficult) )  );
      store.commit('set_paper_charpts', data);
    }
    const sortChange = () => emitter.emit('test-paper-change');

    const scrollTo = (idx, index) => {
      let top = (document.querySelector(`.paper_content .item[data-uuid="${idx}-${index}"]`) as HTMLElement).offsetTop;
      $.scroll(document.querySelector('.paper_content') as HTMLElement, top, 2000);
    }

    return { paperCharpts, toChinesNum, sortHandle, sortChange, scrollTo }
  }
}
</script>

<style lang="scss" scoped>
.section {
  border-radius: 4px;
  overflow: hidden;
  border: solid 1px transparent;
  &:hover {
    border-color: #1AAFA7;
    .title {
      color: #fff;
      background: #1AAFA7;
    }
    :deep(.title) .el-dropdown .el-dropdown-selfdefine {
      color: #fff;
    }
  }
  .title {
    padding: 0 10px;
    line-height: 32px;
  }
  :deep(.title) .el-dropdown {
    float: right;
    line-height: 30px;
    cursor: pointer;
    .el-dropdown-selfdefine {
      font-size: 12px;
      color: #77808D;
    }
  }
  .content {
    padding: 10px 5px 0 15px;
    display: flex;
    flex-wrap: wrap;
    .item {
      margin: 0 15px 15px 0;
      height: 25px;
      padding: 0 8px;
      line-height: 25px;
      border-radius: 4px;
      border: 1px solid #DCDFE6;
      transition: all .25s;
      cursor: pointer;
      &:hover {
        color: #fff;
        background: #1AAFA7;
        border-color: #1AAFA7;
      }
    }
  }
}
</style>
