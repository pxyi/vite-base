<template>
  <div class="index__head">
    <el-dropdown @command="commandList.get($event)()">
      <div>
        <img src="/src/assets/default-boy.png" alt="爱学标品">
        <span>{{ nickName }}</span>
        <i class="el-icon-arrow-down" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item icon="el-icon-user" disabled>个人中心</el-dropdown-item>
          <el-dropdown-item icon="el-icon-setting" disabled>主题设置</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <div class="fixed__date">
    <div class="date__head clear__float">
      <div class="date__week">
        <i class="el-icon-arrow-left" @click="weekHandle('prev')" />
        <span>{{ weekString }}</span>
        <el-date-picker v-model="weekInput" type="week" format="gggg 第 ww 周" />
        <i class="el-icon-arrow-right" @click="weekHandle('next')" />
      </div>
      <div class="date__icon"><i class="el-icon-date" /></div>
    </div>
    <div class="date__main">
      <div v-for="day in weekList" :key="day[0]" :class="{ today: day[1] === today }"><sub>{{ day[0] }}</sub><p><span>{{ day[1].split('-')[2] }}</span></p></div>
    </div>
  </div>

  <div class="fixed__timetable">
    <h2>课表</h2>
    <ul class="f__t_cell">
      <li data-before="08:00">
        <h6>五年级数学</h6>
        <p>8:00-9:00</p>
      </li>
      <li data-before="08:00" class="type__cp">
        <h6>五年级数学</h6>
        <p>8:00-9:00</p>
      </li>
      <li data-before="08:00" class="type__nj">
        <h6>五年级数学</h6>
        <p>8:00-9:00</p>
      </li>
      <li data-before="08:00" class="type__tx">
        <h6>五年级数学</h6>
        <p>8:00-9:00</p>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { ref, computed } from 'vue';
import moment from 'moment';
import { useStore } from 'vuex';
import { REMOVE_USER_INFO } from './../../../store/types';
import { useRouter } from 'vue-router';
const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayList = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export default {
  name: 'index-fixed',
  props: { nickName: String },
  setup() {
    let today = moment().format('YYYY-MM-DD');
    let weekInput = ref(new Date());
    let weekString = computed(() => moment(weekInput.value).format('gggg 第 ww 周'));
    let weekList = computed(() => [...dayList.map((day, i) => ([day, moment(weekInput.value).add(i, 'days').format('YYYY-MM-DD')]))]);
    const weekHandle = (type) => (weekInput.value = moment(weekInput.value).add(type === 'prev' ? -7: 7, 'days').toDate());

    let store = useStore();
    let router = useRouter();
    let commandList = new Map([
      ['logout', () => {
        store.commit(REMOVE_USER_INFO)
        router.push('/login');
      }]
    ]);


    return { today, weekInput, weekString, weekList, weekHandle, commandList }
  }
}
</script>
<style lang="scss" scoped>
.fixed__date {
  margin-bottom: 28px;
}
.index__head {
  margin-bottom: 34px;
  height: 36px;
  line-height: 36px;
  text-align: right;
  cursor: pointer;
  img {
    display: inline-block;
    width: 36px;
    vertical-align: middle;
  }
  span {
    margin: 0 14px;
  }
  i.el-icon-arrow-down {
    color: #1AAFA7;
    font-size: 16px;
  }
}
:deep(.date__head) {
  margin-bottom: 18px;
  .date__week {
    float: left;
    height: 50px;
    padding: 12px 14px;
    background: #F6F7F8;
    border-radius: 10px;
    position: relative;
    & > i {
      display: inline-block;
      width: 27px;
      line-height: 27px;
      text-align: center;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      &:first-child {
        margin-right: 16px;
      }
      &:last-child {
        margin-left: 16px;
      }
    }
    span {
      pointer-events: none;
    }
  }
  .el-input {
    width: 100px;
    opacity: 0;
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    input {
      cursor: pointer;
    }
  }
  .date__icon {
    float: right;
    width: 50px;
    height: 50px;
    font-size: 24px;
    line-height: 50px;
    text-align: center;
    background: #F6F7F8;
    box-shadow: 0px 2px 7px 0px rgba(95, 95, 95, 0.3);
    border-radius: 10px;
  }
}
.date__main {
  display: flex;
  padding: 14px 26px 26px;
  box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px solid #C8C9CC;
  & > div {
    flex: 1;
    height: 60px;
    &:not(:last-child) {
      margin-right: 25px;
    }
    &.today p {
      color: #FAAD14;
    }
  }
  sub {
    display: inline-block;
    margin-bottom: 10px;
    color: #77808D;
    line-height: 20px;
  }
  p {
    width: 32px;
    font-size: 30px;
    line-height: 30px;
    overflow: hidden;
    span {
      display: block;
      transform-origin: left top;
      transform: scaleX(.7);
    }
  }
}

.fixed__timetable {
  h2 {
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 22px;
  }
  .f__t_cell {
    padding-left: 46px;

    li {
      padding: 10px 15px 10px 72px;
      height: 60px;
      color: #909399;
      list-style: none;
      border-radius: 10px;
      position: relative;
      background: #F8F8F9 url('./../../../assets/index/timetable-1.png') no-repeat 18px center;
      background-size: 36px 36px;
      transition: all .25s;
      cursor: pointer;
      &::before {
        content: attr(data-before);
        display: block;
        color: #909399;
        font-size: 12px;
        position: absolute;
        top: 2px;
        left: 0;
        margin-left: -44px;
      }
      &:not(:last-child) {
        margin-bottom: 14px;
      }
      &:hover {
        box-shadow: 0px 2px 9px 0px rgba(35, 59, 93, 0.3);
      }
      &.type__cp {
        color: #5944BE;
        background: #F6F4FF url('./../../../assets/index/timetable-2.png') no-repeat 18px center;
        background-size: 36px 36px;
      }
      &.type__nj {
        color: #FA5F1D;
        background: #FFECE6 url('./../../../assets/index/timetable-3.png') no-repeat 18px center;
        background-size: 36px 36px;
      }
      &.type__tx {
        color: #1956AF;
        background: #ECF6FF url('./../../../assets/index/timetable-4.png') no-repeat 18px center;
        background-size: 36px 36px;
      }
      h6 {
        font-size: 16px;
        line-height: 1.4;
        margin-bottom: 4px;
      }
      p {
        line-height: 1;
      }
    }
  }
}
@media only screen and (max-width: 1680px) {
  .fixed__timetable {
    h2 { font-size: 16px; }
  }
  .fixed__date {
    margin-bottom: 20px;
    .date__main {
      padding: 6px 14px 12px;
      & > div{
        height: auto;
        text-align: center;
        sub { font-size: 12px; margin-bottom: 2px; }
        p {
          width: auto; font-size: 18px; line-height: 1.4;
          span { transform: none; }
        }
        &:not(:last-child) { margin-right: 0; }
      }
    }
  }
  .fixed__timetable {
    h2 { margin-bottom: 16px; }
    .f__t_cell {
      li {
        padding: 8px 20px 0 60px;
        background-position-x: 16px;
        background-size: 34px 34px !important;
        h6 { font-size: 16px; }
      }
    }
  }
}
@media only screen and (max-width: 1440px) {
  .fixed__date {
    margin-bottom: 20px;
    .date__head {
      margin-bottom: 12px;
      .date__week { height: 40px; line-height: 40px; padding: 0 7px; font-size: 14px; }
      .date__icon { height: 40px; width: 40px; line-height: 40px; }
    }
    .date__main {
      padding: 6px 14px 12px;
      & > div{
        height: auto;
        text-align: center;
        sub { font-size: 12px; margin-bottom: 2px; }
        p {
          width: auto; font-size: 18px; line-height: 1.4;
          span { transform: none; }
        }
        &:not(:last-child) { margin-right: 0; }
      }
    }
  }
  .fixed__timetable {
    h2 { margin-bottom: 16px; }
    .f__t_cell {
      li {
        height: 50px; padding: 7px 10px 0 50px;
        background-size: 30px 30px !important;
        h6 { font-size: 14px; }
        p { font-size: 12px; }
      }
    }
  }
}
@media only screen and (max-width: 1280px) {
  .fixed__date {
    margin-bottom: 20px;
    .date__head {
      margin-bottom: 12px;
      .date__week { height: 40px; line-height: 40px; padding: 0 7px; font-size: 14px; }
      .date__icon { height: 40px; width: 40px; line-height: 40px; }
    }
    .date__main {
      padding: 6px 14px 12px;
      & > div{
        height: auto;
        text-align: center;
        sub { font-size: 12px; margin-bottom: 2px; }
        p {
          width: auto; font-size: 18px; line-height: 1.4;
          span { transform: none; }
        }
        &:not(:last-child) { margin-right: 0; }
      }
    }
  }
  .fixed__timetable {
    h2 { margin-bottom: 16px; }
    .f__t_cell {
      li {
        height: 50px; padding: 7px 10px 0 50px;
        background-size: 30px 30px !important;
        h6 { font-size: 14px; }
        p { font-size: 12px; }
      }
    }
  }
}
</style>
