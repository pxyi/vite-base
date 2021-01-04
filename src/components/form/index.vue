<template>
  <el-form :model="formGroup" :rules="rules" ref="formRef" :style="{ width }" label-width="80px" class="cus__form__container">
    <input type="text" style="display:none" />
    <template v-for="node in nodes" :key="node.key">
      <el-form-item :label="node.label" :prop="node.key" v-if="node.type !== 'hidden'">
        <template v-if="node.type === 'input'">
          <el-input clearable v-model="formGroup[node.key]" :placeholder="node.placeholder || `请输入${node.label}`" :disabled="node.disabled" />
        </template>
        <template v-else-if="node.type === 'number'">
          <el-input-number clearable controls-position="right" v-model="formGroup[node.key]" :placeholder="node.placeholder || `请输入${node.label}`" />
        </template>
        <template v-else-if="node.type === 'select'">
          <el-select clearable :multiple="node.multiple" v-model="formGroup[node.key]" :placeholder="node.placeholder || `请选择${node.label}`">
            <el-option v-for="option in node.options" :key="option[node.valueKey || 'id']" :label="option[node.labelKey || 'name']" :value="option[node.valueKey || 'id']" :disabled="option.disabled" />
          </el-select>
        </template>
        <template v-else-if="node.type === 'radio'">
          <el-radio-group  v-model="formGroup[node.key]">
            <el-radio v-for="option in node.options" :key="option[node.valueKey || 'id']" :label="option[node.valueKey || 'id']" :disabled="option.disabled">{{ option[node.labelKey || 'name'] }}</el-radio>
          </el-radio-group>
        </template>
        <template v-else-if="node.type === 'checkbox'">
          <el-checkbox-group  v-model="formGroup[node.key]">
            <el-checkbox v-for="option in node.options" :key="option[node.valueKey || 'id']" :label="option[node.valueKey || 'id']" :disabled="option.disabled">{{ option[node.labelKey || 'name'] }}</el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-else-if="node.type === 'cascader'">
          <el-cascader v-model="formGroup[node.key]" :options="node.options" :placeholder="node.placeholder || `请选择${node.label}`" :props="{value: node.valueKey || 'id', label: node.labelKey || 'name', children: node.childKey || 'child'}" />
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
    </template>
  </el-form>
</template>
<script lang="ts">
import { PropType, reactive, ref } from 'vue';
import { ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElDatePicker, ElRadioGroup, ElRadio, ElCheckboxGroup, ElCheckbox, ElCascader } from 'element-plus';
import axios from 'axios';
type INodes = PropType<(NInput | NNumber | NBetween | NSelect | NCascader | NDatepicker | NRangepicker)[]>;
export default {
  name: 'cus-form',
  props: {
    nodes: {
      type: Array as INodes,
      default: () => []
    },
    data: {
      type: Object as any,
      default: () => ({})
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  components: { ElForm, ElFormItem, ElInput, ElInputNumber, ElSelect, ElOption, ElDatePicker, ElRadioGroup, ElRadio, ElCheckboxGroup, ElCheckbox, ElCascader },
  setup(props) {
    let formRef = ref();

    let reducer = props.nodes.reduce((collect, node) => {
      if (node.type === 'between') {
        collect.formGroup[node.keys[0]] = props.data[node.keys[0]];
        collect.formGroup[node.keys[1]] = props.data[node.keys[1]];
      } else {
        collect.formGroup[node.key] = props.data[node.key] || node.default;
      }
      if (node.type === 'select' && node.url) {
        axios.post(node.url).then((res: any) => {
          node.options = [...res.json, ...(node.options || [])];
        });
      }
      if (node.type === 'cascader' && node.url) {
        axios.post(node.url).then((res: any) => {
          node.options = res.json;
        });
      }
      if (node.rule && node.key) {
        collect.rules[node.key] = node.rule
      }
      return collect;
    }, { formGroup: {}, rules: {} })

    let formGroup = reactive(reducer.formGroup);
    let rules = reactive(reducer.rules)
    
    const validate = (fn) => {
      formRef.value.validate(valid => valid ? fn(formGroup) : fn(false));
    }

    const save = (resolve, reject) => {
      formRef.value.validate(valid => {
        valid ? resolve(valid) : reject()
      })
    }
    return { formRef, formGroup, rules, validate, save }
  }
}


interface NPublic {
  readonly key?: string;
  readonly label: string;
  readonly default?: any;
  readonly placeholder?: string;
  readonly rule?: any;
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
interface NCascader extends NPublic {
  readonly type: 'cascader';
  readonly key: string;
  readonly url?: string;
  readonly multiple?: boolean;
  options?: any[]
  readonly labelKey?: string;
  readonly valueKey?: string;
  readonly childKey?: string;
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
.cus__form__container {
  .el-select,
  :deep(.el-cascader) {
    width: 100%;
  }
  .el-input-group {
    display: flex;
    .el-input-group__prepend,
    .el-input-group__append,
    & > input {
      display: block;
    }
    & > input {
      width: 40px;
      border-left: 0;
      border-right: 0;
      pointer-events: none;
    }
    .el-input-group__prepend,
    .el-input-group__append {
      flex: 1;
      padding: 0;
      border-width: 0;
    }
    .el-input-group__prepend input {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      text-align: left;
    }
    .el-input-group__append input {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      text-align: left;
    }
  }
}
</style>