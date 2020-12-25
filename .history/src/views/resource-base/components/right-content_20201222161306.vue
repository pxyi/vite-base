<template>
  <div class="right-content">
    <ul class="tableMain">
              <li
                v-for="(item, index) in tableData"
                :key="index"
               
              >
                <div class="thumbnailWrap">
                  <img
                    v-if="
                      item.ext !== 'mp3' &&
                        item.ext !== 'zip' &&
                        item.ext !== 'rar'
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


                <div
                  class="changeTdOperation"
                  v-show="item.isShow"
                
                >
                  <span >重命名</span>
                  <span >下载</span>
                  <span >删除</span>
                  <div class="triangle"></div>
                </div>

                <div class="floating-layer">
                  <div
                    class="imageOperation"
                   
                  ></div>
                  <div class="btn-group">
              
                  </div>
                  <div class="private">
                    <i
                      class="el-icon-lock"
                      v-if="item.isPublic == 0"
                      style="font-size:12px"
                    ></i>
                  </div>
                </div>
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
    let tableData:Ref<any> = ref([]);
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
        tableData.value = res.json.records
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
   >li{
          width: 160px;
          height: 148px;
          border-radius: 4px;
          float: left;
          margin-right: 19px;
          margin-top: 24px;
          box-shadow: 2px 2px 4px grey;
          margin: 14px 8px;
          position: relative;
          list-style: none;
   }
  
  }
}
</style>
