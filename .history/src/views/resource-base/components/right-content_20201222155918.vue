<template>
  <div class="right-content">
    <ul class="tableMain">
      <li v-for="(item, index) in tableData" :key="item.id">
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
    let tableData = reactive([]);
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

        tableData = res.json.records
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
     .content-list-box-item-title {
            width: 140px;
            margin: 0 auto;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            overflow: hidden;
            word-break: break-all;
            word-wrap: break-word;
            // white-space: pre-wrap;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            text-align: center;
            margin-top: 15px;
            line-height: 15px;
          }
  }
}
</style>
