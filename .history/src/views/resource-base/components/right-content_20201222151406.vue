<template>
    <div class="right-content">
   <ul class="tableMain">
              <li
                v-for="(item, index) in tableData"
                :key="index"
                @mouseleave="mouseleaveisShow(item)"
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
                <!-- <p class="dataName">{{item.fileName}} -->
                <!-- <el-input
                    @blur="renameBlur(item)"
                    size="small"
                    v-if="item.renameBol"
                    v-model="item.fileName"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 2}"
                    placeholder="请输入内容"
                    style="width: 70%;max-height:50px"
                  ></el-input> -->
                <p class="content-list-box-item-title">
                  {{ item.fileName }}.{{ item.ext }}
                </p>
                <!-- </p> -->

                <div
                  class="changeTdOperation"
                  v-show="item.isShow"
                  @mouseleave="mouseleaveisShow(item)"
                >
                  <span @click="handleClick(item, 1)">重命名</span>
                  <span @click="handleClick(item, 2)">下载</span>
                  <span @click="handleClick(item, 3)">删除</span>
                  <div class="triangle"></div>
                </div>

                <div class="floating-layer">
                  <div
                    class="imageOperation"
                    @click="changeTdOperation(item)"
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
                      <el-button size="mini" @click="handleClick(item, 0)" round
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

<script tang='ts'>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.right-content{
    background-color: #fff;
    height: 100%;
}
</style>