<template>
  <div class="cus__list__container" v-loading="loading">
    <div class="cus__list__main">
      <div class="cus__list__item" v-for="(node) in list" :key="node.id">
        <div class="cus__list__avatar"><slot name="avatar" /></div>
        <div class="cus__list__content"><slot :data="node" /></div>
        <div class="cus__list__actions"><slot name="actions" :data="node" /></div>
      </div>
    </div>

    <template v-if="hasPage && list.length">
      <el-pagination 
        v-model:current-page="page.current" 
        v-model:page-size="page.size" 
        :total="page.total"
        @current-change="request()"
        layout="prev, pager, next"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { PropType, computed, watch, reactive, ref } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../core/axios';

interface INode {
  avatar: string;
}
type IDataSet = INode[]

export default {
  name: 'cus-list',
  props: {
    url: String,
    default: {
      type: Object,
      default: () => ({})
    },
    autoRequest: {
      type: Boolean,
      default: () => true
    },
    hasPage: {
      type: Boolean,
      default: () => false
    },
    dataSet: {
      type: Array as PropType<IDataSet>,
      default: () => []
    }
  },
  setup(props) {
    let list = ref(props.dataSet);

    let loading = ref(false);

    let page = reactive({
      current: 1,
      size: 10,
      total: props.dataSet.length
    });
    watch(props.default, () => { page.current = 1; request() });

    let __params = {};
    const request = async (params?) => {
      params && (page.current = 1, __params = params);
      loading.value = true;
      let res = await axios.post<any, AxResponse>(props.url!, { ...props.default, ...__params, current: page.current, size: page.size });
      if (res.result) {
        page.total = res.json.total;
        list.value = res.json.records;
      }
      loading.value = false;
    }
    props.url && props.autoRequest && request(props.default);

    
    return { list, page, request, loading }
  }
}
</script>
<style lang="scss" scoped>
.cus__list__container {
  padding: 18px 20px;
  border-radius: 6px;
  border: 1px solid #EBF0FC;
  box-shadow: 0px 1px 6px 0px rgba(91, 125, 255, 0.08);
  background: #fff;
  .cus__list__main {
    min-height: 120px;
  }
  .cus__list__item {
    display: flex;
    padding: 16px 20px;
    border-radius: 10px;
    border: 1px solid #EBEEF6;
    transition: all .25s;
    &:not(:last-child) {
      margin-bottom: 20px;
    }
    &:hover {
      box-shadow: 0px 2px 11px 0px rgba(23, 18, 45, 0.2);
    }
    :deep(.cus__list__avatar) > * {
      margin-right: 20px;
    }
    .cus__list__content {
      flex: auto;
    }
    .cus__list__actions {
      display: flex;
      margin-left: auto;
    }
  }
  .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>