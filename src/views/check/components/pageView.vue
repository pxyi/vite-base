<template>
	<div class="preview">
		<div class="head">
			<div @click="$parent.$parent.courseIndexDto = null">
				<i class="el-icon-arrow-left"></i>
				<span>返回</span>
			</div>
			<div>{{lessonInfo ? new Date(lessonInfo.lastSaveDate).toLocaleString() : ''}}</div>
		</div>
		<div class="body">
			<div class="body-left">
				<div class="header">
					<div v-for="i in tab" @click="tabIndex = i.value" :key="i.id" :class="{'tabActive': tabIndex == i.value}">{{i.label}}</div>
				</div>
				<div class="content">
					<ul class="content-ul teach-ul" v-show="tabIndex == 1">
						<li v-for="(item, index) in courseIndexDto" :key="index" :class="[item.id == currentFile.id ? 'active' : '', item.type === 3 ? '' : 'teach']">
							<div class="content-cell-wrapper"  @click="currentFile = item" v-if="item.type === 3">
								<div class="img">
									<img src="/src/assets/lessonImg.png" alt="">
								</div>
								{{item.fileName}}.{{item.ext}}
							</div>
						</li>
					</ul>
					<ul class="content-ul video-ul" v-show="tabIndex == 2">
						<li v-for="(item, index) in courseIndexDto" :key="index" :class="[item.id == currentFile.id ? 'active' : '', item.type !== 3 ? '' : 'video']">
							<div class="content-cell-wrapper"  @click="currentFile = item" v-if="item.type !== 3">
								<div class="img">
									<img src="/src/assets/lessonImg.png" alt="">
								</div>
								{{item.fileName}}.{{item.ext}}
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="body-right">
				<img class="centerimg" v-if="['jpg','png','jpeg'].indexOf(currentFile.ext) !== -1" :src="baseApi + currentFile.filePath" alt="">
				<video v-if="currentFile.ext === 'mp4'" controls controlsList="nodownload" :src="baseApi + currentFile.filePath"></video>
				<video v-if="currentFile.ext === 'mp3'" controls controlsList="nodownload" name="media" class="mp3view">
					<source :src="baseApi + currentFile.filePath" type="audio/mpeg">
				</video>
				<iframe
					allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"
					v-if="['pdf','ppt','pptx','docx','doc'].indexOf(currentFile.ext) !== -1"
					:src="`${web365}/?furl=${baseApi + currentFile.filePath}`"
					frameborder="0"
					style="width:100%; height:100%;"
				/>
				<iframe
					v-if="['zip','rar'].indexOf(currentFile.ext) !== -1"
					:src="`${web365}/?furl=${baseApi + currentFile.filePath}`"
					frameborder="0"
					style="width:100%; height:100%;"></iframe>
			</div>
		</div>
	</div>
</template>

<script lang="js">
	export default {
		name: "pageView",
		props: {
      lessonInfo: {
        type: Object,
	      default: null
      },
      courseIndexDto: {
        type: Array
      }
		},
		data() {
		  return {
		    currentFile: {},
			  baseApi: import.meta.env.VITE_APP_BASE_URL,
			  web365: import.meta.env.VITE_APP_OFFICE_WEB365,
			  tab:[{label: '教师教案', value: 2}, {label: '教师说课视频', value: 1}],
			  tabIndex:  1
		  }
		}
  }
</script>
