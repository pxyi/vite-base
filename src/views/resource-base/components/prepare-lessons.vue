<template>
  <cus-form
    ref="formRef"
    :nodes="nodes"
    :width="files ? '422px' : '500px'"
  ></cus-form>
<el-tree
  :data="dataset"
  show-checkbox
  node-key="id"
  :default-expanded-keys="[2, 3]"
  :default-checked-keys="[5]"
  :props="defaultProps"
>
</el-tree>
</template>
<script lang="ts">
import { ref, Ref, PropType, onMounted } from "vue";
import { AxResponse } from "./../../../core/axios";
import axios from "axios";
import { useStore } from "vuex";

export default {
  props: {
    prepareLessons: Object as any,
    files: Array as PropType<File[]>,
  },
  setup(props) {
       let dataset: any[] = [
      {
        title: '一级-1',
        key: '1',
        children: [
          {
            title: '二级-1',
            key: '1-1',
              children: [
                {
                  title: '三级-1',
                  key: '1-1-1',
                },
                {
                  title: '三级-2',
                  key: '1-2-1',
                },
                {
                  title: '三级-3',
                  key: '1-3-1',
                }
              ]
          },
          {
            title: '二级-2',
            key: '1-2',
          },
          {
            title: '二级-3',
            key: '1-3',
          }
        ]
      },
      {
        title: '一级-2',
        key: '2',
        children: [
          {
            title: '2-二级-1',
            key: '2-1',
          },
          {
            title: '2-二级-2',
            key: '2-2',
          },
          {
            title: '2-二级-3',
            key: '2-3',
          }
        ]
      },
      
    ]
       let defaultProps = {
     label: "title",
     id :'key',
      children: "childs",
    }
    let store = useStore();
    let formRef = ref();
   
    let controls: any[] = [
      {
        label:'课程分类',
        type: "select",
        options: props.prepareLessons.grades,
        rule: { required: true, message: "请选择课程分类" },
      },
    ];

    let fileList: Ref<any[]> = ref([]);

    let nodes: Ref<any[]> = ref(controls);

    const uploadSuccess = (response, file, fileList) => {
    //   console.log(response, file, fileList);
    };
    const fileRemove = (file, fileList) => {
    //   console.log(file, fileList);
    };

    const save = (resolve, reject) => {
      console.log(fileList.value);
      formRef.value.validate((valid) => {
        valid ? resolve(valid) : reject();
      });
    };

    return {
     uploadSuccess,
     fileRemove,
      nodes,
      save,
      formRef,
      fileList,
      dataset,
      defaultProps
    };
  },
};
</script>
<style lang="scss" scoped>

</style>
