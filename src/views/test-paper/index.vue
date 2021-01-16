<template>
  <template ref="headerRef">
    <HeaderRefComponent @type-change="query('type', $event)" @search="query('title', $event)" />
  </template>

  <div>
    <cus-condition
      :node-list="[
        { label: '年份', key: 'year' },
        { label: '年级', key: 'gradeId' },
        { label: '来源', key: 'source' },
      ]"
      @submit="$refs.listRef.request($event)"
    />

    <div class="cus-list">
      <cus-list ref="listRef" has-page url="/tiku/paper/queryPaperPage" :default="params" :auto-request="false">
        <template v-slot:avatar>
          <img src="/src/assets/test-paper/list-avatar.png" style="width: 86px" alt="爱学标品">
        </template>
        <template v-slot="{ data }">
          <div class="cus_content">
            <h1>{{ data.title }}</h1>
            <p>来源：<span class="cus_tag">{{ getSourceName(data.source) }}</span></p>
            <div>
              <div><span>题目数：{{ data.questionCount || 0 }}</span><span>下载次数：{{ data.downloadCount || 0 }}</span></div>
              <div><span>创建人：{{ data.creatorName }}</span><span>创建时间：{{ data.createTime }}</span></div>
            </div>
          </div>
        </template>
        <template v-slot:actions="{ data }">
          <div class="list__actions">
            <el-button type="text" @click="preview(data)"><i class="iconfont iconsearch-eye-line" /><span>预览</span></el-button>
            <el-button type="text" v-permissions="'update'" @click="update(data)" v-if="data.sourceFrom !== 3"><i class="iconfont iconfile-edit-line" /><span>编辑</span></el-button>
            <el-button v-permissions="'download'" type="text" @click="download(data)"><i class="iconfont icondayin" /><span>下载/打印</span></el-button>
            <el-popconfirm title="确定要删除此试卷吗？" confirmButtonText='确定' cancelButtonText='取消' @confirm="remove(data.id)">
              <template #reference>
                <el-button type="text" v-permissions="'delete'"><i class="iconfont iconshanchu" /><span>删除</span></el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </cus-list>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, Ref, onUnmounted } from 'vue';
import HeaderRefComponent from './components/header-ref.vue';
import emitter from './../../utils/mitt';
import axios from 'axios';
import { ElMessage, ElLoading } from 'element-plus'
import { AxResponse } from './../../core/axios';
import createElement from './../../utils/createElement';
import Modal from './../../utils/modal';
import Screen from './../../utils/screen';
import UpdateComponent from './update/index.vue';
import downloadComponent from './components/download.vue';

export default {
  components: { HeaderRefComponent },
  setup() {
    let headerRef = ref();
    onMounted(() => emitter.emit('slot', headerRef));

    let params: Ref<any> = ref({});
    setTimeout(() => {
      emitter.emit('effect', (id) => params.value.subjectId = id)
    });

    let listRef = ref();
    const query = (key, val) => {
      params.value[key] = val && val.value ? val.value : val;
      listRef.value.request(params.value);
    }

    const remove = async (id) => {
      let res = await axios.post<any, AxResponse>('/tiku/paper/deletePaper', { id });
      ElMessage[res.result ? 'success' : 'error'](res.result ? '删除成功' : res.msg);
      res.result && listRef.value.request();
    }

    const preview = (data) => {
      if (data.sourceFrom === 3) {
        const loading = ElLoading.service({ lock: true, background: 'rgba(255, 255, 255, .7)', text: '加载中...' })
        let src = `${import.meta.env.VITE_OFFICE_PREVIEW}?furl=${import.meta.env.VITE_DOMAIN}${data.filePath}`;
        let closeBtn = createElement('div', {
          className: 'el-icon-close',
          style: { width: '36px', height: '36px', lineHeight: '36px', textAlign: 'center', background: '#fff', borderRadius: '50%', fontSize: '24px', position: 'fixed', top: '40px', right: '40px', zIndex: '10', cursor: 'pointer' },
          on: { click: () => { container.remove(); } }
        });
        let iframe = createElement('iframe', { attrs: { src, width: '100%', height: '100%' }, style: { background: '#f9f9f9' } });
        iframe.onload = loading.close;
        let container = createElement('div', {
          style: { width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', zIndex: '9' },
        }, [ closeBtn, iframe ])
        document.body.appendChild(container);
      } else {
        update(data, true);
      }
    }

    const download = (data) => {
      //1:手动 2:智能 3:上传
      if (data.sourceFrom == 3) {
        window.open(`${import.meta.env.VITE_APP_BASE_URL}${data.filePath}`);
        axios.post<any, AxResponse>('/tiku/paper/countDownloadPaper', { paperId: data.id }).then(res => res.result && (data.downloadCount = res.json.downloadCount));
      } else {
        Modal.create({
          title: '下载试卷',
          width: 640,
          component: downloadComponent
        }).then((res: any) => {
          window.open(`${import.meta.env.VITE_APP_BASE_URL}/tiku/paper/downPaper?paperId=${ data.id }&type=${ res.type }&templateId=${ res.templateId }`);
          data.downloadCount++;
        });
      }
    }

    const update = (data, preview = false) => {
      window.open(`./#/test-paper-edit/${preview}/${data.id}`);
    }
    /* 监听新增试卷成功事件 */

    const addEventHandle = (e) => { update(e); listRef.value && listRef.value.request(); }
    emitter.on('add-test-paper-success', addEventHandle);
    onUnmounted(() => emitter.off('add-test-paper-success', addEventHandle))

    let sourceList: Ref<any[]> = ref([]);
    axios.post<null, AxResponse>('/system/dictionary/queryDictByCodes', { typeCodesStr: 'QUES_SOURCE' }).then(res => sourceList.value = res.json['QUES_SOURCE']);
    const getSourceName = (id): string => sourceList.value.find(i => i.id === id)?.name || '-';

    return { headerRef, listRef, params, query, remove, preview, download, update, getSourceName }
  }
}
</script>
<style lang="scss" scoped>
.list__actions {
  display: flex;
  .el-button {
    width: 60px;
    color: #382A74;
    font-weight: 550;
    &:not(:first-child) {
      margin-left: 30px;
    }
    &:hover {
      color: #1AAFA7;
    }
    i {
      display: block;
      margin-bottom: 12px;
      font-size: 24px;
    }
  }
}
.cus_content {
  h2 {
    margin-bottom: 10px;
  }
  p {
    color: #333;
    font-size: 12px;
    margin-bottom: 12px;
  }
  & > div {
    color: #77808D;
    font-size: 12px;
    line-height: 20px;
    span:first-child {
      display: inline-block;
      width: 114px;
    }
  }
}
.cus_tag {
  margin-right: 8px;
  padding: 3px 10px;
  color: #333;
  font-size: 12px;
  line-height: 20px;
  border-radius: 2px;
  background: rgba(250, 173, 20, .15);
}
</style>
