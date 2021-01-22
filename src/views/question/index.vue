
<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="query('dataType', $event)" @search="query('title', $event)" @add-success="contentRef.request()" />
  </template>
  <div class="question-container">
    <div class="knowledge-tree">
      <KnowledgeTree @check-change="query('knowledgePoints', $event)" />
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
        <cus-condition :node-list="[
          { label: '题型', key: 'types', multiple: true },
          { label: '难度', key: 'difficults', multiple: true },
          { label: '年级', key: 'gradeIds', multiple: true },
          { label: '年份', key: 'years', hide: true, multiple: true },
          { label: '题类', key: 'categorys', hide: true, multiple: true },
          { label: '来源', key: 'dictSourceIds', hide: true, multiple: true },
          { label: '知识点', key: 'knowledgePointBind', hide: true },
        ]" @submit="query('*', $event)" />
      </div>

      <ContentComponent ref="contentRef" />
    </div>
  </div>
</template>
<script lang="ts">
import { ref, reactive,toRefs, onMounted, Ref, watch } from 'vue';
import HeaderRefComponent from './components/header-ref.vue';
import ContentComponent from './components/content.vue';
import KnowledgeTree from './components/knowledge-tree.vue';
import emitter from '/@/utils/mitt';
import { useStore } from 'vuex';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';

export default {
  components: { HeaderRefComponent, KnowledgeTree, ContentComponent },
  setup() {
    let store = useStore();
    let headerRef = ref();
    let contentRef = ref();

    onMounted(() => {
      emitter.emit('slot', headerRef)
      emitter.emit('effect', (id) => { query('subject', id) })
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
      }
    }
    return { headerRef, params, contentRef, query, getProvinceCity, getSchoolList, schoolList }
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
.knowledge-tree {
  width: 250px;
  padding: 12px;
  margin-right: 20px;
  background: #fff;
  border-radius: 6px;
}
.section-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 250px;
  height: 100%;
  overflow: auto;
}
</style>