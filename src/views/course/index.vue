<template>
	<template ref="headerRef">
		<header-ref @searchHandle="params.courseName = $event" @add="openModel( {}, '/course/add')"/>
	</template>
	<div class="course">
		<cus-condition
			:node-list="[
				{label: '年份', key: 'year'},
				{label: '学期', key: 'semesterId'},
				{label: '班型', key: 'courseTypeId'},
				{label: '年级', key: 'gradeId'}]"
			@submit="params = {...$event, ...params};$refs.tableRef.request({...$event, ...params})"
			ref="condition"
		></cus-condition>
		<cus-table :auto-request="false" :default="params" ref="tableRef" url="/course/queryByPageV2">
			<template #default>
				<el-table-column label="课程名称" property="courseName" width="300">
					<template v-slot:default="scope">
						<div class="courseName">
							<div class="img-box">
								<img src="/@/assets/course.png" width="70">
							</div>
							<p>{{scope.row.courseName}}</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="课次数" property="courseIndexNum">
					<template v-slot:default="scope">
						<div class="courseName">
							<p>{{scope.row.courseIndexNum}}讲</p>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="课程分类" property="courseTypeName"></el-table-column>
				<el-table-column label="年级" property="gradeName"></el-table-column>
				<el-table-column label="学期" property="semesterName"></el-table-column>
				<el-table-column label="年份" property="year"></el-table-column>
				<el-table-column label="操作" width="280">
					<template v-slot:default="scope">
						<el-button @click="openModel( scope.row, '/course/modify')" size="mini" type="text">修改</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button size="mini" type="text" @click="knotSet(scope.row)">设置课次</el-button>
						<el-divider direction="vertical"></el-divider>
						<el-button size="mini" type="text" @click="courseDelete(scope.row.id)">删除</el-button>
						<!--					<el-divider direction="vertical"></el-divider>-->
						<!--					<el-button size="mini" type="text">备课流程</el-button>-->
					</template>
				</el-table-column>
			</template>
		</cus-table>
	</div>
</template>

<script lang="ts">
  import {defineComponent, ref, Ref, onMounted} from 'vue'
  import { ElNotification } from 'element-plus'
  import headerRef from './components/header-ref.vue'
  import knot from './components/knot.vue';
  import emitter from '../../utils/mitt';
  import Model from '../../utils/modal/index';
  import screen from '../../utils/screen/index';
  import axios, {AxiosResponse} from "axios";
  import {useStore} from "vuex"

  export default defineComponent({
    components: {headerRef},
    setup(props, ctx) {
      const headerRef = ref(null);
      const tableRef: Ref<any> = ref(null);
      const condition: Ref<any> = ref(null);
      const store = useStore();
      let params = ref<{ [key: string]: any }>({});
      onMounted(() => {
        emitter.emit('slot', headerRef);
        emitter.emit('effect', (id) => {
          params.value.subjectId = id;
          tableRef.value.request(params.value)
        });
      });
      const openModel = (data, url) => {
        Model.create({
          title: `${data.id ? '修改' : '添加'}课程`,
          width: 500,
          props: {
            nodes: [
              {label: '课程名称', type: 'input', key: 'courseName'},
              {
                label: '学科',
                type: 'cascader',
                key: 'subjectId',
                default: store.getters.subject.path.split(','),
                url: '/permission/user/userDataSubjects',
                props: {label: 'name', value: 'code', children: 'child'}
              },
              {label: '年份', type: 'select', key: 'year', options: condition.value.list.yearList},
              {label: '学期', type: 'select', key: 'semesterId', options: condition.value.list.termList},
              {label: '班型', type: 'select', key: 'courseTypeId', options: condition.value.list.courseTypeList},
              {label: '年级', type: 'select', key: 'gradeId', options: condition.value.list.gradeList},
              {label: '设置课次', type: 'number', key: 'courseIndexNum'},
            ],
            rules: {
              courseName: [{required: true, message: '请输入课程名称', trigger: 'blur'}]
            },
            data
          }
        }).then(res => {
          courseModifyOrAdd({...data, ...res, ...{subjectId: res.subjectId[1]}}, url);
        })
      };

      async function courseModifyOrAdd(data, url) {
        const res: Promise = await axios.post<any, AxiosResponse>(url, data, {headers: {'Content-Type': 'application/json;charset=UTF-8'}});
        res.result && ElNotification.success({title: '成功', message: res.msg}) && tableRef.value.request(params.value)
      }
      const courseDelete = (id) => axios.post('/course/delete', {id}).then(res => res.result && ElNotification.success({title: '成功', message: res.msg}) && tableRef.value.request(params.value));

      const knotSet = (data) => { screen.create(knot, { data }) };
      return {headerRef, params, tableRef, openModel, condition, courseDelete, knotSet}
    }
  });
</script>

<style lang="scss" scoped>
	.courseName {
		display: flex;
		align-items: center;

		.img-box {
			margin-right: 15px;
		}
	}

	.course .cus__table__container {
		padding: 0 10px;
	}
</style>
