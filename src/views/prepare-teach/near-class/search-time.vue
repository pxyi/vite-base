<template>
  <div class="search-time">
      <p>备课日期</p>
      <div class="times">
        <img src="/@/assets/prepare-teach/date.png" alt="爱学标品">
         <el-date-picker
          v-model="startTime"
          size='small'
          :disabled-date="disabledDate"
          type="date"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="endTime"
          size='small'
          type="date"
          :disabled-date="disabledEndDate"
          placeholder="结束日期">
        </el-date-picker>
      </div>  
    </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue'
export default({
  setup(props, { emit }) {
    /*---按时间搜索---*/ 
    let startTime = ref()
    let endTime = ref()
    // 将数据格式化成YYYY-MM-dd
    const dataFormat = (dateData, startOrEnd) => {
      if(dateData === null && startOrEnd === 'end'){
         dateData = Date.now() //结束时间为null 结束时间为当前时间
      }
      if(!dateData && startOrEnd === 'start'){
        return   //起始时间为空 直接返回
      }
      let time = new Date(dateData).toLocaleDateString()
      console.log(time)
      return time
    }
    // 起始时间默认
    const disabledDate = (time) => {
      if (endTime.value !== null) {
        return time.getTime() > Date.now() || time.getTime() > new Date(endTime.value)
      }else {
        return time.getTime() > Date.now()
      }
    }
    // 结束时间默认
    const disabledEndDate = (time) => {
      return time.getTime() > Date.now() || time.getTime() < new Date(startTime.value)
    }
    watch(startTime, (val) => {emit('search', { startTime: dataFormat(val, 'start'), endTime: dataFormat(endTime.value, 'end') })})
    watch(endTime, (val) => {emit('search', { startTime: dataFormat(startTime.value, 'start'), endTime: dataFormat(val, 'end') })})

    return { startTime, endTime, disabledDate, disabledEndDate }
  }
  
})
</script>

<style lang="scss" scoped>
  .search-time{
    margin-bottom: 20px;
    background: #fff url('./../../../assets/prepare-teach/search-bg-1.png') no-repeat 100%;
    background-size: cover;
    padding: 20px 30px;
    border-radius: 6px;
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
  @media screen and(max-width: 1280px){
    .search-time{
      .times{
        width: 360px;
        :deep(.el-date-editor.el-input, .el-date-editor.el-input__inner){
          width: 150px;
        }
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