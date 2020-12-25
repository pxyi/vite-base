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
            let obj = {
              name: keys,
              count: res.json[keys],
              id: i,
              type: [],
              order: 0,
            };
            switch (keys) {
              case "allCount":
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
          fileTypeAndCount.sort((a, b) => a.order - b.order);
        }else{
           ElMessage.error(res.msg);
        }
        fileTypeAndCount.values = res.json;
        // console.log(res.json);
      });
  }
    getTabsList()

  emitter.emit('getTabsList',getTabsList)
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
    type:2
  };

  const getMaterialQueryPage = (item)=>{
     console.log(item);
     let params:any = Object.assign(pageParam)
    //  params.type = item.Type
     axios.post<any,AxResponse>(`admin/material/queryPage?size=${20}&current=${1}`,  params, { headers: { "Content-Type": "application/json", type: "1" } }).then(res=>{
       if(res.result){
         console.log(res);
       }
     })
      
  }

    const selectActive = (item) => {
      getMaterialQueryPage(item)
      activeId.value = item.id;
     
      // console.log(activeId);
    };

    return { fileTypeAndCount, activeId, selectActive };
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
</style>
