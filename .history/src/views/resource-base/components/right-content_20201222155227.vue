<template>
  <div class="right-content">
    <ul class="tableMain">
      <li v-for="(item, index) in tableData" :key="index">
       

        <p class="content-list-box-item-title">
          {{ item.fileName }}.{{ item.ext }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, reactive, Ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import { ElMessage, ElLoading } from "element-plus";
export default {
  setup() {
    let params = reactive({
      chapterId: [],
      courseId: "",
      ext: null,
      fileName: "",
      isPublic: 1,
      lastLevelId: [],
      subject: "chinese3",
    });
    let tableData: Array<any> = reactive([]);
    axios
      .post<any, AxResponse>(
        `admin/material/queryPage?size=${20}&current=${1}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
            type: "1",
          },
        }
      )
      .then((res) => {
        if (!res.result) {
          ElMessage.error(res.msg);
        }

        tableData.values = res.json.records.map((item) => {
          item.isShow = false;
          item.renameBol = false;
          return item 
        });
        console.log(tableData);
      });
    return { tableData };
  },
};
</script>

<style lang="scss" scoped>
.right-content {
  background-color: #fff;
  height: 100%;
  .tableMain {
    width: 160px;
    height: 148px;
    border-radius: 4px;
    float: left;
    margin-right: 19px;
    margin-top: 24px;
    -webkit-box-shadow: 2px 2px 4px grey;
    box-shadow: 2px 2px 4px grey;
    margin: 14px 8px;
    position: relative;
    // li {
    //       width: 160px;
    //       height: 148px;
    //       border-radius: 4px;
    //       float: left;
    //       margin-right: 19px;
    //       margin-top: 24px;
    //       box-shadow: 2px 2px 4px grey;
    //       margin: 14px 8px;
    //       position: relative;
    //         .thumbnailWrap {
    //         margin: 12px auto 8px;
    //         overflow: hidden;
    //         width: 117px;
    //         height: 87px;
    //         box-shadow: 1px 1px 2px grey;
    //         img.imgCover {
    //           object-fit: cover;
    //           width: 100%;
    //           height: 100%;
    //         }
    //       }
    // }
  }
}
</style>
