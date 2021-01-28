<template>
	<div class="kont-container">
		<div class="kont-head">
			<div class="kont-head-title">
				<span>{{ data.courseName }}</span>
			</div>
			<div class="kont-head-aoto">
				<div class="save" @click="$notify({title: '成功', message: '保存成功', type: 'success'})"><i class="el-icon-wallet" /><span>自动保存...</span></div>
			</div>
		</div>
		<div class="kont-content">
			<cus-skeleton :loading="loading">
				<transition-group tag="ul" name="flip-list" v-if="courseIndexList.length">
					<li class="kont-li" :class="{'close': item.close}" v-for="(item, index) in courseIndexList" :key="item.id">
						<div class="title-wrapper" @click.prevent=" item.close = !item.close " >
							<div class="left">
								<i class="el-icon-caret-right"></i>
								<span class="courseIndex">第{{index + 1}}讲</span>
								<el-input @change="indexNameChange(item)" v-model="item.courseIndexName" @click.stop.native clearable></el-input>
							</div>
							<div class="right">
								<span @click.stop="increaseChapter(item)">添加章节</span>
								<el-divider direction="vertical"></el-divider>
								<el-tooltip class="item" effect="dark" content="上移" placement="bottom">
									<i class="icon iconfont iconshangyi" @click.stop="move(index, 1)" :class="{'is-disable': index == 0}"></i>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="下移" placement="bottom">
									<i class="icon iconfont iconxiayi" @click.stop="move(index, -1)" :class="{'is-disable': index == courseIndexList.length - 1}"></i>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" content="删除" placement="bottom">
									<i class="icon iconfont iconshanchu" @click.stop="deleteCourseIndex(item, index)"></i>
								</el-tooltip>
							</div>
						</div>
						<div class="content-wrapper" :style="{'height': (!item.close ? (((item.hasChapters !== null && item.hasChapters.length) || 3.3) * 40) : 0) + 'px'}">
							<template v-if="item.hasChapters && item.hasChapters.length">
								<div class="chapter-cell" v-for="(v, i) in item.hasChapters">
									<div style="display: flex">
										<img src="/src/assets/chapter.png" alt='章节' width="38" height="18">
										<span>{{v.name}}</span>
									</div>
									<div @click.stop="deleteChapter(v, item, i)">
										<i class="icon iconfont iconshanchu"></i>
									</div>
								</div>
							</template>
							<template v-else>
								<cus-empty />
							</template>
						</div>
					</li>
				</transition-group>
				<template v-else>
					<cus-empty />
				</template>
			</cus-skeleton>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, Ref, onMounted } from 'vue'
	import increaseCourseIndex from "./increaseCourseIndex.vue";
  import axios from "axios";
  import { emitter, modal } from '$';
  import { ElNotification } from 'element-plus'

	export default defineComponent({
		name: "knot",
		props: {
		  data: {
		    type: Object
		  },
      tableRef: {
		    type: Object
      }
		},
		setup(props:any) {
		  let courseIndexList:Ref<Array<any>> = ref([]);
		  let loading = ref(true);
      let subjectCode = ref('');
      onMounted(() => {
        emitter.emit('effect', (code) => { subjectCode.value = code });
        emitter.emit('effect', getVresion);
      })
      const increaseChapter = ({ id, hasChapters }) => {
        modal.create({
          component: increaseCourseIndex,
	        title: '添加章节',
          zIndex: 2011,
          props: {
            VresionData,
            defaultChecked: hasChapters?.map(i => i.id)
          }
        }).then(chapterIds => {
					axios.post('/courseChapter/add', {chapterIds, courseIndexId: id}, {headers: {'Content-Type': 'application/json'}}).then((res: any) => res.result && ElNotification['success']({title: '成功', message: '添加章节成功'}) && getCourseDto())
        })
      };
      const deleteChapter = ({ id }, courseIndex, i) => {
        axios.post('/courseChapter/deleteByCourseIndexId', {chapterId: id, courseIndexId: courseIndex.id}).then((res: any) => {res.result && ElNotification['success']({title: '成功', message: '删除章节成功'}) && courseIndex.hasChapters.splice(i, 1)})
      };
      const deleteCourseIndex = ({ id }, i) => {axios.post('/courseIndex/delete', { id }).then((res: any) => {ElNotification[res.result? 'success' : 'error']({title: res.result ? '成功' : '失败', message: res.result? '删除章节成功' : res.msg}) && courseIndexList.value.splice(i, 1) && props.tableRef.value.request()})};
      const indexNameChange = (data) => {
        axios.post('/courseIndex/modify', data, {headers: {'Content-Type': 'application/json'}}).then((res :any) => ElNotification[ res.result ? 'success' : 'error' ]({title: res.result ? '成功' : '失败', message: res.result ? '修改名称成功' : res.msg}))
      }
      const move = (i, type) => {
        if (type === 1) {
          if (i === 0 ) return false;
        } else {
          if (i === courseIndexList.value.length - 1) return false;
        }
        axios.post('/courseIndex/modifyCourseIndexUpOrDown', {courseIndexId: courseIndexList.value[i].id, moveType: type}).then((res: any) => {
          if (res.result) {
            if (type === 1 ) {
              let pre = courseIndexList.value[i - 1];
              let cur = courseIndexList.value[i];
              courseIndexList.value[i - 1] = cur;
              courseIndexList.value[i] = pre;
            } else {
              let pre = courseIndexList.value[i + 1];
              courseIndexList.value[i + 1] = courseIndexList.value[i];
              courseIndexList.value[i] = pre;
            }
          }
        })
			};
      function getCourseDto() {
		    loading.value = true;
				axios.post('/courseIndex/query', { courseId: props.data.id }, {headers: {'Content-Type': 'application/json;charset=UTF-8'}}).then((res: any) => {
          if (res.result) {
            res.json.map(i => i.close = true);
            courseIndexList.value = res.json;
            loading.value = false;
          }
        });
      };
      getCourseDto();

      let VresionData = [];
      function getVresion(subjectCode) {
        axios.post('/tiku/bookVersion/queryVresionBookTree', {subject: subjectCode}).then((res: any) => {if (res.result) VresionData = res.json});
      }

      return { courseIndexList, loading, increaseChapter, deleteChapter, deleteCourseIndex, move, indexNameChange}
		}
	})
</script>

<style scoped lang="scss">
	@import './../../../cus-var.scss';
	.kont-container {
		width: 100%;
		height: 100%;
		background: #F4F5F9;
		overflow: auto;
		min-width: 1200px;
	}
	.kont-head {
		padding: 0 80px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
		background: $--color-primary;
		&-title {
			text-align: right;
			color: white;
		};
		&-aoto {
			display: flex;
			align-items: center;
			.save {
				cursor: pointer;
				color: #fff;
				i {
					font-size: 24px;
					vertical-align: middle;
					margin-right: 10px;
				}
			}
			.btns {
				margin-left: 30px;
				button {
					color: $--color-primary;
					padding: 10px 23px;
					input {
						display: none;
					}
				}
			}
		}
	}
	.kont-content {
		width: 1200px;
		height: calc(100% - 80px);
		margin: 20px auto 0 auto;
		overflow: auto;
		background: #FFFFFF;
		box-shadow: 0px -3px 8px 0px rgba(91, 125, 255, 0.08);
		border-radius: 6px;
		padding: 10px 0;
		.flip-list-move {
			transition: transform .5s;
		}
		.kont-li {
			padding: 15px 50px;
			display: flex;
			flex-direction: column;
			&:hover {
				background: white;
			}
			.content-wrapper {
				height: 100px;
				padding: 0 30px;
				transition: all 0.5s ease 0s;
				margin-top: 15px;
				border-top: 1px solid #DCDEE3;
				.chapter-cell {
					display: flex;
					justify-content: space-between;
					padding: 15px 15px 15px 10px;
          cursor: pointer;
					span {
						margin-left: 15px;
						line-height: 18px;
					}
					&:hover {
						background: #F5F7FA;
					}
					.iconshanchu {
						color: #3f3279;
						cursor: pointer;
					}
				}
			}
			&.close {
				&:hover {
					background: #F5F7FA;
				}
				.content-wrapper {
					/*height: 0 !important;*/
					overflow: hidden;
					border: none;
					margin-top: 0;
				}
				.title-wrapper .left i {
					transform: rotate(0deg);
				}
			}
			.title-wrapper {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				cursor: pointer;
				.left {
					width: 30%;
					display: flex;
					align-items: center;
					i {
						color: #C0C4CC;
						transition: transform .3s;
						transform: rotate(90deg);
					}
					.courseIndex {
						margin: 0 10px 0 20px;
            flex: 0.2 1 0%;
					}
					.el-input {
						flex: 1;
					}
				}
				.right {
					width: 20%;
					height: 100%;
					& > span {
						color: $--color-primary;
						cursor: pointer;
					}
					.icon {
						color: $--color-primary;
						cursor: pointer;
						padding: 4px 5px;
						border-radius: 4px;
						margin: 0 5px;
            &:hover {
              background: #f2f6fc;
            }
					}
					.icon.iconshanchu {
						color: #382A74;
						&:hover {
							color: #ff3d3d;
						}
					}
					.icon.is-disable {
						background: none !important;
						cursor: no-drop;
						color: #77808D;
					}
				}
			}
		}
	}
</style>
