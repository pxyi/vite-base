<template>
  <div class="tab">
    <nav>
      <a
        v-for="(item, index) in fileTypeAndCount"
        :style="{ 'z-index': item.id === activeId ? 9 : 1 }"
        :class="{ active: item.id === activeId }"
        :key="index"
        @click.prevent="selectActive(item)"
      >
        {{ item.name }}
        <span class="num">
        {{ item.count }}
        </span>
      </a>
    </nav>
      <div class="aaa">
    <span>文件名 <i class="el-icon-bottom"></i></span>
    <span>上传时间 <i class="el-icon-bottom"></i></span>
    <!-- <span>引用次数<i class="el-icon-bottom"></i></span> -->
  </div>
  </div>
    <div class="right-content">
    <ul class="tableMain">
      <li v-for="(item, index) in contengList" :key="index" @mouseleave="mouseleaveisShow(item)">
        <div class="thumbnailWrap">
          <img v-if="item.ext !== 'mp3' && item.ext !== 'zip' && item.ext !== 'rar'" class="imgCover" :src="`/test${item.imgPath}`"/>
          <img v-else src="../../../assets/images/icon_d44l6421sgu/weizhiwenjian.png" />
        </div>
        <p class="content-list-box-item-title">
          {{ item.fileName }}.{{ item.ext }}
        </p>
        <div class="changeTdOperation" v-show="item.isShow" @mouseleave="mouseleaveisShow(item)">
          <span @click="aNewName(item)">重命名</span>
          <span @click="downLoad(item)">下载</span>
          <span @click="deleteClick(item)">删除</span>
          <div class="triangle"></div>
        </div>

        <div class="floating-layer">
          <div class="imageOperation" @click="changeTdOperation(item)"></div>
          <div class="btn-group">
            <div>
            <el-button size="mini" round>
                  <img src="../../../assets/images/previewIcon.png" />预览
            </el-button>
            </div>
            <div>
              <el-button size="mini" round>添加到备课</el-button>
            </div>
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
    let activeId = ref(6);
    let params = reactive({
      subject: "chinese3",
      chapterId: [],
      isPublic: 1,
    });
    let fileTypeAndCount: Array<any> = reactive([]);
    // console.log(params);

  const getTabsList = ()=>{
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
            let obj:any = {
              name: keys,
              count: res.json[keys],
              id: i,
              type: null,
              order: 0,
            };
            switch (keys) {
              case "allCount":
                obj.type = null;
                obj.order = 1;
                obj.name = "全部";
                break;
              case "courseWareCount":
                 obj.type = 1;
                obj.order = 2;
                obj.name = "课件";
                break;
              case "handoutCount":
                 obj.type = 2;
                obj.order = 3;
                obj.name = "讲义";
                break;
              case "teachplanCount":
                 obj.type = 5;
                obj.order = 4;
                obj.name = "教案";
                break;
              case "mediaCount":
                 obj.type = 3;
                obj.order = 5;
                obj.name = "说课视频";
                break;
              case "otherCount":
                 obj.type = 4;
                obj.order = 6;
                obj.name = "其他";
                break;
            }
            fileTypeAndCount.push(obj);
            i += 1;
          }
          fileTypeAndCount.sort((a, b) => a.order - b.order);
        }else{
           ElMessage.error(res.msg);
        }
        fileTypeAndCount.values = res.json;
        // console.log(res.json);
      });
  }
    getTabsList()
  let pageParam: any = {
    current: 1,
    size: 20,
    chapterId: [],
    isPublic: 1,
    lastLevelId: [],
    ext: null,
    fileName: "",
    courseId: "",
    subject: "chinese3",
    type:null
  };
  let contengList = ref({})
  const getMaterialQueryPage = (item)=>{
    //  console.log(item);
     let params:any = Object.assign(pageParam)
     params.type = item.type
    // console.log(item.type);
     axios.post<any,AxResponse>(`admin/material/queryPage?size=${20}&current=${1}`,params,   { headers: { "Content-Type": "application/json", type: "1" } }).then(res=>{
       if(res.result){
        contengList.value = res.json.records
        console.log(contengList);
       }else{
          ElMessage.error(res.msg)
       }
     })
  }
  
    const selectActive = (item) => {
      getMaterialQueryPage(item)
      activeId.value = item.id;
      // console.log(activeId);
    };

    return { fileTypeAndCount, activeId, selectActive,contengList };
  },
};
</script>

<style lang="scss" scoped>
.tab {
  nav {
    a {
      cursor: pointer;
      position: relative;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      margin-left: 18px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(119, 128, 141, 1);
      width: 125px;
      height: 50px;
      line-height: 50px;
      background: #fafbfd;
      box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
      cursor: pointer;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fafbfd;
        box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
        border-bottom: none;
        transform: perspective(1em) scale(1.3, 1.35) rotateX(5deg);
        z-index: -1;
        -webkit-transform-origin: bottom;
        transform-origin: bottom left;
        border-radius: 6px 6px 0px 0px;
      }
      .num {
        margin-left: 5px;
        padding: 0 15px;
        background: rgba(119, 128, 141, 0.2);
        color: #77808d;
        height: 20px;
        width: 50px;
        border-radius: 15px;
      }
      &:first-child {
        margin-left: 0;
      }
      &.active {
        background: #fff;
        color: rgba(51, 51, 51, 1);
        &::before {
          background: #fff;
        }
        .num {
          color: #ffffff;
          background: rgba(250, 173, 20, 1);
        }
      }
    }
  }
}
.right-content {
  .tableMain {
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
      list-style: none;
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
        background: url("../../../assets/images/icon_d44l6421sgu/caozuo.png")
          no-repeat center;
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
              vertical-align: middle;
              display: inline-block;
            }
          }
        }
      }
      .changeTdOperation {
        width: 168px;
        position: absolute;
        right: -25px;
        top: 28px;
        z-index: 9;

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
  }
  
}
.aaa {
  background-color: #ebecf0;
  height: 46px;
  margin-top: 20px;
  display: flex;
  span {
    padding: 0 40px;
    line-height: 45px;
    cursor: pointer 
  
  }
}
</style>
