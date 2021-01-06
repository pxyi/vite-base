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
          {{ item.num }}
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
      <li
        v-for="(item, index) in contengList"
        :key="index"
        @mouseleave="mouseleaveisShow(item)"
      >
        <div class="thumbnailWrap">
          <img
            v-if ="item.ext !== 'mp3' && item.ext !== 'zip' && item.ext !== 'rar'"
            class="imgCover"
            :src="`/test${item.imgPath}`"
          />
          <img
            v-else
            src="../../../assets/images/icon_d44l6421sgu/weizhiwenjian.png"
          />
        </div>
        <p class="content-list-box-item-title">
          {{ item.fileName }}.{{ item.ext }}
        </p>
        <div
          class="changeTdOperation"
          v-show="item.isShow"
          @mouseleave="mouseleaveisShow(item)"
        >
          <span @click="aNewName(item)">重命名</span>
          <span @click="downLoad(item)">下载</span>
          <span @click="deleteClick(item)">删除</span>
          <div class="triangle"></div>
        </div>

        <div class="floating-layer">
          <div class="imageOperation" @click="changeTdOperation(item)"></div>
          <div class="btn-group">
            <div>
              <el-button size="mini" round  @click="preview(item)">
                <img src="../../../assets/images/previewIcon.png"  />预览
              </el-button>
            </div>
            <div>
              <el-button size="mini" round @click="prepareLessons(item)">添加到备课</el-button>
            </div>
          </div>
        </div>
      </li>
       <cus-empty v-if="contengList.length<1"/>
    </ul>

  </div>

</template>

<script lang="ts">
import { ref, reactive, Ref } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import Modal from "../../../utils/modal";
import { ElMessage, ElLoading, ElDialog } from "element-plus";
import createElement from '../../../utils/createElement'
import NewName from './new-name.vue'
import Prepare from './prepare-lessons.vue'
import { emit } from 'process';

export default {
  setup(props, context) {
    let activeId = ref(0);
    let params = reactive({
      subject: "chinese3",
      chapterId: [],
      isPublic: 1,
    });

     let fileTypeAndCount = ref([
      { name: '全部', nameKey: 'totalCount', num: 0, type: null ,id:0}, 
      { name: '课件', nameKey: 'courseWareCount', num: 0, type: 1 ,id:1}, 
      { name: '讲义', nameKey: 'handoutCount', num: 0, type: 2 ,id:3}, 
      { name: '标准教案', nameKey: 'teachplanCount', num: 0, type: 5,id:4 }, 
      { name: '说课视频', nameKey: 'mediaCount', num: 0, type: 3 ,id:5},
      { name: '其他', nameKey: 'otherCount', num: 0, type: 4 ,id:6},
    ])
        const tabCountRequest = async() => {
      let res = await  axios.post<any, AxResponse>("/admin/material/queryCountByType", params, {headers: { "Content-Type": "application/json"}})
      if(res.result) {
        let arr = Object.entries(res.json)
        arr.map (( [key, value] ) => {
          fileTypeAndCount.value.map( ( item: any ) => {
            if( item.nameKey == key ) {
              item.num = value
            }
          })
          
        })
      }
    }
    tabCountRequest()
    
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
      type: null,
    };
    let contengList = ref({});
    const getMaterialQueryPage = async () => {
      let params: any = Object.assign(pageParam);
      context.emit("tableEmit", params);
      let res: AxResponse = await axios.post(
        `admin/material/queryPage?size=${params.size}&current=${params.current}`,
        pageParam,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log(res.json.records.length)
      contengList.value = res.json.records;
      context.emit('getMaterialQueryPage',)
    };
    getMaterialQueryPage();
    
    let isShow = ref();
    const mouseleaveisShow = (item) => {
      item.isShow = false;
    };
    const changeTdOperation = (item) => {
      item.isShow = !item.isShow;
    };
    const deleteClick = (item) => {
      let { id } = item;
      axios
        .post<any, AxResponse>(`admin/material/deleteById/${id}`)
        .then((res) => {
          if (res.result) {
            ElMessage[res.result ? "success" : "error"](
              res.result ? "删除成功" : res.msg
            );
            getMaterialQueryPage();
       
        //  getTabsList()
          }
        });
    };
 
    const aNewName = (item) => {
      // console.log(item.fileName);
      Modal.create({ title: '重命名', width: 640, component: NewName, props: { newName:item } }).then(res=>{
      if(res){
         getMaterialQueryPage()
      }
      })
    };
    const prepareLessons = (item)=>{
      console.log(item);
       Modal.create({ title: '添加到备课', width: 640, component: Prepare, props: { prepareLessons:item } })
    }

      /*-----预览-----*/
    const preview = (item) => {
      const loading = ElLoading.service({ lock: true, background: 'rgba(255, 255, 255, .7)', text: '加载中...' })
      let src = `${import.meta.env.VITE_OFFICE_PREVIEW}?furl=${import.meta.env.VITE_DOMAIN}${item.filePath}`;
      let closeBtn = createElement('div', { 
        className: 'el-icon-close', 
        style: { width: '36px', height: '36px', lineHeight: '36px', textAlign: 'center', background: '#fff', borderRadius: '50%', fontSize: '24px', position: 'fixed', top: '40px', right: '40px', zIndex: '10', cursor: 'pointer' },
        on: { click: () => { container.remove(); } }
      });
      // 打印
      let printData = createElement('div', { 
        className: 'el-icon-printer', 
        style: { width: '36px', height: '36px', lineHeight: '36px', textAlign: 'center', background: '#fff', borderRadius: '50%', fontSize: '24px', position: 'fixed', bottom: '40px', right: '40px', zIndex: '10', cursor: 'pointer' },
        on: { click: () => { window.print() } }
      });
      //下载
      let downloadData = createElement('div', { 
        className: 'el-icon-download', 
        style: { width: '36px', height: '36px', lineHeight: '36px', textAlign: 'center', background: '#fff', borderRadius: '50%', fontSize: '24px', position: 'fixed', bottom: '100px', right: '40px', zIndex: '10', cursor: 'pointer' },
         on: { click: () => { window.open(`${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`) } }
      });
      let iframe = createElement('iframe', { attrs: { src, width: '100%', height: '100%' }, style: { background: '#f9f9f9' } });
      iframe.onload = loading.close;
      let container = createElement('div', { 
        style: { width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: '1000' },
      }, [ closeBtn, iframe, printData, downloadData ])
      document.body.appendChild(container);
    }
       const downLoad = (item) => {
       window.open(`${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`)  
    };
     
    const selectActive = (item) => {
      
      pageParam.type = item.type;
      getMaterialQueryPage();
      activeId.value = item.id;
      // console.log(activeId);
    };

    return {
      fileTypeAndCount,
      activeId,
      selectActive,
      contengList,
      mouseleaveisShow,
      changeTdOperation,
      deleteClick,
      aNewName,
      downLoad,
      preview,
      prepareLessons,
      tabCountRequest
    };
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
  width: 880px;
  .tableMain {
    position: relative;
    > li {
      width: 160px;
      height: 148px;
      border-radius: 4px;
      float: left;
      margin-right: 19px;
      margin-top: 24px;
      // box-shadow: 2px 2px 4px grey;
      margin: 14px 8px;
      position: relative;
      list-style: none;
      .thumbnailWrap {
        margin: 12px auto 8px;
        overflow: hidden;
        width: 117px;
        height: 87px;
        // box-shadow: 1px 1px 2px grey;
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
        // overflow: hidden;
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
    cursor: pointer;
  }
}
</style>
