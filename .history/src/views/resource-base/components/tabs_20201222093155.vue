<template>
  <div class="tab">
    <nav>切换栏</nav>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from "vue";
export default {
  setup() {},
};
</script>

<style lang="scss" scoped>
.tab {
  nav > a {
    .tab {
      width: 100%;
      height: 44px;
      margin: 10px 0;
      nav > a {
        cursor: pointer;
        position: relative;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        margin-left: 18px;
        font-size: 14px;
        font-weight: 500;
        color: rgba(119, 128, 141, 1);
        width: 130px;
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
      }
      .active {
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
      &-box {
        width: 140px;
        overflow: hidden;
        line-height: 50px;
        margin-left: -10px;
        float: left;
        &:first-child {
          margin-left: 0;
        }
        &-1 {
          width: 110px;
          height: 50px;
          background: #fafbfd;
          float: left;
          box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
          border-radius: 6px 4px 0px 0px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .tab-name {
            display: inline-block;
            width: 130px;
            text-align: center;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333333;
            .count {
              // margin-left: 5px;
              // background: rgba(250, 173, 20, 1);
              background: rgba(91, 125, 255, 0.08);
              display: inline-block;
              padding: 2px 10px;
              height: 25px;
              line-height: 24px;
              border-radius: 15px;
            }
          }
        }
        &-2 {
          float: left;
          width: 0;
          height: 0;
          border-bottom: 50px solid #fafbfd;
          border-right: 30px solid transparent;
          // border-radius: 6px 6px 0px 0px;
          // box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
          margin-left: -2px;
        }
      }
    }
  }
}
</style>
