<template>
  <div>
    <template ref="headerRef">
      <HeaderComponent @reset="$refs.tableRef.request()" />
    </template>
    <cus-table ref="tableRef" url="/admin/questionImportLog/queryPageV2" :auto-request="false">
      <el-table-column prop="fileName" label="文件名称" min-width='400'>
        <template #default="{ row }">
          <div class="file-name">
            <img src="/src/assets/file-icon.png" alt="爱学标品">
            <div>{{ row.fileName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="上传人"  width="130"/>
      <el-table-column prop="createTime" label="上传时间" width="180"/>
      <el-table-column prop="status" label="解析状态" width="160">
        <template #default="{ row }">
          <div class="i_status">
            <div :class="[`i_status-${row.status}`]">
              <i class="icon-dot"></i>
              <span>{{ row.status === 0 ? '解析中' : row.status === 1 ? '解析完成' : row.status === 2 ? '解析成功' : row.status === 3 ? '导入失败' : '导入成功' }}</span>
            </div>
            <el-popover :width="160" trigger="hover">
              <template #reference v-if="row.status === 1 || row.status === 3"><i class="iconfont iconyuanyin i-question" /></template>
              <template #default>
                <div style="max-height: 250px; overflow: auto">
                  <span v-html="row.failReason"></span>
                </div>
              </template>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <div class="btns">
            <el-button type="text" @click="setting(row)">设置标签</el-button>
            <el-button type="text" @click="deleteRecord(row.id)">删除记录</el-button>
          </div>
        </template>
      </el-table-column>
    </cus-table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import Screen from '/@/utils/screen';
import UpdateComponent from './components/update.vue';
import HeaderComponent from './components/header.vue';
import { emitter } from '$';

export default {
  components: { HeaderComponent },
  setup() {
    let tableRef = ref();

    let headerRef = ref();
    onMounted(() => emitter.emit('slot', headerRef));

    const deleteRecord = (id) => {
      ElMessageBox.confirm('确定删除此记录吗？删除记录后题目也会全部删除', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(async _ => {
        let res = await axios.post<null, { result }>(`/admin/questionImportLog/deleteById/${id}`);
        ElMessage[res.result ? 'success' : 'warning'](res.result ? '删除成功' : '操作失败');
        res.result && tableRef.value.request();
      }).catch(_ => {});
    }

    onMounted(() => emitter.emit('effect', (subjectId) => tableRef.value.request({ subjectId }) ) );

    const setting = async (data) => {
      Screen.create(UpdateComponent, { id: data.id, title: data.fileName }).then(() => tableRef.value.request());
    }

    return { deleteRecord, tableRef, setting, headerRef }
  }
}
</script>

<style lang="scss" scoped>
.cus__table__container {
  padding: 5px 10px 40px;
}
.file-name {
  display: flex;
  color: #333;
  img {
    width: 42px;
    margin-left: 10px;
    vertical-align: middle;
    margin-right: 10px;
  }
  div{
    display: flex;
    align-items: center;
  }
}
.btns {
  button:last-child {
    color: #382A74;
    margin-left: 40px;
  }
}
.i_status{
  display: flex;
  justify-content: flex-start;
}
.icon-dot{
  display: inline-block;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  margin: 0 4px 3px 0;
}
.i-question{
  color: #C0C4CC;
  margin-left: 3px;
}
[class^=i_status-] {
  &.i_status-0 {
    width: 90px;
    color: #999;
    background: #FFEFEB;
    padding-left: 11px;
    .icon-dot{
      border: 1px solid  #999;
      background: #999;
    }
  }
  &.i_status-1 {
    width: 90px;
    color: #FC514F;
    background: #FFEFEB;
    padding-left: 11px;
    .icon-dot{
      border: 1px solid #FC514F;
      background: #FC514F;
    }
  }
  &.i_status-2 {
    width: 90px;
    color: #74C874;
    background: #F2F2F2;
    padding-left: 11px;
    .icon-dot{
      border: 1px solid #74C874;
      background: #74C874;
    }
  }
  &.i_status-3 {
    width: 90px;
    color: #FC514F;
    background: #FFEFEB;
    padding-left: 11px;
    .icon-dot{
      border: 1px solid #FC514F;
      background: #FC514F;
    }
  }
  &.i_status-4 {
    width: 90px;
    color: #74C874;
    background: #F2F2F2;
    padding-left:11px;
    .icon-dot{
      border: 1px solid #74C874;
      background: #74C874;
    }
  }
}
.el-icon-question {
  margin-left: 4px;
  color: #bbb;
}
:deep(.el-table thead){
  color: #77808d;
}
</style>
