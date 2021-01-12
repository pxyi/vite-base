<template>
	<div class="score-body">
		<div class="quality">
			<div class="quality-title">
				<p>备课质量评分</p>
				<p></p>
				<p>100分</p>
			</div>
			<div class="quality-body">
				<div class="quality-body-cell" v-for="(item, idx) in qualityGroup" :key="idx">
					<span>{{item.label}}</span>
					<el-radio-group v-model="item.model" @change="change" :disabled="lessonInfo.checkStaus == 2">
						<el-radio v-for="(val, index) in item.childs" :key="index" :label="val.value">{{val.value}}</el-radio>
					</el-radio-group>
					<div style="display: flex; align-items: center">
						<el-input @input="inputChange(item)" type="number" :max="item.childs[0].value" min="0" size="mini" v-model="item.model" :disabled="lessonInfo.checkStaus == 2"></el-input>
						&nbsp;&nbsp;/&nbsp;{{item.childs[0].value}}
					</div>
				</div>
			</div>
		</div>
		<div class="yet">
			<div class="yet-title">
				<p>还课评分</p>
				<p></p>
				<p>100分</p>
			</div>
			<div class="quality-body">
				<div class="quality-body-cell" v-for="(item, idx) in yetGroup" :key="idx">
					<span>{{item.label}}</span>
					<el-radio-group v-model="item.model" @change="change" :disabled="lessonInfo.checkStaus == 2">
						<el-radio v-for="(val, index) in item.childs" :key="index" :label="val.value">{{val.value}}</el-radio>
					</el-radio-group>
					<div style="display: flex; align-items: center">
						<el-input @input="inputChange(item)" type="number" :max="item.childs[0].value" min='0' size="mini" v-model="item.model" :disabled="lessonInfo.checkStaus == 2"></el-input>
						&nbsp;&nbsp;/&nbsp;{{item.childs[0].value}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="js">
	import axios from 'axios'
	export default {
		name: "score",
		props:{
      lessonInfo: {
        type: Object
      }
		},
		data() {
			return {
				qualityGroup:[
					{
						label: '教学目标',
						value: 'teachTarget',
						model: null,
						childs:[{value:'20'},{value:'10'},{value:'5'},{value:'0'}]
					},
          {
            label: '教学过程',
            value: 'teachProcess',
            model: null,
            childs:[{value:'50'},{value:'25'},{value:'12.5'},{value:'0'}]
          },
          {
            label: '教学准备',
            value: 'teachPlan',
            model: null,
            childs:[{value:'10'},{value:'5'},{value:'2.5'},{value:'0'}]
          },
          {
            label: '板书准备',
            value: 'templatePlan',
            model: null,
            childs:[{value:'10'},{value:'5'},{value:'2.5'},{value:'0'}]
          },
          {
            label: '教师反思',
            value: 'teacherRethink',
            model: null,
            childs:[{value:'10'},{value:'5'},{value:'2.5'},{value:'0'}]
          }
				],
        yetGroup:[
          {
            label: '情境导入',
            value: 'situationImport',
            model: null,
            childs:[{value:'15'},{value:'7.5'},{value:'3.75'},{value:'0'}]
          },
          {
            label: '教学目标',
            value: 'videoTeachTarget',
            model: null,
            childs:[{value:'20'},{value:'10'},{value:'5'},{value:'0'}]
          },
          {
            label: '教学过程与方法',
            value: 'teachProcessMethod',
            model: null,
            childs:[{value:'35'},{value:'17.5'},{value:'8.75'},{value:'0'}]
          },
          {
            label: '教学效果',
            value: 'teachResult',
            model: null,
            childs:[{value:'15'},{value:'7.5'},{value:'3.75'},{value:'0'}]
          },
          {
            label: '教学基本功',
            value: 'teachBasicTraining',
            model: null,
            childs:[{value:'15'},{value:'7.5'},{value:'3.75'},{value:'0'}]
          }
        ],
				score: '',
			}
		},
		watch: {
      lessonInfo: {
        deep: true,
	      handler: function (val) {
					Object.assign(this.$data, this.$options.data());
          if (this.lessonInfo.checkStaus == 2) {
            axios.post('admin/prepareLesson/queryPrepareLessonScoreByPreId', {prepareLessonId: this.lessonInfo.id}).then(res => {
              if (res.result && res.json != null) {
                this.qualityGroup.forEach(item => {
                  item.model = res.json[item.value].toString()
                });
                this.yetGroup.forEach(item => {
                  item.model = res.json[item.value].toString()
                })
              }
            })
          }
        }
      }
		},
		methods: {
			change(val) {
			  let Param = {};
			  this.qualityGroup.concat(this.yetGroup).forEach(item => {
					Param[item.value] = item.model;
			  });
			  this.$emit('sendParam', Param);
			},
      inputChange() {
        let Param = {};
        this.qualityGroup.concat(this.yetGroup).forEach(item => {
          Param[item.value] = item.model;
        });
        this.$emit('sendParam', Param);
      }
		},
    created() {
      if (this.lessonInfo.checkStaus == 2) {
        axios.post('admin/prepareLesson/queryPrepareLessonScoreByPreId', {prepareLessonId: this.lessonInfo.id}).then(res => {
          if (res.result && res.json != null) {
            this.qualityGroup.forEach(item => {
              item.model = res.json[item.value].toString()
            });
            this.yetGroup.forEach(item => {
              item.model = res.json[item.value].toString()
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
