<template>
       <div class="right-content-searchWrap">
          <div class="right-content-searchWrap-header">
            <div class="tab">
              <nav>
                <a
                  v-for="(item, index) in fileTypeAndCount"
                  :style="{ 'z-index': item.id === activeId ? 9 : 1 }"
                  :class="{ active: item.id == activeId }"
                  :key="index"
                  @click.prevent="selectActive(item)"
                >
                  {{ item.name }}
                  <span class="num">
                    {{ item.count }}
                  </span>
                </a>
              </nav>
            </div>
            <!-- <ul>
              <li
                v-for="(item,index) in switchDataTypeList"
                :key="index"
                :class="{'headerActive':switchDataTypeIndex === index}"
                @click="switchDataType(item,index)"
              >{{item.name}}</li>
            </ul>
            <div>
              <div class="hoverWrap" ref="ele_hoverWrap">
                <img src="../../assets/images/shape.png" alt />
                <inputSearch
                  class="inputSearchStyle"
                  ref="ele_inputSearchStyle"
                  @getData="getValue"
                  :placeholderStr="'按名称搜索'"
                />
              </div>
            </div> -->
          </div>
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
    let activeId: Number = 5;
    let params = reactive({
      subject: "chinese3",
      chapterId: [],
      isPublic: 1,
    });
    let fileTypeAndCount: Array<any> = reactive([]);
    console.log(params);

    axios
      .post<any, AxResponse>("/admin/material/queryCountByType", params, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // console.log(res);
        if (res.result) {
          res.json.allCount = eval(Object.values(res.json).join("+"));
          let i = 1;
          for (let keys in res.json) {
            let obj = {
              name: keys,
              count: res.json[keys],
              id: i,
              type: [],
              order: 0,
            };
            switch (keys) {
              case "allCount":
                obj.type = [];
                obj.order = 1;
                obj.name = "全部";
                break;
              case "courseWareCount":
                obj.order = 2;
                obj.name = "课件";
                break;
              case "handoutCount":
                obj.order = 3;
                obj.name = "讲义";
                break;
              case "teachplanCount":
                obj.order = 4;
                obj.name = "教案";
                break;
              case "mediaCount":
                obj.order = 5;
                obj.name = "说课视频";
                break;
              case "otherCount":
                obj.order = 6;
                obj.name = "其他";
                break;
            }
            fileTypeAndCount.push(obj);
            i += 1;
          }
        }
        fileTypeAndCount.values = res.json;
        // console.log(res.json);
      });

    return { fileTypeAndCount, activeId };
  },
};
</script>

<style lang="scss" scoped>
  .right-content {
    height: 100%;
    margin-left: 20px;
    width: 77.5%;
    float: right;
    &-mainList {
      background: #fff;
      margin-top: 10px;
      @include clearfix;
      border-radius: $main-radius-1;
      box-shadow: $list-wrap-box-shadow;
      .tableWrap {
        padding: 20px 10px;
        .nameOrType {
          float: left;
          > div {
            height: 100%;
            img {
              float: left;
              margin-top: 2%;
            }
            span {
              width: 85%;
              float: left;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        .dataTotal {
          float: right;
          margin-right: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #77808d;
          line-height: 20px;
        }
        .tableHeader {
          width: 100%;
          height: 48px;
          background: #ebecf0;
          padding-left: 20px;
        }

        .tableHeader > span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          padding: 13px 0;
        }

        span {
          display: inline-block;
        }
      }
      .paginationFY {
        float: right;
      }
      // ul {
      //   li {
      //     width: 100%;
      //     background: rgba(255, 255, 255, 1);
      //     border-radius: 10px;
      //     border: 1px solid rgba(235, 240, 252, 1);
      //     padding: 20px;
      //     padding-bottom: 0;
      //   }
      // }
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
    &-sortBox {
      width: 100%;
      height: 36px;

      line-height: 36px;
      padding-right: 20px;
      &-rightBox {
        float: right;
        & > span {
          float: left;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(119, 128, 141, 1);
          span {
            color: #ff3b3b;
          }
        }
        & > div {
          float: left;
          height: 14px;
          border-left: 1px solid #ebf0fc;
          line-height: 14px;
          margin-top: 11px;
          padding-left: 10px;
          margin-left: 10px;
          margin-right: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: $blueColor;
          cursor: pointer;
          img {
            margin-right: 4px;
          }
        }
      }
      ul {
        @include clearfix;
        float: left;
        li {
          // float: left;
          width: 80px;
          height: 36px;
          background: $main-color-1;
          border-radius: 3px;
          text-align: center;
          line-height: 36px;
          border: 0;
          color: #ffffff;
          margin-right: 10px;
          cursor: pointer;
          display: inline-block;
        }
      }
      /deep/.el-upload-list {
        .el-upload-list__item {
          display: none;
        }
      }
    }
    &-searchWrap {
      position: relative;
      &-advancedFiltering {
        @include horizontaCenter;
        bottom: -49px;
        cursor: pointer;
        .bolAdvancedFilteringActive {
          color: $blueColor;
        }
        div {
          position: absolute;
          left: 20px;
          top: 16px;
          img {
            display: inline-block;
            float: right;
          }
          span {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(119, 128, 141, 1);
            line-height: 20px;
          }
        }
      }
      &-header {
        @include clearfix;
        // overflow: hidden;
        & > div {
          float: right;
          @include clearfix;
          position: relative;
          height: 55px;
          width: 45%;
          .hoverWrap {
            width: 100px;
            height: 55px;
            overflow: hidden;
            position: absolute;
            right: 40px;
            img {
              position: absolute;
              right: 0;
              top: 21px;
            }
            .inputSearchStyle {
              position: absolute;
              left: 100px;
              top: 10px;
              transition: 0.5s all;
            }
          }
          .hoverWrap:hover {
            overflow: visible;
            .inputSearchStyle {
              position: absolute;
              left: -161px;
            }
          }
          button {
            width: 80px;
            height: 36px;
            background: rgba(69, 90, 247, 1);
            border-radius: 3px;
            border: 0;
            color: #fff;
            margin-left: 42px;
            margin-top: 7px;
            margin-right: 20px;
          }
        }
        & > ul {
          float: left;
          @include clearfix;
          li {
            padding: 13px 20px;
            box-sizing: border-box;
            float: left;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: rgba(119, 128, 141, 1);
            line-height: 24px;
            cursor: pointer;
          }
          li.headerActive {
            color: $font-color-1;
            border-bottom: 5px solid $font-color-1;
          }
        }
      }
    }
    .import-box {
      display: flex;
      justify-content: flex-end;
      height: 50px;
      align-items: center;
    }
  }
</style>
