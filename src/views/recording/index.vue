<template>
  <div>
    <template ref="headerRef">
      <HeaderComponent @reset="$refs.tableRef.request()" />
    </template>
    <cus-table ref="tableRef" url="/admin/questionImportLog/queryPageV2" :auto-request="false">
      <el-table-column prop="fileName" label="文件名称">
        <template #default="{ row }">
          <div class="file-name">
            <img src="/@/assets/file-icon.png" alt="爱学标品">
            <div>{{ row.fileName }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="上传人" width="100" />
      <el-table-column prop="createTime" label="上传时间" width="180" />
      <el-table-column prop="status" label="解析状态" width="160">
        <template #default="{ row }">
          <span :class="[`i_status-${row.status}`]">{{ row.status === 0 ? '解析中' : row.status === 1 ? '解析失败' : row.status === 2 ? '解析成功' : row.status === 3 ? '导入失败' : '导入成功' }}</span>
          <el-popover :width="240" trigger="hover">
            <template #reference v-if="row.status === 1 || row.status === 3"><i class="el-icon-question" /></template>
            <template #default>
              <span v-html="row.failReason"></span>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <div class="btns">
            <el-button type="text" @click="setting(row.id)">设置标签</el-button>
            <el-popconfirm title="确定删除此记录吗？" confirmButtonText="确定" cancelButtonText="取消" @confirm="deleteRecord(row.id)">
              <template #reference>
                <el-button type="text">删除记录</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </cus-table>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { AxResponse } from './../../core/axios';
import { ElMessage } from 'element-plus';
import Screen from './../../utils/screen';
import UpdateComponent from './components/update.vue';
import HeaderComponent from './components/header.vue';
import emitter from './../../utils/mitt';

export default {
  components: { HeaderComponent },
  setup() {
    let tableRef = ref();

    let headerRef = ref();
    onMounted(() => emitter.emit('slot', headerRef));

    const deleteRecord = async (id) => {
      let res = await axios.post<null, { result }>(`/admin/questionImportLog/deleteById/${id}`);
      ElMessage[res.result ? 'success' : 'warning'](res.result ? '删除成功' : '操作失败');
      res.result && tableRef.value.request();
    }

    onMounted(() => emitter.emit('effect', (subjectId) => tableRef.value.request({ subjectId }) ) );

    const setting = async (id) => {
      Screen.create(UpdateComponent, { id })
    }

    return { deleteRecord, tableRef, setting, headerRef }
  }
}
</script>

<style lang="scss" scoped>
.file-name {
  display: flex;
  img {
    width: 42px;
    margin-left: 10px;
    vertical-align: middle;
    margin-right: 10px;
  }
}
.btns {
  button:last-child {
    color: #382A74;
    margin-left: 40px;
  }
}
[class^=i_status-] {
  &.i_status-0 {
    color: 999;
  }
  &.i_status-1 {
    color: #F8662F;
  }
  &.i_status-2 {
    color: #409eff;
  }
  &.i_status-3 {
    color: #f56c6c;
  }
  &.i_status-4 {
    color: #19aea6;
  }
}
.el-icon-question {
  margin-left: 4px;
  color: #bbb;
}
</style>
