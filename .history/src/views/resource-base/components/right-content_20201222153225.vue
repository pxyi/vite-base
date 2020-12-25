<template>
  <div class="right-content">
    <!-- <ul class="tableMain">
      <li
        v-for="(item, index) in tableData"
        :key="index"
      >
        <div class="thumbnailWrap">
          <img
            v-if="
              item.ext !== 'mp3' && item.ext !== 'zip' && item.ext !== 'rar'
            "
            class="imgCover"
            :src="`/test${item.imgPath}`"
            alt=""
          />
          <img
            v-else
            src="../../assets/images/icon_d44l6421sgu/weizhiwenjian.png"
            alt=""
          />
        </div>

        <p class="content-list-box-item-title">
          {{ item.fileName }}.{{ item.ext }}
        </p>
        <!-- </p> -->
      </li>
    </ul> -->
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
    let tableData:Array<any> = reactive([])
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
        if(res.result){
            tableData.values = res.json
            console.log(tableData);
            
        }
      });
  },
};
</script>

<style lang="scss" scoped>
.right-content {
  background-color: #fff;
  height: 100%;
}
</style>
