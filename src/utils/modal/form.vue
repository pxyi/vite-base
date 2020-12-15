<template>
  <el-form :model="formGroup" :rules="rules" ref="formRef" label-width="80px" class="cus__modal__form__container">
    <input type="text" style="display:none" />
    <el-form-item v-for="node in nodes" :key="node.key" :label="node.label" :prop="node.key">
      <template v-if="node.type === 'input'">
        <el-input clearable v-model="formGroup[node.key]" :placeholder="node.placeholder || `请输入${node.label}`" />
      </template>
      <template v-else-if="node.type === 'number'">
        <el-input-number clearable controls-position="right" v-model="formGroup[node.key]" :placeholder="node.placeholder || `请输入${node.label}`" />
      </template>
      <template v-else-if="node.type === 'select'">
        <el-select clearable :multiple="node.multiple" v-model="formGroup[node.key]" :placeholder="node.placeholder || `请选择${node.label}`">
          <el-option v-for="option in node.options" :key="option[node.valueKey || 'id']" :label="option[node.labelKey || 'name']" :value="option[node.valueKey || 'id']" />
        </el-select>
      </template>
      <template v-else-if="node.type === 'datepicker'">
        <el-date-picker type="date" :value-format="node.format || 'yyyy-MM-dd'" v-model="formGroup[node.key]" :placeholder="node.placeholder || `请选择${node.label}`" />
      </template>
      <template v-else-if="node.type === 'rangepicker'">
        <el-date-picker type="daterange" :value-format="node.format || 'yyyy-MM-dd'"
          range-separator="~" v-model="formGroup[node.key]"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </template>
      <template v-else-if="node.type === 'between'">
        <el-input readonly value="~">
          <template #prepend>
            <el-input-number controls-position="right" clearable style="width: 100%" :model-value="formGroup[node?.keys[0]]" @update:modelValue="(e) => formGroup[node?.keys[0]] = e" placeholder="开始" />
          </template>
          <template #append>
            <el-input-number controls-position="right" clearable style="width: 100%"  :model-value="formGroup[node?.keys[1]]" @update:modelValue="(e) => formGroup[node?.keys[1]] = e" placeholder="结束" />
          </template>
        </el-input>
      </template>
      <template v-else><div style="display: none">隐藏项</div></template>
    </el-form-item>
  </el-form>
</template>
<script lang="ts">
import { PropType, reactive} from 'vue';
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElDatePicker } from 'element-plus';
import axios from 'axios';
type INodes = PropType<(NInput | NNumber | NBetween | NSelect | NDatepicker | NRangepicker)[]>;

export default {
  props: {
    nodes: {
      type: Array as INodes,
      default: () => []
    },
    rules: {
      type: Object as any,
      default: () => ({})
    },
    data: {
      type: Object as any,
      default: () => ({})
    }
  },
  components: { ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElDatePicker },
  setup(props) {
    let pca = () => import('area-data');
    let formGroup = reactive(props.nodes.reduce((group, node) => {
      if (node.type === 'between') {
        group[node.keys[0]] = props.data[node.keys[0]];
        group[node.keys[1]] = props.data[node.keys[1]];
      } else {
        group[node.key] = props.data[node.key] || node.default;
      }
      if (node.type === 'select' && node.url) {
        axios.post(node.url).then((res: any) => {
          node.options = [...res.json, ...(node.options || [])];
        });
      }
      return group;
    }, {}))

    const save = (resolve, reject) => {
      console.log(formGroup)
      reject()
    }
    return { formGroup, save }
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