<template>
  <div class="cus__query__container">
    <div 
      class="query__cell" 
      v-for="node in nodes"
      :key="node.key"
      :data-before="node.label">
      <template v-if="node.type === 'input'">
        <el-input v-model="formGroup[node.key]" :placeholder="node.placeholder || `请输入${node.label}`" @keydown.enter="submit" />
      </template>
      <template v-else-if="node.type === 'number'">
        <el-input-number v-model="formGroup[node.key]" :placeholder="node.placeholder || `请输入${node.label}`" @keydown.enter="submit" />
      </template>
      <template v-else-if="node.type === 'select'">
        <el-select v-model="formGroup[node.key]" :placeholder="node.placeholder || `请选择${node.label}`" @change="submit">
          <el-option v-for="option in node.options" :key="option[node.valueKey || 'id']" :value="option[node.valueKey || 'id']" :label="option[node.labelKey || 'name']" />
        </el-select>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { PropType, reactive, ref } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../core/axios';
type INode = Array<NInput | NNumber | NSelect>
export default {
  name: 'cus-query',
  props: {
    nodes: {
      type: Array as PropType<INode>,
      default: () => []
    }
  },
  setup(props, { emit }) {
    let formGroup = reactive(props.nodes.reduce((formGroup, node) => {
      formGroup[node.key] = node.default || null;
      if (node.type === 'select' && node.url) {
        axios.post<null, AxResponse>(node.url, node.params || {}).then(res => node.options = [...res.json, ...(node.options || [])])
      }
      return formGroup;
    }, {}));

    const submit = () => {
      emit('submit', formGroup)
    }

    return { formGroup, submit }
  } 
}


interface NPublic {
  readonly label: string;
  readonly default?: any;
  readonly placeholder?: string;
}
interface NInput extends NPublic { 
  readonly type: 'input';
  readonly key: string; 
}
interface NNumber extends NPublic {
  readonly type: 'number';
  readonly key: string; 
}
interface NBetween extends NPublic {
  readonly type: 'between';
  readonly keys: [string, string];
}
interface NSelect extends NPublic {
  readonly type: 'select';
  readonly key: string;
  readonly url?: string;
  readonly multiple?: boolean;
  options?: any[]
  readonly params?: object;
  readonly labelKey?: string;
  readonly valueKey?: string;
}
interface NDatepicker extends NPublic {
  readonly type: 'datepicker';
  readonly key: string;
  format?: 'yyyy-MM-dd' | 'yyyy-MM-dd hh:mm:ss',
}
interface NRangepicker extends NPublic {
  readonly type: 'rangepicker';
  readonly key: string;
  format?: 'yyyy-MM-dd' | 'yyyy-MM-dd hh:mm:ss',
}
</script>
<style lang="scss" scoped>
.cus__query__container {
  &::after {
    content: '';
    clear: both;
    display: block;
  }
  .query__cell {
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    display: flex;
    float: left;
    &.is__buttons {
      float: right;
      &::before {
        display: none;
      }
    }
    &:last-child {
      margin-right: 0;
    }
    &::before {
      content: attr(data-before);
      display: block;
      padding: 0 15px;
      color: #909399;
      font-size: 14px;
      line-height: 38px;
      font-weight: 400;
      background: #F5F7FA;
      border-radius: 4px 0 0 4px;
      border: solid 1px #DCDFE6;
      border-right: 0;
      white-space: nowrap
    }
    .el-input input {
      border-radius: 0 4px 4px 0;
    }
  }

  .query__slot__buttons {
    float: right;
  }
}
</style>