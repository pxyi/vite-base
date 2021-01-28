<template>
  <div>
    <div class="tabs-box">
      <div class="tab-cell"
        :class="{ active: formGroup.type === n.type }"
        v-for="n in typeList" :key="n.type"
        @click="formGroup.type = n.type; request(false)"
      ><div><span>{{ n.name }}</span><i>{{ n.count }}</i></div></div>
    </div>
    <div class="content">
      <el-skeleton :loading="loading">
        <div class="title">
          <div @click="sortHandle(1)">
            <span>文件名</span><i v-show="formGroup.order === 1" :class="['iconfont', formGroup.orderType ? 'iconpaixu-shang1' : 'iconpaixu-xia']" />
          </div>
          <div @click="sortHandle(2)">
            <span>上传时间</span><i v-show="formGroup.order === 2" :class="['iconfont', formGroup.orderType ? 'iconpaixu-shang1' : 'iconpaixu-xia']" />
          </div>
        </div>
        <div class="box" v-if="dataset.length">
          <div class="cell" v-for="data in dataset" :key="data.id">
            <div class="cover"><el-image :src="`${filePathBase}${data.imgPath}`" fit="cover"></el-image></div>
            <p><i v-if="data.isPublic === 0 && data.creatorId === userId">【个人库】</i>{{ data.fileName }}</p>
            <div class="mask">
              <el-dropdown placement="bottom-end" trigger="click" @command="cellHandle($event, data)">
                <i class="el-icon-more" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="rename"><div v-permissions="'rename'">重命名</div></el-dropdown-item>
                    <el-dropdown-item command="remove"><div v-permissions="'delete'">删除</div></el-dropdown-item>
                    <el-dropdown-item command="download"><div v-permissions="'download'">下载</div></el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div class="btns">
                <div @click="preview(data)"><i class="el-icon-search"/><span>预览</span></div>
                <div @click="addLesson(data.id)" v-permissions="'addToCourse'"><span>添加到备课</span></div>
              </div>
            </div>
          </div>
        </div>
        <cus-empty v-else />

        <el-pagination
          v-model:current-page="formGroup.current"
          v-model:page-size="formGroup.size"
          :total="formGroup.total"
          @current-change="request(false)"
          hide-on-single-page
          layout="prev, pager, next"
        />
      </el-skeleton>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, Ref, reactive } from 'vue';
import axios from 'axios';
import { AxResponse } from '/@/core/axios';
import { ElMessage, ElLoading } from 'element-plus';
import $, { emitter } from '$';
import Modal from '/@/utils/modal';
import LessonComponent from './lesson.vue';
import { useStore } from 'vuex';

export default {
  setup() {
    let store = useStore();

    let dataset = ref([]);
    let loading = ref(true);
    let filePathBase = import.meta.env.VITE_APP_BASE_URL;
    let userId = store.getters.userInfo.user.id;

    let formGroup = reactive({
      type: null,
      fileName: null,
      chapterId: [],
      current: 1,
      size: 30,
      total: 0,
      subject: null,
      order: 1,
      orderType: 0,
    })
    let typeList: Ref<any[]> = ref([
      { name: '全部', key: 'allCount', count: 0, type: null },
      { name: '课件', key: 'courseWareCount', count: 0, type: 1 },
      { name: '讲义', key: 'handoutCount', count: 0, type: 2 },
      { name: '标准教案', key: 'teachplanCount', count: 0, type: 5 },
      { name: '说课视频', key: 'mediaCount', count: 0, type: 3 },
      { name: '其他', key: 'otherCount', count: 0, type: 4 },
    ]);

    const request = async (reset = true) => {
      loading.value = true;
      let list = [ axios.post<null, AxResponse>('/admin/material/queryPage', { ...formGroup, isPublic: 1 },{ headers: { 'Content-Type': 'application/json' } }) ];
      reset && list.push(axios.post<null, AxResponse>('/admin/material/queryCountByType', { ...formGroup, isPublic: 1 },{ headers: { 'Content-Type': 'application/json' } }));
      let results = await Promise.all(list);
      if (reset) {
        typeList.value = typeList.value.map(item => { item.count = results[1].json[item.key]; return item; });
        typeList.value[0].count = typeList.value.reduce((n, i) => {n += i.count || 0; return n}, 0);
      }
      dataset.value = results[0].json.records;
      formGroup.total = results[0].json.total;
      loading.value = false;
    }
    emitter.emit('effect', (subject) => { formGroup.subject = subject; request(); });
    emitter.on('dataset-reset', () => request());

    const cellHandle = (type, data) => {
      let map = {
        async remove() {
          let res = await axios.post<null, AxResponse>(`/admin/material/deleteById/${data.id}`);
          ElMessage[res.result ? 'success' : 'warning'](res.result ? '删除文件成功~!' : res.msg);
          res.result && request();
        },
        async rename() {
          let fileName = (await Modal.create({
            title: '重命名',
            width: 480,
            props: {
              nodes: [{ label: '资料名称', key: 'fileName', type: 'input', default: data.fileName, rule: { required: true, message: '请输入资料名称' } }]
            }
          }) as any).fileName;
          let res = await axios.post<null, AxResponse>('/admin/material/saveOrUpdate', { id: data.id, fileName });
          ElMessage[res.result ? 'success' : 'warning'](res.result ? '修改名称成功~!' : res.msg);
          res.result && request();
        },
        download() {
          $.element('a', {attrs: {href: `${import.meta.env.VITE_APP_BASE_URL}${data.filePath}`, download: `${data.fileName}.${data.ext}`}}).click();
        }
      };
      map[type](data);
    }
    const sortHandle = (order) => {
      formGroup.order = order;
      formGroup.orderType = Number(!formGroup.orderType);
      request(false);
    }

    let allowPath = store.getters.userInfo.roles.reduce((path, role) => path += role.menuUrls, '');
    const preview = (item) => {
      if(item.mediaType === 'url') {
        window.open(item.filePath)
      }else{
        const loading = ElLoading.service({ lock: true, background: 'rgba(255, 255, 255, .7)', text: '加载中...' })
        let src = `${import.meta.env.VITE_APP_OFFICE_WEB365}furl=${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`;
        let closeBtn = $.element('div', {
          className: 'el-icon-close',
          style: { width: '36px', height: '36px', lineHeight: '36px', textAlign: 'center', background: '#fff', borderRadius: '50%', fontSize: '24px', position: 'fixed', top: '40px', right: '40px', zIndex: '10', cursor: 'pointer' },
          on: { click: () => { container.remove(); } }
        });
        // 打印
        let printData = $.element('div', allowPath.includes(`/teaching/database#print`) ? {
          className: 'el-icon-printer',
          style: { width: '36px', height: '36px', lineHeight: '36px', textAlign: 'center', background: '#fff', borderRadius: '50%', fontSize: '24px', position: 'fixed', bottom: '40px', right: '40px', zIndex: '10', cursor: 'pointer' },
          on: { click: () => { window.open(`${import.meta.env.VITE_APP_OFFICE_WEB365}info=2&furl=${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`) } }
        } : {});
        //下载
        let downloadData = $.element('div', allowPath.includes(`/teaching/database#download`) ? {
          className: 'el-icon-download',
          style: { width: '36px', height: '36px', lineHeight: '36px', textAlign: 'center', background: '#fff', borderRadius: '50%', fontSize: '24px', position: 'fixed', bottom: '100px', right: '40px', zIndex: '10', cursor: 'pointer' },
          on: { click: () => { let a = $.element('a', { attrs:{ target: '_blank' } }) as HTMLAnchorElement; a.download = item.fileName+'.'+item.ext;a.href = `${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`;a.click(); } }
        } : {});
        let container;
        if(item.ext === 'mp4') {
          let video = $.element('video',
          { attrs: { src:`${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`, width: '100%', height: '100%',controls: true, controlsList: "nodownload" }, style: { background: '#f9f9f9' }});
          video.oncanplay = loading.close;
          container = $.element('div', {
            style: { width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: '1000' , background: 'rgba(0,0,0,.8)'},
          }, [ closeBtn, video, downloadData ])
        }else if(item.ext === 'mp3') {
          let video = $.element('video',
          { attrs: { src:`${import.meta.env.VITE_APP_BASE_URL}${item.filePath}`, width: '', height: '',controls: true, controlsList: "nodownload" }, style: { background: '#333', position:'absolute', top: '50%', left: '50%', transform:'translate(-50%,-50%)'}});
          video.oncanplay = loading.close;
          container = $.element('div', {
            style: { width: '100%', height: '100%', background: 'rgba(0,0,0,.8)', position: 'absolute', top: '0', left: '0', zIndex: '1000' },
          }, [ closeBtn, video, downloadData ])
        } else if(item.ext === 'ppt'||item.ext==='pptx'||item.ext==='doc'||item.ext==='docx'||item.ext==='pdf') {
          let iframe = $.element('iframe', { attrs: { src, width: '100%', height: '100%' }, style: { background: '#f9f9f9' } });
          iframe.onload = loading.close;
          container = $.element('div', {
            style: { width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: '1000', background: 'rgba(0,0,0,.8)' },
          }, [ closeBtn, iframe, downloadData,printData ])
        }else if(item.ext==='zip'||item.ext==='rar'||item.ext==='png'||item.ext==='jpeg'||item.ext==='jpg') {
          let iframe = $.element('iframe', { attrs: { src, width: '100%', height: '100%' }, style: { background: '#f9f9f9' } });
          iframe.onload = loading.close;
          container = $.element('div', {
            style: { width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: '1000', background: 'rgba(0,0,0,.8)' },
          }, [ closeBtn, iframe, downloadData ])
        }
        container && document.body.appendChild(container);
      }
    }

    const addLesson = (id) => {
      Modal.create({
        title: '添加到备课',
        width: 520,
        component: LessonComponent,
        props: { id }
      })
    }

    return { typeList, formGroup, request, loading, dataset, cellHandle, preview, addLesson, filePathBase, sortHandle, userId }
  }
}
</script>

<style lang="scss" scoped>
.tabs-box {
  display: flex;
  .tab-cell {
    height: 50px;
    padding: 0 10px 0 20px;
    margin-right: 18px;
    line-height: 50px;
    box-shadow: 0 -2px 6px 0 rgba(91,125,255,.08);
    position: relative;
    cursor: pointer;
    &.active {
      &::before {
        z-index: 1;
      }
      i {
        color: #fff;
        background: #FAAD14;
      }
    }
    & > div {
      white-space: nowrap;
      position: relative;
      z-index: 2;
      i {
        display: inline-block;
        height: 20px;
        padding: 0 10px;
        margin-left: 10px;
        color: #77808D;
        line-height: 20px;
        border-radius: 10px;
        background: #E0E1E6;
      }
    }
    &::before {
      content: '';
      border-bottom: none;
      background: #fff;
      box-shadow: 0 -2px 6px 0 rgba(91,125,255,.08);
      transform: perspective(1em) scale(1.3,1.35) rotateX(5deg);
      transform-origin: bottom left;
      border-radius: 6px 6px 0 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
}
.content {
  padding: 20px 10px;
  background: #fff;
  box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
  .title {
    display: flex;
    padding: 0 30px;
    line-height: 46px;
    background: #EBECF0;
    & > div {
      margin-right: 48px;
      cursor: pointer;
      &:hover i {
        color: #1AAFA7;
      }
      i {
        color: #7D8693;
        font-size: 18px;
        vertical-align: bottom;
      }
    }
  }
  .box {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    .cell {
      width: 140px;
      padding: 10px;
      margin: 0 10px 10px 0;
      position: relative;
      .cover {
        height: 104px;
        margin-bottom: 6px;
        background: #D8D8D8;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        :deep(.el-image) {
          width: 100%;
          height: 100%;
        }
      }
      & > p {
        text-align: center;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        i {
          color: #1AAFA7;
        }
      }
      .mask {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        background: rgba($color: #000, $alpha: .15);
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        transition: all .25s;
        :deep(.el-dropdown) {
          position: absolute;
          top: 5px;
          right: 5px;
        }
        .el-icon-more {
          display: inline-block;
          width: 16px;
          color: #999;
          line-height: 16px;
          text-align: center;
          background: #fff;
          border-radius: 2px;
          cursor: pointer;
          transform: rotateZ(90deg);
        }
        .btns {
          width: 84px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
          div {
            color: #1AAFA7;
            font-size: 12px;
            line-height: 24px;
            text-align: center;
            border-radius: 12px;
            background: #fff;
            cursor: pointer;
            &:last-child {
              margin-top: 10px;
            }
            &:active {
              opacity: .8;
            }
            i {
              font-weight: bold;
              margin-right: 3px;
            }
          }
        }
      }
      &:hover {
        .mask {
          opacity: 1;
        }
      }
    }
  }
}
</style>
