<template>
<cus-skeleton :loading="loading">
  <div class="source-box" v-for="(s, idx) in questionSources" :key="s">
    <div class="source-label">来源{{ idx + 1 }}</div>
    <div class="source-main">
      <div class="source-cell">
        <div class="source-control">
          <el-select size="medium" clearable placeholder="选择年份" v-model="s.year" v-if="yearList.length">
            <el-option v-for="o in yearList" :key="o.id" :value="o.id" :label="o.name" />
          </el-select>
        </div>
        <div class="source-control">
          <el-cascader placeholder="选择省市区" clearable size="medium"
            v-model="s.provinceCity"
            :props="{ lazy: true, lazyLoad: getProvinceCity, label: 'name', value: 'id' }"
            @change="getSchoolList($event, s)"
          />
        </div>
      </div>
      <div class="source-cell">
        <div class="source-control">
          <el-select placeholder="试卷类型" clearable size="medium" v-model="s.dictSourceId"  v-if="quesList.length">
            <el-option v-for="option in quesList" :key="option.id" :value="option.id" :label="option.name" />
          </el-select>
        </div>
        <div class="source-control">
          <el-select placeholder="选择学校" clearable size="medium" v-model="s.publicSchoolId" >
            <el-option v-for="option in s.schoolList" :key="option.id" :value="option.id" :label="option.name" />
          </el-select>
        </div>
      </div>
    </div>
    <div class="source-delete-btn" @click="questionSources.splice(idx, 1)">删除</div>
  </div>

  <div class="add-source-btn" @click="addSource"><i class="el-icon-circle-plus" /><span>添加来源</span></div>
</cus-skeleton>
</template>

<script lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../../../core/axios';

export default {
  props: ['loading'],
  setup() {
    let questionSources = ref([
      {
        year: null,
        dictSourceId: null,
        provinceCity: null,
        publicSchoolId: null
      }
    ]);

    let yearList = ref([]);
    let quesList = ref([]);
    axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'YEAR,QUES_SOURCE' }).then(res => {
      yearList.value = res.json.YEAR;
      quesList.value = res.json.QUES_SOURCE;
    });

    const getProvinceCity = async ({ data }, resolve) => {
      let res = await axios.post<null, AxResponse>('/system/area/queryByParentId', { parentId: data.id ? data.id : null });
      resolve(res.json);
    }

    const getSchoolList = async (e, source) => {
      if (e && e.length) {
        questionSources.value.map((item) => {
          item.publicSchoolId = null
        })
        let res = await axios.post<null, AxResponse>('/admin/publicSchool/queryAll', { areaId: e[2] });
        source.schoolList = res.json;
      } else {
        source.schoolList = [];
      }
    }

    const addSource = () => {
      questionSources.value.push({
        year: null,
        dictSourceId: null,
        provinceCity: null,
        publicSchoolId: null
      })
    }

    return { questionSources, yearList, quesList, getProvinceCity, getSchoolList, addSource }
  }
}
</script>

<style lang="scss" scoped>
  .source-box {
    display: flex;
    padding: 10px;
    background: rgba(26, 175, 167, 0.1);
    border-radius: 6px;
    margin-bottom: 10px;
    .source-label {
      margin-right: 12px;
      color: #1AAFA7;
      line-height: 36px;
    }
    .source-main {
      flex: auto;
      .source-cell {
        display: flex;
        margin-bottom: 12px;
        .source-control {
          &:first-child {
            width: 130px;
            margin-right: 20px;
          }
          &:last-child {
            flex: 1 1 130px;
            & > div {
              width: 100%;
            }
          }
        }
      }
    }
    &:hover .source-delete-btn {
      width: 20px;
    }
    .source-delete-btn {
      width: 0;
      height: 116px;
      padding-top: 24px;
      margin: -10px -10px -22px 10px;
      color: #fff;
      line-height: 30px;
      text-align: center;
      background: rgb(25 174 166);
      border-radius: 0 6px 6px 0;
      cursor: pointer;
      overflow: hidden;
      transition: all .25s;
    }
  }
  .add-source-btn {
    height: 36px;
    color: #1AAFA7;
    line-height: 36px;
    text-align: center;
    background: #DFEFF0;
    border-radius: 6px;
    border: 1px dashed #1AAFA7;
    cursor: pointer;
    &:active {
      opacity: .7;
    }
  }
</style>
