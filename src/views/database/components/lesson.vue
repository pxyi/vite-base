<template>
  <el-form :model="formGroup" :rules="{ dataset: {required: true, message: '请选择数据'} }" ref="formRef" class="lesson-container">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item prop="courseTypeId">
          <el-select placeholder="请选择班型" v-model="formGroup.courseTypeId" clearable @change="handle" v-if="selectMap.courseTypes.length">
            <el-option v-for="o in selectMap.courseTypes" :key="o.id" :label="o.name" :value="o.id" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item prop="gradeId">
          <el-select placeholder="请选择年级" v-model="formGroup.grades" clearable @change="handle" v-if="selectMap.grades.length">
            <el-option v-for="o in selectMap.grades" :key="o.id" :label="o.name" :value="o.id" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item prop="dataset">
      <el-cascader collapse-tags clearable placeholder="请选择数据" :show-all-levels="false" v-if="selectMap.cascaderOptions.length"
        v-model="formGroup.dataset" 
        :options="selectMap.cascaderOptions" 
        :props="{ children: 'courseIndexList', label: 'courseName', value: 'id', multiple: true, emitPath: false }" 
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus';
export default {
  props: { id: String },
  setup(props) {
    let store = useStore();
    let formRef = ref();
    let formGroup = reactive({
      courseTypeId: null,
      gradeId: null,
      dataset: []
    });
    let selectMap = reactive({
      courseTypes: [],
      grades: [],
      cascaderOptions: []
    })
    axios.post<null, any>('/permission/user/userDataRules', { userId: store.getters.userInfo.user.id, subjectCode: store.getters.subject.code }).then(res => {
      selectMap.courseTypes = res.json.courseTypes;
      selectMap.grades = res.json.grades;
    })

    const handle = async () => {
      let { courseTypeId, gradeId } = formGroup;
      let res = await axios.post<null, { json }>('/course/query', { subjectId: store.getters.subject.code, materialId: props.id, courseTypeId, gradeId });
      let data = res.json.map(i => { i.courseIndexList = i.courseIndexList.map(a => { a.courseName = a.courseIndexName; return a }); return i; })
      selectMap.cascaderOptions = data;
    }
    handle();

    const save = (resolve, reject) => {
      formRef.value.validate(async valid => {
        if (valid) {
          let params = formGroup.dataset.map(i => ({ 
            courseIndexId: i, 
            materialId: props.id, 
            courseId: (selectMap.cascaderOptions.find((c: any) => !!c.courseIndexList.find((a: any) => a.id === i)) as any).id
          }))
          let res: any = await axios.post('/admin/materialCourseIndex/add', params ,{ headers: { 'Content-Type': 'application/json' } });
          ElMessage[res.result ? 'success' : 'warning'](res.result ? '添加到备课成功~!' : res.msg);
          res.result ? resolve() : reject();
        } else {
          reject();
        }
      });
    }

    return { formGroup, selectMap, handle, save, formRef }
    
  }
}
</script>

<style lang="scss" scoped>
.lesson-container {
  :deep(.el-select),
  :deep(.el-cascader) {
    width: 100%;
  }
}
</style>