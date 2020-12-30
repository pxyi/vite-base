<template>
	<div class="check-header">
		<div class="select">
			<el-select @change="schoolChange" v-model="schoolMsg" clearable filterable placeholder="输入校区名称搜索">
				<el-option v-for="item in schoolOptions" :key="item.id" :label="item.schoolName" :value="item.id"></el-option>
			</el-select>
			<el-select @change="researchChange" v-model="researchMsg" clearable filterable placeholder="输入教研组搜索">
				<el-option
					v-for="item in researchOptions"
					:key="item.id"
					:label="item.name"
					:value="item.id">
				</el-option>
			</el-select>
		</div>
		<ul class="statistics">
			<li>
				<span>备课统计</span>
				<el-tooltip content="统计最近30天教师备课的所有得分的算数平均数" placement="bottom" effect="light">
					<el-button>？</el-button>
				</el-tooltip>
			</li>
			<li>
				<p>备课平均分</p>
				<p>{{prepareLessonAvgScore}}分</p>
			</li>
			<li>
				<p>教案上传率</p>
				<p>{{uploadTeachPlanRate}}%</p>
			</li>
			<li>
				<p>还课视频上传率</p>
				<p>{{uploadReviewVideoRate}}%</p>
			</li>
		</ul>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		name: "checkHeader",
		data () {
		  return {
        schoolMsg: '',
        schoolOptions: [{}],
        researchMsg: '',
        researchOptions: [{}],
        prepareLessonAvgScore: 0,
        uploadReviewVideoRate: 0,
        uploadTeachPlanRate: 0,
		  }
		},
		methods: {
		  async getSchoolData(schoolName) {
				const res = await axios.post('/permission/user/querySchoolByUserId', {current: 1, size: 2000, schoolName, userId: this.$store.state.user.userInfo.user.id});
				if (res.result && res.json.length) {
					this.schoolOptions = res.json;
					console.log(this.schoolOptions)
				};
		  },
			async getGroupData(groupName) {
		    const res = await axios.post('/permission/user/queryUserGroupByUserId', {groupName, userId: this.$store.state.user.userInfo.user.id});
				res.result &&  res.json && res.json.length ? this.researchOptions = res.json : false;
			},
      getAnalysisData(schoolId, groupId) {
        axios.post('/admin/prepareLesson/queryPrepareLessonAnalysis', {schoolId, groupId}).then(res => {
					Object.keys(res.json).forEach(item => this[item] = res.json[item])
        })
      },
      schoolChange(val) {
		    this.getAnalysisData(this.schoolMsg, this.researchMsg)
		    this.$emit('schoolChange', val);
      },
      researchChange(val) {
        this.getAnalysisData(this.schoolMsg, this.researchMsg)
        this.$emit('researchChange', val);
      }
		},
		mounted() {
      this.getAnalysisData(this.schoolMsg, this.researchMsg)
      this.getSchoolData();
		  this.getGroupData();
    }
  }
</script>
