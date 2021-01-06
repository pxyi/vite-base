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
    <div class="order">
     <span @click="fileOder(1)">文件名 <i class="el-icon-bottom " v-if="flag"></i> <i class="el-icon-top " v-else></i></span>
      <span @click="timeOder(2)">上传时间 <i class="el-icon-bottom" v-if="flags"></i> <i class="el-icon-top " v-else></i></span>
      <!-- <span>引用次数<i class="el-icon-bottom"></i></span> -->
    </div>
  </div>
  <div class="right-content">
    <ul class="tableMain">

      <li
        v-for="(item, index) in contengList"
        :key="index"
        @mouseleave="mouseleaveisShow(item)"
        :title="`${item.fileName}.${item.ext}`"
      >
        <div class="thumbnailWrap">
          <img
            v-if ="item.ext !== 'mp3' && item.ext !== 'zip' && item.ext !== 'rar'&&item.ext !== 'ppt'"
            class="imgCover"
            :src="`${domain}${item.imgPath}`"
          />
          <img
            v-else
            src="../../../assets/resource-base/icon_d44l6421sgu/weizhiwenjian.png"
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
                <img src="../../../assets/resource-base/previewIcon.png"  />预览
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
       <div class="clearfloat"></div>
       <div class="paginationFY">
            <el-pagination
              background
              layout="prev, pager, next"
              :hide-on-single-page='true'
              :total="pageParam.total"
              :page-size="pageParam.size"
              @current-change="changeCurrent"
            >
            </el-pagination>
          </div>
  </div>

</template>

<script lang="ts">
import { ref, reactive, Ref ,computed, onMounted, watch} from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { AxResponse } from "../../../core/axios";
import emitter from "../../../utils/mitt";
import Modal from "../../../utils/modal";
import { ElMessage, ElLoading, ElDialog } from "element-plus";
import createElement from '../../../utils/createElement'
import OrganizingPapers from './organizing-papers.vue'
import NewName from './new-name.vue'
import Prepare from './prepare-lessons.vue'
import { emit } from 'process';

export default {
  setup(props, context) {
    let domain = import.meta.env.VITE_DOMAIN;
   let activeId = ref(0);
    emitter.on('search',(searchText)=>{
      pageParam.fileName = searchText.value
      tabCountRequest()
      getMaterialQueryPage()

    })

    emitter.on('clearInput',(clearInput)=>{
       getMaterialQueryPage()
    })
     emitter.on('uploadInfoSure',()=>{
       tabCountRequest()
       getMaterialQueryPage()
    })

    let activeName = ref('totalCount');
     let fileTypeAndCount = ref([
      { name: '全部', nameKey: 'allCount', count: 0, type: null ,       id:0},
      { name: '课件', nameKey: 'courseWareCount', count: 0, type: 1 ,   id:1},
      { name: '讲义', nameKey: 'handoutCount', count: 0, type: 2 ,      id:2},
      { name: '标准教案', nameKey: 'teachplanCount', count: 0, type: 5, id:3},
      { name: '说课视频', nameKey: 'mediaCount', count: 0, type: 3 ,    id:4},
      { name: '其他', nameKey: 'otherCount', count: 0, type: 4 ,        id:5},
    ])
 let pageParam: any = reactive({
      current: 1,
      size: 20,
      chapterId: [],
      isPublic: 1,
      lastLevelId: [],
      ext: null,
      fileName: '',
      courseId: "",
      subject: '',
      type: null,
      total:0
    });
    const tabCountRequest = () => {
    emitter.emit("effect",async (id) => {
    pageParam.subject = id
      let res = await  axios.post<any, AxResponse>("/admin/material/queryCountByType", pageParam, {headers: { "Content-Type": "application/json"}})
      if(res.result) {
         res.json.allCount = eval(Object.values(res.json).join("+"));
        let arr = Object.entries(res.json)
        arr.map (( [key, value] ) => {
          fileTypeAndCount.value.map( ( item: any ) => {
            if( item.nameKey == key ) {
              item.count = value
            }
          })
        })
      }
    })
    }
    // tabCountRequest()
     let flag = ref(false)
     const fileOder = (order)=>{
       console.log(pageParam.total);
       if(pageParam.total!==0){
      if(pageParam.orderType===0){
        flag.value = false
        getMaterialQueryPage()
        pageParam.orderType=1
         pageParam.order=1
        // console.log(pageParam.orderType);
      }else{
        flag.value = true
         pageParam.order=1
         getMaterialQueryPage()
          pageParam.orderType=0
        // console.log(pageParam.orderType);
      }
       }
     
     }
     let flags = ref(false)
      const timeOder = (order)=>{
        if(pageParam.total!==0){
      if(pageParam.orderType===0){
        flags.value = false
        getMaterialQueryPage()
        pageParam.orderType=1
         pageParam.order=2
        // console.log(pageParam.orderType);
      }else{
        flags.value = true
         pageParam.order=2
         getMaterialQueryPage()
          pageParam.orderType=0
        // console.log(pageParam.orderType);
      }
        }
     
     }
     let chapterId = []
     emitter.on('check-change',(target)=>{
      //  chapterId.splice(target.id)
      //  console.log(target.id);
      // console.log( pageParam.chapterId);
      // pageParam.chapterId.map((item,index,arr)=>{
      //   if(item===target.id){
      //    pageParam.chapterId.splice(index, 1)
      //   } else {
      //     pageParam.chapterId.push(target.id)
      //   }
      // })
      // console.log(target.id);
      // pageParam.chapterId.values = target.id
      let index = pageParam.chapterId.findIndex(i => i === target.id);
      if( index !== -1 ) {
        pageParam.chapterId.splice(index, 1)
      } else {
        pageParam.chapterId.push(target.id);
      }
      getMaterialQueryPage();
      tabCountRequest()
     
    })


    let contengList = ref({});
    const getMaterialQueryPage = async () => {
      // let pageParam: any = Object.assign(pageParam);
      context.emit("tableEmit", pageParam);
      let res: AxResponse = await axios.post(
        `admin/material/queryPage?size=${pageParam.size}&current=${pageParam.current}`,
        pageParam,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      contengList.value = res.json.records;
      // console.log( contengList.value);

      pageParam.total = res.json.total
    };
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
           tabCountRequest()
          }
        });
    };

      // 切换分页
  const  changeCurrent = (value: number)=> {
    console.log(value);

    pageParam.current = value;
    getMaterialQueryPage()
  }

    const aNewName = (item) => {
      // console.log(item.fileName);
      Modal.create({ title: '重命名', width: 640, component: NewName, props: { newName:item } }).then(res=>{
        if(res){
          getMaterialQueryPage()
        }
      })
      
    };
    const prepareLessons = (item)=>{
       Modal.create({ title: '添加到备课', width: 560, component: Prepare, props: { prepareLessons:item } })
    }
    const downLoad = (item) => {
      createElement('a', {attrs: {href: `${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`, download: `${item.fileName}`}}).click();
      // window.open(`${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`)
    };

    /*-----预览-----*/
    const preview = (item) => {
      if(item.mediaType === 'url') {
        window.open(item.filePath)
      }else{
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
          on: { click: () => { let a  = document.createElement('a');a.download = item.fileName+'.'+item.ex;a.href = `${import.meta.env.VITE_DOMAIN}${item.filePath}`;a.click(); } }

        }); 
        let container;
        if(item.ext === 'mp4') {
          let video = createElement('video',
          { attrs: { src:`${import.meta.env.VITE_DOMAIN}${item.filePath}`, width: '100%', height: '100%',controls: true, controlsList: "nodownload" }, style: { background: '#f9f9f9' }});
          video.oncanplay = loading.close;
          container = createElement('div', { 
            style: { width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: '1000' , background: 'rgba(0,0,0,.8)'},
          }, [ closeBtn, video, printData, downloadData ])
        }else if (item.ext === null && item.mediaType === 'url'){
          loading.close()
          let url = createElement('p', { style: { background: '#f9f9f9', width: '100%', height: '100%', padding: '36px', 'font-size':'20px' }}, '链接地址：' + item.filePath);
          container = createElement('div', { 
            style: { width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: '1000' , background: 'rgba(0,0,0,.8)'},
          }, [ closeBtn, url, printData, downloadData ])
        }else if(item.ext === 'mp3') {
          let video = createElement('video', 
          { attrs: { src:`${import.meta.env.VITE_DOMAIN}${item.filePath}`, width: '', height: '',controls: true, controlsList: "nodownload" }, style: { background: '#333', position:'absolute', top: '50%', left: '50%', transform:'translate(-50%,-50%)'}});
          video.oncanplay = loading.close;
          container = createElement('div', { 
            style: { width: '100%', height: '100%', background: 'rgba(0,0,0,.8)', position: 'absolute', top: '0', left: '0', zIndex: '1000' },
          }, [ closeBtn, video, downloadData ])
        }else {
          let iframe = createElement('iframe', { attrs: { src, width: '100%', height: '100%' }, style: { background: '#f9f9f9' } });
          iframe.onload = loading.close;
          container = createElement('div', { 
            style: { width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: '1000', background: 'rgba(0,0,0,.8)' },
          }, [ closeBtn, iframe, printData, downloadData ])
        }
        document.body.appendChild(container);
      }
    }
    //    const downLoad = (item) => {
    //    window.open(`${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`)
    // };


    const selectActive = (item) => {
      pageParam.type = item.type;
      activeId.value = item.id;
      getMaterialQueryPage();
      // pageParam.chapterId = target.id
      tabCountRequest()
      // console.log(activeId);
    };
    emitter.emit("effect", (id) => {
    pageParam.subject = id
     getMaterialQueryPage()
     tabCountRequest()
    })
    return {
      fileOder,
      timeOder,
      flags,
      flag,
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
      domain,
      pageParam,
      changeCurrent
    };
  },
};
</script>

<style lang="scss" scoped>
.tab {
  nav {
    // background-color: #f4f5f9;
    // width: 100%;
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
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        line-clamp: 2;
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
        background: url("../../../assets/resource-base/icon_d44l6421sgu/caozuo.png")
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
        border-radius: 5px;
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
          border-radius: 5px;
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
.order {
  background-color: #ebecf0;
  height: 46px;
  margin-top: 20px;
  display: flex;
  margin-left: 15px;
  span {
    padding: 0 40px;
    line-height: 45px;
    cursor: pointer;
  }

}
.clearfloat{clear:both}
.paginationFY {
        float: right;
      }
</style>
