
<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="query('dataType', $event)" @search="query('title', $event)" @add-success="contentRef.request()" />
  </template>
  <div class="question-container">
    <div class="left-tree">
      <div class="tabs">
        <div class="tabs_cell" 
          v-for="t in treeTypeList" :key="t.value" 
          :class="{ 'is__checked': treeType === t.value }" 
          @click="setTreeType(t.value)"
        >{{ t.label }}</div>
      </div>
      <div class="content">
        <div v-show="treeType === 1">
          <KnowledgeTree :auto-get-subject="isSelected" ref="knowledgeRef" @check-change="query('knowledgePoints', $event)" />
        </div>
        <div v-show="treeType === 2">
          <ChapterTreeComponent :auto-get-subject="isSelected" ref="chapterRef" @check-node-change="chapterChange" />
        </div>
      </div>
    </div>
    <div class="section-main">
      <div>
        <div class="query-condition">
          <div data-before="省/市/区">
            <el-cascader placeholder="请选择省市区" clearable v-model="params.questionSource.address"
              :props="{ lazy: true, lazyLoad: getProvinceCity, label: 'name', value: 'id', checkStrictly: true }"
              @change="getSchoolList($event, s); query('*', {})"
            />
          </div>
          <div data-before="校区">
            <el-select placeholder="请选择校区" clearable filterable multiple collapse-tags v-model="params.questionSource.publicSchoolIds" @change="query('*', {})">
              <el-option v-for="option in schoolList" :key="option.id" :value="option.id" :label="option.name" />
            </el-select>
          </div>
        </div>
        <cus-condition :auto-get-subject="isSelected" :node-list="[
          { label: '标题', key: 'title', type: 'input' },
          { label: '题型', key: 'types', multiple: true },
          { label: '难度', key: 'difficults', multiple: true },
          { label: '年级', key: 'gradeIds', multiple: true },
          { label: '年份', key: 'years', hide: true, multiple: true },
          { label: '题类', key: 'categorys', hide: true, multiple: true },
          { label: '来源', key: 'dictSourceIds', hide: true, multiple: true },
          { label: '知识点', key: 'knowledgePointBind', hide: true },
        ]" @submit="query('*', $event)" />
      </div>

      <ContentComponent ref="contentRef" :is-selected="isSelected" :disabled-list="disabledList" :on-check-change="onCheckChange" />
    </div>
  </div>
</template>
<script lang="ts">
import { ref, reactive, onMounted } from 'vue';
import HeaderRefComponent from './components/header-ref.vue';
import ContentComponent from './components/content.vue';
import KnowledgeTree from '/@/views/common/knowledge-tree.vue';
import ChapterTreeComponent from '/@/views/common/chapter-tree.vue';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import $, { useState, emitter } from '$';

export default {
  props: {
    isSelected: {         // true => 选择试题页面  fale => 题库首页
      type: Boolean,
      default: () => false
    },
    disabledList: {
      type: Array,
      default: () => []
    }
  },
  components: { HeaderRefComponent, KnowledgeTree, ContentComponent, ChapterTreeComponent },
  emits: ['check-change'],
  setup(props, { emit }) {

    let headerRef = ref();
    let contentRef = ref();

    onMounted(() => {
      !props.isSelected && emitter.emit('slot', headerRef);
      props.isSelected ? query('subject', $.storage.get<any>('subject').code) : emitter.emit('effect', (id) => { query('subject', id) });
    });

    let params: any = reactive({
      dataType: 2,
      questionSource: {
        address: [],
        publicSchoolIds: []
      },
    });

    const query = (key, val) => { 
      key === '*' ? (params = { ...params, ...val }) : (params[key] = val.value || val);
      params.questionSource.provinceId = params.questionSource.address ? params.questionSource.address[0] : null;
      params.questionSource.cityId = params.questionSource.address ? params.questionSource.address[1] : null;
      params.questionSource.areaId = params.questionSource.address ? params.questionSource.address[2] : null;
      contentRef.value.request(params); 
    }

    const getProvinceCity = async ({ data }, resolve) => {
      let res = await axios.post<null, AxResponse>('/system/area/queryByParentId', { parentId: data.id ? data.id : null });
      resolve(res.json);
    }

    let schoolList = ref([])
    const getSchoolList = async (e) => {
      if (e && e[2]) {
        let res = await axios.post<null, AxResponse>('/admin/publicSchool/queryAll', { areaId: e[2] });
        schoolList.value = res.json;
      } else {
        schoolList.value = [];
        params.questionSource.publicSchoolIds = null;
      }
    }

    let knowledgeRef = ref();
    let chapterRef = ref();
    const treeTypeChange = (val) => {
      let knowledgeTreeRef = knowledgeRef.value.treeRef;
      let chapterTreeRef = chapterRef.value.treeRef
      if (val === 1) {
        let nodes = chapterTreeRef.getCheckedNodes().filter(i => !i.childs || !i.childs.length);
        let keys = nodes.reduce((arr, node) => { if (node.knowledgePointFlag) { arr.push(node); } return arr }, []).map(i => i.id);
        keys.length && knowledgeTreeRef.setCheckedKeys([...keys, ...(params.knowledgePoints || [])]);
      } else {
        let keys = knowledgeTreeRef.getCheckedNodes().filter(i => !i.childs || !i.childs.length).map(i => i.id);
        keys.length && chapterTreeRef.setCheckedKeys(keys);
      }
    }

    const chapterChange = (nodes) => {
      let group = nodes.reduce((group, node) => {
        group[node.knowledgePointFlag ? 'knowledgePoints' : 'chapters'].push(node.id);
        return group;
      }, { knowledgePoints: params.knowledgePoints || [], chapters: [] });
      contentRef.value.request({...params, ...group}); 
    }

    let [ treeType, setTreeType ] = useState(1, treeTypeChange);
    let treeTypeList = [{ label: '知识点', value: 1 }, { label: '章节', value: 2 }];

    const onCheckChange = (list) => emit('check-change', list);

    return { headerRef, params, contentRef, query, getProvinceCity, getSchoolList, schoolList, treeType, setTreeType, treeTypeList, knowledgeRef, chapterRef, chapterChange, onCheckChange }
  }
}
</script>

<style lang="scss" scoped>
.question-container {
  display: flex;
  &, & > div {
    height: 100%;
    overflow: auto;
  }
  .query-condition {
    display: flex;
    margin-bottom: 10px;
    & > div {
      display: flex;
      margin-right: 15px;
      :deep(.el-input__inner) {
        border-radius: 0 4px 4px 0 !important;
      }
      & > :deep(div) {
        width: 240px;
      }
      &:hover {
        &::before, 
        :deep(.el-input__inner) {
          border-color: #C0C4CC;
        }
      }
      &::before {
        content: attr(data-before);
        display: block;
        height: 40px;
        padding: 0 15px;
        line-height: 38px;
        white-space: nowrap;
        border-radius: 4px 0px 0px 4px;
        border: 1px solid #DCDFE6;
        border-right: 0;
        background: #FFF4DF;
        box-sizing: border-box;
        z-index: 1;
        transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }

  }
}
.left-tree {
  display: flex;
  flex-direction: column;
  width: 250px;
  margin-right: 20px;
  background: #fff;
  border-radius: 6px;
  .tabs {
    display: flex;
    height: 42px;
    margin-bottom: 10px;
    & > div {
      flex: 1;
      color: #77808D;
      line-height: 42px;
      text-align: center;
      cursor: pointer;
      &.is__checked {
        color: #fff;
        background: #1AAFA7;
      }
    }
  }
  .content {
    flex: 1 1 42px;
    padding: 0 12px 12px;
    overflow: hidden;
    & > div {
      height: 100%;
      overflow: auto;
    }
  }
}
.section-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 250px;
  height: 100%;
  overflow: auto;
}
</style>