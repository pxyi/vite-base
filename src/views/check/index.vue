<template>
	<template>
		<header-ref ref="headerRef"></header-ref>
	</template>
	<div class="check-container">
		<check-header @schoolChange="schoolChange" @researchChange="researchChange"></check-header>
		<div class="check-body">
			<div class="left">
				<div class="title-search">
					<p class="title-box" :style="{'display': active ? 'none' : 'block'}"><span>教师排名</span><span style="font-size: 13px">(共{{teacherList.length}}位)</span></p>
					<p class="search-box" @click.stop="active = true" :class="{'active': active}"><el-input placeholder="按教师搜索" @blur=" teacherName == '' ? active = false : active = true" size="small" prefix-icon="el-icon-search" v-model="teacherName"></el-input></p>
				</div>
				<div class="tip">
					<div>教师名称</div>
					<div>备课平均分
						<el-tooltip content="统计最近30天教师备课的所有得分的算数平均数" placement="bottom" effect="light">
						<el-button>？</el-button>
					</el-tooltip></div>
				</div>
				<ul class="teach-box" v-loading="filterTeacher.length > 0 ? false : true">
					<li class="teacher-item" :class="{'teacher-item-active': item.id === this.currentTeacher?.id}" @click="selectTeacher(item)" v-for="item in filterTeacher" :key="item.id">
						<span>{{item.nickname}}</span>
						<span style="font-weight: 500">{{item.prepareLessonAvgScore == 100000 ? '---' : item.prepareLessonAvgScore}} 分</span>
					</li>
				</ul>
			</div>
			<div class="right">
				<div class="right-top">
					<el-radio-group size="small" v-model="lessonParam.checkStatus">
						<el-radio-button label="1">待审核</el-radio-button>
						<el-radio-button label="2">已审核</el-radio-button>
						<el-radio-button label="-1">全部</el-radio-button>
					</el-radio-group>
					<div class="teacher-query">
						<div class="query-cell">
							<span>课程课次</span>
							<el-cascader clearable size="small" filterable v-model="this.course" :options="this.courseOptions" :props="{children: 'courseIndexList', value: 'id'}" @change="this.course !== null ? [this.lessonParam.courseId, this.lessonParam.courseIndex] = this.course : this.lessonParam.courseId = this.lessonParam.courseIndex = null"></el-cascader>
						</div>
						<div class="query-cell">
							<span>备课时间</span>
							<el-date-picker
								size="small"
								value-format="yyyy-MM-dd"
								v-model="this.lessonTime"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								@change="this.lessonTime !== null ? (this.lessonParam.startTime = new Date(this.lessonTime[0]).toLocaleDateString(), this.lessonParam.endTime = new Date(this.lessonTime[1]).toLocaleDateString()) : (this.lessonParam.startTime = this.lessonParam.endTime = null)">
							</el-date-picker>
						</div>
					</div>
				</div>
				<ul class="right-content">
					<li class="right-content-cell" v-for="item in lessonList" @click="() => {handelLessonInfo = item, getCourseDto(item.courseIndex)}" :key="item.id">
						<div class="right-content-cell-basic">
							<div class="lesson-img">
								<img src="/@/assets/lessonImg.png" alt="">
							</div>
							<div class="lesson-info">
								<p class="lesson-info-courseIndex">{{item.courseIndexName}}</p>
								<p class="lesson-info-courseName">{{item.courseName}}</p>
								<p class="lesson-info-time">{{new Date(item.lastSaveDate).toLocaleString()}}</p>
							</div>
						</div>
						<div class="right-content-cell-name">{{item.creatorName}}</div>
						<div class="right-content-cell-status">
							<p class="plan-status">教师教案:&nbsp;&nbsp;<span :style="{'background': item.teachPlan ? '#F2F2F2' : '#FFEFEB', 'color': item.teachPlan ? '#74C874' : '#FC514F' }"><b>·</b>{{item.teachPlan ? '已上传' : '未上传'}}</span></p>
							<p class="video-status">还课视频:&nbsp;&nbsp;<span :style="{'background': item.reviewVideo ? '#F2F2F2' : '#FFEFEB', 'color': item.reviewVideo ? '#74C874' : '#FC514F' }"><b>·</b>{{item.reviewVideo ? '已上传' : '未上传'}}</span></p>
						</div>
						<div class="right-content-cell-score" v-if="item.checkStaus == 1" @click.stop="scoreDialogVisible = true, handelLessonInfo = item">
							备课评分:&nbsp;&nbsp;&nbsp;未评价
						</div>
						<div class="right-content-cell-score" v-else @click.stop="scoreDialogVisible = true, handelLessonInfo = item">
							备课评分:&nbsp;&nbsp;&nbsp;{{item.score}} 分
						</div>
					</li>
					<div class="page" v-if="total != 0">
						<el-pagination
							background
							layout="prev, pager, next"
							:total="total"
							@current-change="(page) => lessonParam.current = page">
						</el-pagination>
					</div>
				</ul>
			</div>
		</div>
		<el-dialog title="备课评分" v-model="scoreDialogVisible" width="40%">
			<score @sendParam="openScore" :lessonInfo="handelLessonInfo"/>
			<template #footer>
				<span class="dialog-footer">
				<el-button @click="scoreDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveLessonScore">确 定</el-button>
			</span>
			</template>
		</el-dialog>
		<transition name="slide-fade">
			<page-view :lessonInfo="handelLessonInfo" :courseIndexDto="courseIndexDto" v-show="courseIndexDto"/>
		</transition>
	</div>
</template>

<script lang="js">
	import './index.scss'
	import checkHeader from "./components/header.vue";
	import score from './components/score.vue'
	import axios from 'axios';
	import emitter from "../../utils/mitt";
	import headerRef from './components/header-ref.vue';
	import pageView from './components/pageView.vue'

  export default {
		name: "index",
		components: {
      headerRef,
		  checkHeader,
      score,
      pageView
		},
		data() {
		  return {
		    handelLessonInfo: null,
        scoreDialogVisible: false,
        active: false,
        teacherName: '',
			  teacherList: [{nickname: ''}],
			  currentTeacher: null,
			  statusOpt: [{label: '待审核', val: 0}, {label: '已审核', val: 1}, {label: '全部', val: 2}],
        course: null,
        courseOptions: [{}],
        lessonTime: [],
        schoolId: '',
        researchId:'',
			  timer: null,
			  lessonParam: {
          endTime: '',
          startTime: '',
          checkStatus: -1,
          courseIndex: '',
          courseId: '',
          creatorId: '',
          schoolId: '',
				  current: 1,
				  size: 3
			  },
			  lessonList: [],
			  scoreParam: null,
			  total: 0,
			  courseIndexDto: null,
			  subjectParam: null
		  }
		},
		computed: {
		  // subjectParasm() {
      //   return this.$store.state.nav.navSelectParams
		  // },
			filterTeacher() {
		    let filterList = []
        filterList = this.teacherList.filter(item => item.nickname.indexOf(this.teacherName) !== -1)
        return filterList
			}
		},
	  watch: {
      lessonParam: {
        handler: function (val, oldVal) {
					this.getLessonData()
        },
	      deep: true
      },
      subjectParam: {
        handler: function(val, oldVal) {
          this.getCourseData();
        },
        deep: true
      }
	  },
		methods: {
      openScore(param) {
        this.scoreParam = param;
      },
      saveLessonScore() {
				axios.post('admin/prepareLesson/savePrepareLessonScore', {prepareLessonId: this.handelLessonInfo.id, ...this.scoreParam}).then(res => {
				  if (res.result) {
            this.$message.success(res.msg);
            this.scoreDialogVisible = false;
            this.getLessonData();
				  }
				})
      },
      schoolChange(schoolId) {
        this.schoolId = schoolId;
        this.getTeacherData(this.researchId, this.schoolId)
      },
      researchChange(researchId) {
        this.researchId = researchId;
        this.getTeacherData(this.researchId, this.schoolId)
      },
      selectTeacher(item) {
        if (this.currentTeacher !== null && this.lessonParam.creatorId !== '') {
          this.currentTeacher = null;
          this.lessonParam.creatorId = '';
          return;
        }
        this.currentTeacher = item;
        this.lessonParam.creatorId = item.id;
      },
			async getTeacherData(groupId, schoolId) {
        const res = await axios.get('/permission/user/queryUserList', {params: {groupId, schoolId}});
        if (res.json && res.json.length) this.teacherList = res.json;
			},
			async getCourseData() {
        const res = await axios.post('/course/query', {subjectId: this.subjectParam});
        if (res.result && res.json && res.json.length) {
          res.json.forEach(item => {
            item.label = item.courseName;
            if (item.courseIndexList && item.courseIndexList.length) {
              item.courseIndexList.forEach(val => {
                val.label = val.courseIndexName
              })
            }
          });
          this.courseOptions = res.json;
        } else {
          this.courseOptions = [];
        }
			},
			getLessonData() {
        axios.post('/admin/prepareLesson/queryPage', this.lessonParam).then(res => {
        	this.lessonList = res.records;
        	this.total = res.total;
        })
			},
      getCourseDto(courseIndexId) {
				axios.post('admin/prepareLesson/queryMaterialByCourseIndexId', {courseIndexId}).then(res => this.courseIndexDto = res.json);
      }
		},
    created() {
	    emitter.emit('effect', (subject) => this.subjectParam = subject);
	    this.getTeacherData(this.researchId, this.schoolId)
			this.getLessonData();
      this.teacherName = '';
    },
	  mounted() {
		  emitter.emit('slot', this.$refs.headerRef)
	  }
  }
</script>
