<template>
  <cus-form
    ref="formRef"
    :nodes="nodes"
    :width="files ? '422px' : '500px'"
  ></cus-form>
</template>
<script lang="ts">
import { ref, Ref, PropType, onMounted } from "vue";
import { AxResponse } from "./../../../core/axios";
import axios from "axios";
import { useStore } from "vuex";
import { ElMessage } from 'element-plus';
import emitter from '../../../utils/mitt';

export default {
  props: {
    newName: Object as any,
    files: Array as PropType<File[]>,
  },
  setup(props) {

    let store = useStore();
    let formRef = ref();
    let uploadRef = ref();
    let action = `${import.meta.env.VITE_APP_BASE_URL}/system/file/uploadFile`;
   
    let fileList: Ref<any[]> = ref([]);
   

    const uploadSuccess = (response, file, fileList) => {
    //   console.log(response, file, fileList);
    };
    const fileRemove = (file, fileList) => {
    //   console.log(file, fileList);
    };

    const save = (resolve, reject) => {
     let params = {
        id:props.newName.id,
        fileName:formRef.value.formGroup.fileName
      }
      // console.log(formRef.value.formGroup.fileName,'51');
      
      axios.post<any,AxResponse>('/admin/material/saveOrUpdate',params).then(res=>{
        if(res.result){
         ElMessage.success('修改成功');
         emitter.on('getMaterialQueryPage',getMaterialQueryPage=>{
           getMaterialQueryPage()
         })
        //  console.log(res,'51');
         resolve(res.result)
        }else{
        ElMessage.error('修改失败');
        reject()
        }
      })
    
      formRef.value.validate((valid) => {
        valid ? resolve(valid) : reject();
      });
      
    };
 let controls: any[] = [
      {
        label: "资料名称",
        type: "input",
        rule: { required: true, message: "请输入文件名称" },
        default:props.newName.fileName,
        key:'fileName'
      },
 
    ];

    let nodes: Ref<any[]> = ref(controls);

    return {
      action,
      save,
      formRef,
      uploadRef,
      fileList,
      uploadSuccess,
      fileRemove,
      nodes,

    };
  },
};
</script>
<style lang="scss" scoped>

</style>
