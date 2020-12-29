<template>
	<div class="courseIndex">
		<el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
		<el-tree ref="tree" :data="VresionData" show-checkbox node-key="id" :props="{label: 'name', children: 'childs'}" :filter-node-method="filterNode"></el-tree>
	</div>
</template>

<script lang="ts">
	import { defineComponent, ref, watch } from 'vue'
	import axios from "axios";
	export default defineComponent({
		name: "increaseCourseIndex",
		props: {
      VresionData: {
        type: Array
      }
		},
		setup(props) {
		  let filterText = ref('');
		  const tree = ref(null)
      const filterNode = (value, data) =>  {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      };

		  const save = (resolve, reject) => resolve(tree.value.getCheckedKeys(true));
      watch(filterText, (val) => {tree.value.filter(val)});

		  return { filterText, filterNode, tree, save }
		}
	})
</script>

<style scoped>

</style>
