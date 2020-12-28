<template>
  <div class="search-time">
      <p>备课日期</p>
      <div class="times">
        <img src="/@/assets/prepare-teach/date.png" alt="爱学标品">
         <el-date-picker
          v-model="startTime"
          size='small'
          @change='dateChange'
          :disabled-date="disabledDate"
          format="YYYY 年 MM 月 DD 日"
          type="date"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="endTime"
          size='small'
          type="date"
          @change='dateChange'
          :disabled-date="disabledDate"
          placeholder="结束日期">
        </el-date-picker>
      </div>  
    </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default({
  setup(props, { emit }) {
    /*---按时间搜索---*/ 
    let startTime = ref()
    let endTime = ref()
    // 将数据格式化成YYYY-MM-dd
    const dataFormat = (dateData) => {
      let date = new Date(dateData)
      let y = date.getFullYear()
      let m: any = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      let d: any = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let time: any = y + '-' + m + '-' + d
      return time
    }
    const disabledDate = (time) => {
      return time.getTime() > Date.now()
    }
    const dateChange = (data) => {
      let __startTime =  dataFormat(startTime.value)
      let __endTime  = dataFormat(endTime.value)
      if(__startTime === 'NaN-NaN-NaN'){
        __startTime = null
      }
      if(__endTime === '1970-01-01'){
        __endTime = dataFormat(Date.now())
      }
      emit('search', { startTime: __startTime, endTime: __endTime })
    }

    return { startTime, endTime, dateChange, disabledDate }
  }
  
})
</script>

<style lang="scss" scoped>
  .search-time{
    margin-bottom: 20px;
    background: #fff url('./../../../assets/prepare-teach/search-bg.png') no-repeat 100%;
    background-size: cover;
    padding: 20px 30px;
    border-radius: 10px;
    .times{
      width: 420px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      :deep(.el-date-editor.el-input, .el-date-editor.el-input__inner){
        width: 180px;
      }
    }
  }
  @media screen and(min-width: 1440px){
    .search-time{
      min-height: 130px;
    }
  }
  @media screen and(min-width: 1680px){
    .search-time{
      min-height: 157px;
    }
  }
</style>