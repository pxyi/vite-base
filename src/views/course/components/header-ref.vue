<template>
	<div class="header_ref">
		<div class="tabs_box">
			<ul>
				<li :class="{ active: true}">{{ route.meta.title }}</li>
			</ul>
		</div>
		<div class="search">
			<el-input clearable placeholder="按课程名称搜索" prefix-icon="el-icon-search" v-model="searchText" @keydown.enter="searchHandle" />
		</div>
		<div class="btns">
			<el-button round @click="$emit('add')">添加课程</el-button>
		</div>
	</div>
</template>

<script lang="ts">
	import { ref, Ref, defineComponent } from 'vue'
	import { useRoute, useRouter } from "vue-router";

  export default defineComponent({
	  emits:['searchHandle'],
    setup(props, { emit }) {
      const route = useRoute();
      const router = useRouter();
			let searchText:Ref<string> = ref('');
			const searchHandle = () => { emit('searchHandle', searchText.value) }
      return { route, router, searchText, searchHandle }
    }
  })
</script>

<style scoped lang="scss">
	.header_ref {
		display: flex;
		line-height: 60px;
		.tabs_box {
			li {
				float: left;
				padding: 0 20px;
				color: #fff;
				list-style: none;
				position: relative;
				cursor: pointer;
				&.active::after {
					content: '';
					display: block;
					width: 100%;
					height: 6px;
					background: #FAAD14;
					border-radius: 3px;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
				}
			}
		}
		.search {
			margin-left: auto;
			:deep(.el-input__prefix),
			:deep(.el-input__suffix) {
				color: #fff !important;
			}
			:deep(input) {
				width: 240px;
				height: 36px;
				color: #fff;
				border: 0;
				border-radius: 18px;
				background: rgba(255, 255, 255, 0.3);
				&::placeholder {color: #fff;}
			}
		}
		.btns {
			margin-left: 30px;
			button {
				color: #1AAFA7;
				input {
					display: none;
				}
			}
		}
	}
</style>
