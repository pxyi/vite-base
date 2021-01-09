<template>
  <cus-form ref="formRef" :nodes="nodes" :width="files ? '422px' : '500px'" />

  <div class="paper-mode">
    <span>组卷方式</span>
    <div class="mode-radio-group">
      <div class="r-g-radio" v-for="t in paperTypeList" :key="t.value" :class="{ 'active': paperType === t.value }" @click="paperType = t.value">
        <i class="el-icon-check" />
        <h4>{{ t.h4 }}</h4>
        <p>{{ t.p }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, PropType, onMounted, inject } from 'vue';
import { AxResponse } from './../../../core/axios';
import axios from 'axios';
import { useStore } from 'vuex';
import Drawer from './../../../utils/drawer';
import Screen from './../../../utils/screen';
import SelectedTopicComponent from './selected-topic.vue';
import GeneratingComponent from './generating.vue';

export default {
  props: {
    files: Array as PropType<File[]>,
  },
  setup(props) {
    let store = useStore();
    let formRef = ref();

    let userId = store.getters.userInfo.user.id;
    let subjectCode = store.getters.subject.code;

    let paperType = ref(0);
    let paperTypeList = [
      { h4: '智能选题', p: '根据指定学科知识点，题目情况智能生成试卷结构和题目，支持手动调整', value: 0 },
      { h4: '手动选题', p: '根据个性化需求，手动添加试卷结构并完成选题', value: 1 }
    ];

    let subjectDefault = [store.getters.subject.parentCode, store.getters.subject.code];
    let nodes: Ref<any[]> = ref([
      {
        label: "试卷名称",
        key: "title",
        type: "input",
        rule: { required: true, message: "请输入试卷名称" },
      },
      {
        label: "学科",
        key: "subjectId", 
        type: "cascader",
        url: "/permission/user/userDataSubjects",
        params: { userId },
        default: subjectDefault,
        rule: { required: true, message: "请选择学科" },
        valueKey: 'code',
        change: (v) => subjectChange(v)
      },
      {
        label: "年级",
        key: "gradeId", 
        type: "select",
        options: [],
        rule: { required: true, message: "请选择年级" },
      },
      {
        label: "年份",
        key: "year",
        type: "select",
        options: [],
        rule: { required: true, message: "请选择年份" },
      },
      {
        label: "来源",
        key: "source",
        type: "select",
        options: [],
        rule: { required: true, message: "请选择来源" },
      },
      { 
        label: '共享范围', 
        key: 'isPublic', 
        type: 'radio', 
        default: 0, 
        options: [ { name: '我的试卷', id: 0 },{ name: '公共试卷', id: 1 } ] 
      }
    ]);

    axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'QUES_SOURCE' }).then(res => nodes.value[4].options = res.json['QUES_SOURCE']);

    let subjectChange = (val) => {
      axios.post('/permission/user/userDataRules', { userId, subjectCode: val[1] }).then((res: any) => {
        nodes.value[2].options = res.json.grades;
        nodes.value[3].options = res.json.years;
        formRef.value.formGroup.gradeId && (formRef.value.formGroup.gradeId = null);
        formRef.value.formGroup.year && (formRef.value.formGroup.year = null);
      })
    }
    subjectChange(subjectDefault);

    const save = (resolve, reject) => {
      formRef.value.validate(valid => {
        if (valid) {
          let data = {
            ...valid,
            paperType: paperType.value,
            subjectId: valid.subjectId[1]
          }
          if (paperType.value === 0) {
            Screen.create(GeneratingComponent, { data });
            resolve()
          } else {
            Drawer.create({ 
              title: '选择试题',
              closable: false,
              width: 'calc(100% - 200px)',
              component: SelectedTopicComponent,
              props: { data }
            }).then(res => resolve() ).catch(err => reject());
          }
        } else {
          reject();
        }
      });
    };

    return { nodes, save, formRef, paperType, paperTypeList };
  },
};
</script>
<style lang="scss" scoped>
:deep(.el-upload) {
  width: 100%;
  .el-upload-dragger {
    width: 100%;
    height: 160px;
    background: none;
  }
}
.file-upload-content {
  padding: 20px 70px;
  background: #ebf0fc;
  border: 1px solid #ebf0fc;
  border-radius: 4px;
}
.upload-content {
  i {
    margin-top: 24px;
    color: #1aafa7;
  }
  div {
    color: #1a2633;
    margin-bottom: 8px;
    span {
      color: #1aafa7;
    }
  }
  p {
    color: #999;
    font-size: 12px;
  }
}
.paper-mode {
  display: flex;
  margin-bottom: 22px;
  span {
    width: 80px;
    display: block;
    text-align: right;
    color: rgb(96, 98, 102);
    line-height: 40px;
    padding: 0px 12px 0px 0px;
    white-space: nowrap;
    &::before {
      content: "*";
      color: rgb(245, 108, 108);
      margin-right: 4px;
    }
  }
  .mode-radio-group {
    flex: auto;
    display: flex;
    .r-g-radio {
      flex: 1;
      padding: 25px;
      height: 140px;
      border-radius: 6px;
      border-width: 3px;
      border-style: solid;
      cursor: pointer;
      position: relative;
      transition: all 0.1s ease;
      i {
        color: #fff;
        font-size: 16px;
        position: absolute;
        top: 5px;
        right: 3px;
        opacity: 0;
        transition: all 0.1s ease;
      }
      &.active::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-width: 20px;
        border-style: solid;
        border-bottom-color: rgba($color: #000000, $alpha: 0);
        border-left-color: rgba($color: #000000, $alpha: 0);
        position: absolute;
        top: 0;
        right: 0;
        opacity: 0;
        transition: all 0.1s ease;
      }
      &.active {
        i,
        &::before {
          opacity: 1;
        }
      }
      &:first-child {
        margin-right: 20px;
        border-color: rgba(255, 132, 33, 0.1);
        background: rgba(255, 132, 33, 0.1);
        &.active {
          border-color: rgba(255, 132, 33, 1);
          &::before {
            display: block;
            border-top-color: #ff8421;
            border-right-color: #ff8421;
          }
        }
      }
      &:last-child {
        border-color: rgba(69, 90, 247, 0.1);
        background: rgba(69, 90, 247, 0.1);
        &.active {
          border-color: rgba(69, 90, 247, 1);
          &::before {
            display: block;
            border-top-color: #455af7;
            border-right-color: #455af7;
          }
        }
      }
      h4 {
        font-size: 16px;
        line-height: 22px;
        margin-bottom: 10px;
      }
      p {
        color: #77808d;
      }
    }
  }
}
</style>
