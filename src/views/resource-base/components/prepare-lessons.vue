<template>
  <cus-form
    ref="formRef"
    :nodes="nodes"
    :width="files ? '422px' : '500px'"
  ></cus-form>
  <cus-form
    ref="formRef2"
    :nodes="nodes2"
    :width="files ? '422px' : '500px'"
  ></cus-form>
  <el-tree
    :data="dataset"
    show-checkbox
    node-key="id"
    :default-expanded-keys="[]"
    :default-checked-keys="defaultChecked"
    :props="defaultProps"
    @check="checkChange"
  >
  </el-tree>
</template>
<script lang="ts">
import { ref, Ref, PropType, onMounted, reactive } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "~/@/core/axios";
import emitter from "../../../utils/mitt";
import { ElMessage } from "element-plus";

export default {
  props: {
    prepareLessons: Object as any,
    files: Array as PropType<File[]>,
  },
  setup(props) {
    const dataset: Ref<any[]> = ref([]);
    const defaultChecked: Ref<any[]> = ref([]);
    const defaultProps = ref({
      label: "label",
      children: "children",
    });
    const state = reactive({
      gradeId: null as null | string,
      courseTypeId: null as null | string,
    });
    const params = ref([]); //备课添加类型post参数
    let store = useStore();
    let formRef = ref();

    let controls: any[] = [
      {
        label: "班型",
        key: "0",
        type: "select",
        url: "system/dictionary/queryDataByType",
        params: {
          code: "1df7a89403944dc1a020faaae3f9f4e2",
          typeCode: "COURSE_TYPE",
        },
        options: [
          { id: "0", name: "所有" },
          { id: "b374b625605a47dbb9a610b7c6fb2519", name: "提高" },
          { id: "5d8116fcbcaa4262b409aa3d8660f4c6", name: "进阶" },
        ], //props.prepareLessons.grade,
        rule: { required: true, message: "请选择课程分类" },
        cb: getTreeData,
        flag: 1,
      },
    ];
    let controls2: any[] = [
      {
        label: "年级",
        type: "select",
        url: "system/dictionary/queryDataByType",
        params: {
          code: "1df7a89403944dc1a020faaae3f9f4e2",
          typeCode: "GRADE",
        },
        key: "0",
        options: [
          { id: "0", name: "所有" },
          { id: "2a63dafd9cf84e7087a1e88c59af719c", name: "一年级" },
          { id: "12dd5060351246b9bbac76da5388a977", name: "二年级" },
          { id: "95da4c94b4504c13b9321f77b3cf8cf4", name: "三年级" },
          { id: "b3a9b4dbded74db6bf1e86632489dda3", name: "四年级" },
          { id: "257a3a557dae4c5e959a9c91142057ee", name: "五年级" },
          { id: "06605035702d42c3bc24013c04689d46", name: "六年级" },
        ], //props.prepareLessons.grade,
        rule: { required: true, message: "请选择课程分类" },
        cb: getTreeData,
        flag: 2,
      },
    ];
    let fileList: Ref<any[]> = ref([]);

    let nodes: Ref<any[]> = ref(controls);
    let nodes2: Ref<any[]> = ref(controls2);

    const uploadSuccess = (response, file, fileList) => {
      //   console.log(response, file, fileList);
    };
    const fileRemove = (file, fileList) => {
      //   console.log(file, fileList);
    };
    const save = (resolve, reject) => {
      formRef.value.validate((valid) => {
        if (valid) {
          addCategory()
          resolve(valid);
        }
        reject("添加失败");
      });
    };
    let subjectId = "";
    // 获取类别树形图数据
    function getTreeData(type = 1, e = "") {
      emitter.emit("effect", (id) => {
        subjectId = id;
      });
      if (type === 1) {
        if (e === "0") {
          state.courseTypeId = null;
        } else {
          state.courseTypeId = e;
        }
      } else {
        if (e === "0") {
          state.gradeId = null;
        } else {
          state.gradeId = e;
        }
      }
      defaultChecked.value = [];
      axios
        .post<any, AxResponse>("course/query", {
          gradeId: state.gradeId,
          courseTypeId: state.courseTypeId,
          subjectId,
          materialId: props.prepareLessons.id,
        })
        .then((res) => {
          if (!res.result) {
            return false;
          }
          dataset.value = res.json.map((item) => ({
            id: item.id,
            label: item.courseName,
            children: item.courseIndexList.map((item2) => {
              if (item2.hasOwnProperty("isExist") && item2.isExist === 1) {
                defaultChecked.value.push(item2.id);
              }
              return {
                id: item2.id,
                label: item2.courseIndexName,
                courseId: item2.courseId,
                courseIndexId: item2.id,
              };
            }),
          }));
        });
    }
    // 备课添加类型
    function addCategory() {
      axios
        .post<any, AxResponse>("admin/materialCourseIndex/add", params.value, {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
          },
        })
        .then((res) => {
          if (!res.result) {
            return;
          }
          ElMessage({ type: "success", message: "添加成功" });
        });
    }
    // 树选择
    function checkChange(tar, e) {
      params.value = [];
      e.checkedNodes.forEach((element) => {
        if (element.hasOwnProperty("courseId")) {
          params.value.push({
            courseId: element.courseId,
            courseIndexId: element.courseIndexId,
            materialId: props.prepareLessons.id,
          } as never);
        }
      });
    }
    onMounted(() => {
      getTreeData();
    });

    return {
      uploadSuccess,
      fileRemove,
      nodes,
      nodes2,
      save,
      formRef,
      fileList,
      dataset,
      defaultProps,
      checkChange,
      defaultChecked,
    };
  },
};
</script>
<style lang="scss" scoped>
:deep(label.el-form-item__label) {
  display: none;
}
:deep(div.el-form-item__content) {
  margin-left: inherit !important;
}

</style>
