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
                    <div>
                      <el-button size="mini" @click="preview(item)" round
                        ><img
                          src="../../assets/images/previewIcon.png"
                          alt
                        />预览</el-button
                      >
                    </div>
                    <div>
                      <el-button size="mini"  round
                        >添加到备课</el-button
                      >
                    </div>
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
        @include clearfix;
        position: relative;
        > li {
          width: 160px;
          height: 148px;
          border-radius: 4px;
          float: left;
          margin-right: 19px;
          margin-top: 24px;
          box-shadow: 2px 2px 4px grey;
          margin: 14px 8px;
          position: relative;
          .thumbnailWrap {
            margin: 12px auto 8px;
            overflow: hidden;
            width: 117px;
            height: 87px;
            box-shadow: 1px 1px 2px grey;
            img.imgCover {
              object-fit: cover;
              width: 100%;
              height: 100%;
            }
          }
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
          .imageOperation {
            position: absolute;
            right: 4px;
            top: 4px;
            cursor: pointer;
            width: 16px;
            height: 16px;
            background: url("../../assets/images/icon_d44l6421sgu/caozuo.png")
              no-repeat center;
          }
          .changeTdOperation {
            width: 168px;
            position: absolute;
            right: -25px;
            top: 28px;
            z-index: 9;
            @include clearfix;
            background: #fff;
            width: 170px;
            box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
            border: 1px solid #e4e7ed;
            span {
              width: 100%;
              float: left;
              display: block;
              height: 34px;
              line-height: 34px;
              text-indent: 19px;
              font-weight: 400;
              color: #606266;
              cursor: pointer;
            }
            span:hover {
              color: #1aafa7;
              background: #e9f7f7;
            }
            .triangle {
              display: inline-block;
              border: 5px solid transparent;
              border-bottom-color: #fff;
              position: absolute;
              top: -10px;
              right: 30px;
              box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
            }
          }
          .floating-layer {
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            display: none;
            position: absolute;
            left: 0;
            top: 0;
          }
          .private {
            display: none;
            position: absolute;
            left: 4px;
            bottom: 4px;
            z-index: 10;
            padding: 0 5px;
            background: rgba(0, 0, 0, 0.52);
            border-radius: 5px;
            color: #fff;
          }
          .btn-group {
            position: absolute;
            top: 48px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            /* margin-top: 28px; */
            width: 100%;
            height: 60px;
            display: none;
            > div {
              width: 84px;
              height: 24px;
              background: #ffffff;
              border-radius: 12px;
              .el-button--mini,
              .el-button--mini.is-round {
                padding: 0;
              }
              button {
                width: 100%;
                color: #1aafa7;
                border-color: #fff;
                background-color: #fff;
                height: 24px;
                line-height: 24px;
                img {
                  margin-right: 8px;
                  margin-top: -1px;
                }
              }
            }
          }
        }
        > li:hover {
          .btn-group {
            display: flex;
          }
          .floating-layer {
            display: block;
          }
          .private {
            display: block;
          }
        }
        > li:nth-child(5n) {
          margin-right: 0;
        }
      }
}
</style>
