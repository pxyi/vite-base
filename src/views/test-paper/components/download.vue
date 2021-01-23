<template>
  <div>
    <div class="controls">
      <div class="radio-group">
        <div class="radio-cell"
          :class="{ 'is__checked': formGroup.type === cell.value }"
          v-for="cell in versionList"
          :key="cell.value"
          @click="formGroup.type = cell.value"
        >
          <span>{{ cell.label }}</span>
          <i class="el-icon-check" />
        </div>
      </div>
    </div>
    <div class="controls">
      <div class="label">试卷模板</div>
      <div class="radio-group">
        <div class="radio-cell"
          :class="{ 'is__checked': formGroup.templateId === cell.id }"
          v-for="cell in templateList"
          :key="cell.id"
          @click="formGroup.templateId = cell.id"
        >
          <span>{{ cell.name }}</span>
          <i class="el-icon-check" />
        </div>
      </div>
    </div>
    <div class="controls">
      <div class="label">试卷格式</div>
      <div class="radio-group">
        <div class="radio-cell" :class="{ 'is__checked': formGroup.format === 1 }" v-permissions="'download'" @click="formGroup.format = 1" >
          <span>Word</span>
          <i class="el-icon-check" />
        </div>
        <div class="radio-cell" :class="{ 'is__checked': formGroup.format === 2 }" v-permissions="'print'" @click="formGroup.format = 2" >
          <span>PDF</span>
          <i class="el-icon-check" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref, reactive } from 'vue';
import axios from 'axios';
import { useStore } from 'vuex';
type IAny = any[];

export default {
  props: ['subjectId'],
  setup(props) {
    let store = useStore();
    let versionList = [{ label: '学生版(没答案解析)', value: 2 }, { label: '教师版(有答案解析)', value: 1 }, { label: '解析版(只有答案解析)', value: 3 }];
    let templateList: Ref<IAny> = ref([]);
    let subjectCode = store.getters.subject.code || props.subjectId;


    let [allowPath, isAdmin] = store.getters.userInfo.roles.reduce((group, role) => {
        group[0] += role.menuUrls;
        group[1] = group[1] || !!role.isAdmin;
        return group;
      }, ['', false]);
    let formGroup = reactive({
      type: 2,
      templateId: null,
      format: isAdmin || allowPath.includes('/test-paper#download') ? 1 : 2
    })
    axios.post<null, { json: IAny }>('/system/paperTemplate/queryBySubjectCode', { subjectCode }).then(res => {
      templateList.value = res.json;
      formGroup.templateId = res.json[0].id;
    });

    return { versionList, templateList, formGroup, save: (resolve) => resolve(formGroup) }
  }
}
</script>

<style lang="scss" scoped>
.label {
  display: inline-block;
  padding: 0 20px 0 10px;
  margin-bottom: 20px;
  height: 28px;
  line-height: 28px;
  background: rgba(26, 175, 167, 0.1);
  border-left: solid 2px #1AAFA7;
}
.radio-group {
  display: flex;
  margin-bottom: 30px;
  .radio-cell {
    height: 42px;
    padding: 0 20px;
    line-height: 40px;
    border-radius: 3px;
    border: 1px solid #DCDFE6;
    transition: all .25s;
    position: relative;
    user-select: none;
    cursor: pointer;
    &.is__checked,
    &:hover {
      color: #1AAFA7;
      border-color: #1AAFA7;
    }
    i {
      display: block;
      color: #fff;
      height: 20px;
      font-size: 12px;
      line-height: 28px;
      position: absolute;
      right: 0;
      bottom: 0;
      opacity: 0;
      z-index: 2;
    }
    &::after {
      display: block;
      content: '';
      width: 0;
      height: 0;
      border: solid 10px rgba($color: #000000, $alpha: 0);
      border-right-color: #1AAFA7;
      border-bottom-color: #1AAFA7;
      position: absolute;
      right: 0;
      bottom: 0;
      opacity: 0;
      z-index: 1;
    }
    &.is__checked i,
    &.is__checked::after {
      opacity: 1;
    }
    &:not(:first-child) {
      margin-left: 20px;
    }
  }
}
</style>
