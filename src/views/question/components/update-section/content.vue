<template>
<cus-skeleton :loading="loading">
  <div class="content">
    <div class="section">
      <div class="label">题干</div>
      <div class="title" @click="log">这里填写题目描述</div>
      <cus-editor min-height="80px" v-model="formGroup.title" placeholder="请输入题干"></cus-editor>
      <div class="tip" v-if="valid && !formGroup.title">请输入题目描述！</div>
    </div>
    <div class="section" v-if="baseType < 4">
      <div class="label">{{ baseType === 3 ? '答案' : '选项' }}</div>
      <div class="title">单/多选题、填空题的选项范围从 2 到 20 </div>
      <div class="group">
        <ul>
          <li 
            v-for="(node, idx) in options" 
            :key="node"
            :data-index="baseType === 3 ? node.no : numberToLetter(node.no)" 
          >
            <div class="check" v-if="baseType === 1"><el-radio v-model="node.checked" :label="true" @change="radioChange(node.no)"></el-radio></div>
            <div class="check" v-if="baseType === 2"><el-checkbox v-model="node.checked"></el-checkbox></div>
            <cus-editor v-model="node.content" />
            <div class="tip" v-if="valid && !node.content">请输入题目描述！</div>
            <i class="el-icon-close" v-if="options.length > 2" @click="deleteOption(idx)" />
          </li>
          <li v-show="options.length < 20" @click="addOption">
            <el-button icon="el-icon-circle-plus-outline" size="medium" round type="primary">添加一个选项</el-button>
          </li>
        </ul>
      </div>
    </div>
    <div class="section" v-else-if="baseType === 4">
      <div class="label">答案</div>
      <div class="title">选择正确或者错误（默认正确）</div>
      <el-radio-group v-model="answer">
        <el-radio border label="正确">正确</el-radio>
        <el-radio border label="错误">错误</el-radio>
      </el-radio-group>
    </div>
    <div class="section" v-else>
      <div class="label">答案</div>
      <div class="title">这里填写题目答案</div>
      <cus-editor min-height="80px" v-model="answer" />
    </div>
    <div class="section">
      <div class="label">解析</div>
      <div class="title">这里填写该问题对应的答案解释</div>
      <cus-editor min-height="80px" v-model="formGroup.analysis" />
    </div>
  </div>
</cus-skeleton>
</template>

<script lang="ts">
import { ref, Ref, unref, reactive, getCurrentInstance } from 'vue';
import { cloneDeep } from 'lodash';
import { ElMessage } from 'element-plus';

export default {
  props: ['loading'],
  setup() {
    let formGroup = reactive({
      title: null,
      analysis: null
    });

    let answer: Ref<string | null> = ref(null)      // 答案


    let valid = ref(false);
    const validator = () => {
      valid.value = true;
      if (!formGroup.title) { return false };
      if (baseType.value < 4 && options.value.some(i => !i.content)) { return false }
      if ( 
        baseType.value === 1 && options.value.every(i => !i.checked) || 
        baseType.value === 2 && !options.value.some(i => i.checked)
      ) { ElMessage.warning('请选择答案'); return false }
      let result: any = { 
        title: formGroup.title,
        analysis: formGroup.analysis,
        baseType: unref(baseType)
      };
      if (baseType.value < 3) { 
        result.option = unref(options);
        result.rightAnswer = options.value.filter(i => i.checked);
      } else if (baseType.value === 3) {
        result.rightAnswer = unref(options);
      } else {
        result.rightAnswer = [ { content: unref(answer) } ];
      }
      return result;
    }

     // 1：单选题/选择题 2：多选题 3：填空题 4：判断题
    let baseType = ref(3);

    let options = ref([
      { no: 1, content: null, checked: false },
      { no: 2, content: null, checked: false },
      { no: 3, content: null, checked: false },
      { no: 4, content: null, checked: false }
    ]);

    const questionTypeChange = (question) => {
      baseType.value = question.toolQuestionType;
      formGroup.title = null;
      formGroup.analysis = null;
      answer.value = null;
      if (baseType.value === 4) { answer.value = '正确' }
      if (baseType.value === 1 || baseType.value === 3) {
        options.value = [];
        for (let no = 1; no <= 4; no++) { options.value.push( { no, content: null, checked: false } ) }
      }
    }

    const numberToLetter = (n: number) => String.fromCharCode(n + 64);

    const radioChange = (no) => options.value.map(n => n.no !== no && (n.checked = false));

    const addOption = () => options.value.push({ no: options.value.length + 1, content: null, checked: false });

    const deleteOption = (idx) => { options.value.splice(idx, 1); options.value.map((n, idx) => n.no = idx + 1); }
    
    return { formGroup, valid, validator, questionTypeChange, baseType, answer, options, numberToLetter, radioChange, addOption, deleteOption, log: () => console.log(formGroup) }
  }
}
</script>

<style lang="scss" scope>
.content {
  .section {
    padding: 0 32px 0 60px;
    margin-bottom: 40px;
    position: relative;
    .tip {
      color: #f56c6c;
      font-size: 12px;
      line-height: 15px;
      position: absolute;
      bottom: 0;
      left: 60px;
      margin-bottom: -20px;
    }
    .label {
      padding: 0 14px;
      color: #fff;
      font-size: 12px;
      line-height: 26px;
      background: #FAAD14;
      border-radius: 6px;
      position: absolute;
      top: 0;
      left: 0;
    }
    .title {
      margin-bottom: 15px;
      color: #333;
      font-size: 12px;
      line-height: 26px;
      text-indent: 4px;
    }
    .group {
      li {
        position: relative;
        &:not(:last-child) {
          margin-bottom: 15px;
        }
        &::before {
          content: attr(data-index);
          display: block;
          width: 18px;
          color: #77808D;
          line-height: 40px;
          position: absolute;
          top: 0;
          left: 0;
          transform: translateX(-100%);
        }
        button {
          width: 100%;
        }
        i.el-icon-close {
          display: block;
          width: 18px;
          height: 18px;
          color: #fff;
          line-height: 18px;
          text-align: center;
          background: #A9B3BF;
          border-radius: 2px;
          position: absolute;
          top: 11px;
          right: 0;
          margin-right: -26px;
          cursor: pointer;
          &:active {
            transform: scale(.95);
          }
        }
        .tip {
          left: 0;
          margin-bottom: -15px;
        }
        .check {
          width: 20px;
          line-height: 40px;
          position: absolute;
          top: 0;
          left: 0;
          margin-left: -42px;
          overflow: hidden;
        }
      }
    }
  }
}
</style>