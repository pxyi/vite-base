<template>
  <div class="section__ranking">
    <div class="rank__teacher">
      <h4>
        <span>备课排名</span>
        <el-tooltip effect="dark" content="备课统计较昨日" placement="top">
          <sub class="el-icon-question"></sub>
        </el-tooltip>
      </h4>
      <div class="rank__charts">
        <div><div>2</div><p>9</p><h6>王老师</h6></div>
        <div><div>1</div><p>19</p><h6>王老师</h6></div>
        <div><div>3</div><p>25</p><h6>王老师</h6></div>
      </div>
      <div class="rank__points">
        <div class="points__chart">
          <div><div></div><div></div><div></div><div></div></div>
          <h4>我的排名</h4>
          <h3>2</h3>
        </div>
        <div class="points__number">
          <div><span>环比上周</span><i>+1</i></div>
          <div><span>环比上周</span><i class="down">-1</i></div>
        </div>
      </div>
    </div>
    <div class="rank__number">
      <h4>
        <span>备课排名</span>
        <el-tooltip effect="dark" content="备课统计较昨日" placement="top">
          <sub class="el-icon-question"></sub>
        </el-tooltip>
      </h4>
      <div class="r__n_box">
        <div>
          <div class="n__b_title">今日备课</div>
          <h2>2</h2>
          <div class="n__b_num"></div>
          <div class="n__b_icon">1</div>
        </div>
        <div class="is__down">
          <div class="n__b_title">今日备课</div>
          <h2>2</h2>
          <div class="n__b_num"></div>
          <div class="n__b_icon">2</div>
        </div>
        <div class="is__cn">
          <div class="n__b_title">今日备课</div>
          <h2>2</h2>
          <div class="n__b_num"></div>
          <div class="n__b_icon"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
$--rank-sort-1: #FF9E3D;
$--rank-sort-2: #3BBAB3;
$--rank-sort-3: #F8662F;
.section__ranking {
  display: flex;
  & > div {
    padding: 16px 20px;
    background: #fff;
    border-radius: 12px;
    & > h4 {
      font-size: 14px !important;
      margin-bottom: 35px;
    }
  }
  .rank__teacher {
    flex: 43;
    margin-right: 20px;
  }
  .rank__number {
    flex: 66;
  }
  .rank__charts {
    display: flex;
    & > div {
      div {
        width: 90px;
        height: 140px;
        color: #fff;
        font-size: 26px;
        line-height: 1.6;
        text-align: center;
        border-radius: 6px;
      }
      &:first-child {
        div {
          background: $--rank-sort-3;
        }
        p::before {
          border-color: $--rank-sort-3;
        }
        p::after {
          background-color: $--rank-sort-3;
        }
      }
      &:nth-child(2) {
        div {
          background: $--rank-sort-1;
        }
        p::before {
          border-color: $--rank-sort-1;
        }
        p::after {
          background-color: $--rank-sort-1;
        }
      }
      &:last-child{
        div {
          background: $--rank-sort-2;
        }
        p::before {
          border-color: $--rank-sort-2;
        }
        p::after {
          background-color: $--rank-sort-2;
        }
      }
      &:not(:last-child) {
        margin-right: 20px;
      }
      p {
        margin-top: 18px;
        font-size: 20px;
        line-height: 1;
        position: relative;
        &::before {
          content: '';
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 3px;
          border-style: solid;
          border-width: 1px;
          border-radius: 50%;
        }
        &::after {
          content: '';
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: absolute;
          top: 5px;
          left: 5px;
        }
      }
      h6 {
        color: #77808D;
        font-size: 18px;
      }
    }
  }

  .rank__points {
    display: flex;
    margin-top: 42px;
    .points__chart {
      width: 230px;
      height: 150px;
      position: relative;
      overflow: hidden;
      & > div > div {
        width: 100%;
        padding-top: 100%;
        border-width: 0;
        border-style: solid;
        border-color:  #2B847F;
        transform: rotateX(70deg) translate3D(-50%, -50%, 0);
        border-radius: 50%;
        position: absolute;
        top: 2%;
        left: 50%;
      }
      & > div > div:nth-child(1){
        border-left-width: 2px;
      }
      & > div > div:nth-child(2){
        border-top-width: 2px;
      }
      & > div > div:nth-child(3){
        border-right-width: 2px;
      }
      & > div > div:nth-child(4){
        border-bottom-width: 2px;
        z-index: 3;
      }
      & > div::after {
        content: '';
        display: block;
        width: 18%;
        padding-top: 18%;
        border-radius: 50%;
        background: linear-gradient(292deg, #3BBAB3 0%, #5944BE 100%);
        position: absolute;
        top: 28%;
        left: 0;
      }
      & > div::before {
        content: '';
        display: block;
        width: 60%;
        padding-top: 60%;
        border-radius: 50%;
        background: linear-gradient(292deg, #B5D2F2 0%, #3ABAB3 100%);
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
      }
      h4, h3 {
        color: #fff;
        text-align: center;
        position: relative;
        z-index: 9;
      }
      h4 {
        font-size: 20px;
        margin-top: 15%;
      }
      h3 {
        font-size: 34px;
        line-height: 48px;
      }
    }
    .points__number {
      font-size: 20px;
      flex: auto;
      margin-top: 24px;
      div {
        margin-bottom: 18px;
        text-align: right;
        line-height: 34px;
        span {
          display: inline-block;
          vertical-align: text-bottom;
          margin-right: 16px;
        }
        i {
          display: inline-block;
          color: #3BBAB3;
          font-size: 34px;
          font-style: normal;
          line-height: 1;
          &.down {
            color: #F8662F;
          }
        }
      }
    }
  }

  .r__n_box {
    display: flex;
    & > div {
      flex: 1;
      height: 360px;
      text-align: center;
      background: url('/@/assets/index/teacher-bg.png') no-repeat;
      background-size: 100% 100%;
      &:not(:last-child) {
        margin-right: 25px;
      }
      .n__b_title {
        width: 80%;
        height: 44px;
        margin: 22px auto 18px;
        font-size: 22px;
        line-height: 44px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 22px;
      }
      h2 {
        font-size: 50px;
        line-height: 1;
        transform: scaleX(.6);
        margin-bottom: 44px;
      }
      .n__b_num {
        width: 80%;
        height: 80px;
        margin: 0 auto;
        background: url('/@/assets/index/num-up.png') no-repeat;
        background-size: 100% 100%;
      }
      .n__b_icon {
        font-size: 22px;
        line-height: 24px;
        margin-top: 22px;
        &::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 24px;
          margin-right: 4px;
          vertical-align: middle;
          background: url('/@/assets/index/icon-up.png') no-repeat;
          background-size: contain;
        }
      }
      &.is__down {
        .n__b_num {
          background: url('/@/assets/index/num-down.png') no-repeat;
          background-size: 100% 100%;
        }
        .n__b_icon::before {
          background: url('/@/assets/index/icon-down.png') no-repeat;
          background-size: contain;
        }
      }
      &.is__cn {
        .n__b_num {
          background: url('/@/assets/index/num-current.png') no-repeat;
          background-size: 100% 100%;
        }
        .n__b_icon::before {
          background: url('/@/assets/index/icon-cn.png') no-repeat;
          background-size: contain;
        }
      }
    }
  }
}

@media only screen and (max-width: 1680px) {
  .section__ranking {
    .rank__charts {
      & > div p { font-size: 18px; }
      & > div h6 { font-size: 16px; }
    }
    .rank__points {
      .points__chart { 
        width: 160px; 
        & > div > div { width: 80px; }
        & > div::after { top: 20%; }
        h4 { font-size: 18px; }
        h3 { font-size: 24px; line-height: 1.4; }
      }
      .points__number {
        margin-top: 16px;
        div { 
          font-size: 16px; line-height: 24px; margin-bottom: 12px;
          i { font-size: 24px; }
        }
      }
    }


    .r__n_box {
      & > div {
        height: 300px;
        &:not(:last-child) { margin-right: 20px; }
        .n__b_title {
          height: 36px;
          margin: 22px auto 18px;
          font-size: 18px;
          line-height: 36px;
          border-radius: 18px;
        }
        h2 {
          margin-bottom: 30px;
        }
        .n__b_num {
          width: 80%;
          height: 60px;
        }
        .n__b_icon {
          font-size: 20px;
          margin-top: 20px;
          &::before {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }
}
@media only screen and (max-width: 1440px) {
  .section__ranking {
    .rank__charts {
      & > div > div { width: 80px; }
      & > div p { font-size: 16px; }
      & > div h6 { font-size: 14px; }
    }
    .rank__points {
      .points__chart { 
        width: 160px; 
        & > div::after { top: 20%; }
        h4 { font-size: 18px; }
        h3 { font-size: 24px; line-height: 1.4; }
      }
      .points__number {
        margin-top: 16px;
        div { 
          font-size: 16px; line-height: 24px; margin-bottom: 12px;
          i { font-size: 24px; }
        }
      }
    }

    .r__n_box {
      & > div {
        height: 300px;
        &:not(:last-child) { margin-right: 20px; }
        .n__b_title { font-size: 16px; }
        h2 { margin-bottom: 26px; }
        .n__b_num { height: 50px; }
        .n__b_icon {
          font-size: 20px; margin-top: 20px;
          &::before { width: 20px; height: 20px; }
        }
      }
    }
  }
}
@media only screen and (max-width: 1280px) {
  .section__ranking {
    .rank__teacher h4 { margin-bottom: 20px; }
    .rank__number h4 { margin-bottom: 20px; }
    .rank__charts {
      & > div > div { width: 70px; }
      & > div p { font-size: 16px; line-height: 20px; }
      & > div h6 { font-size: 14px; }
    }
    .rank__points {
      margin-top: 20px;
      .points__chart { 
        width: 140px; 
        height: 100px;
        & > div::after { top: 20%; vertical-align: top; }
        h4 { font-size: 14px; margin: 10% 0 0; }
        h3 { font-size: 20px; line-height: 1.4; }
      }
      .points__number {
        margin-top: 16px;
        div { 
          font-size: 14px; line-height: 24px; margin-bottom: 12px;
          i { font-size: 20px; }
        }
      }
    }


    .r__n_box {
      & > div {
        height: 300px;
        &:not(:last-child) { margin-right: 20px; }
        .n__b_title { height: 26px; line-height: 26px; font-size: 14px; }
        h2 { margin-bottom: 26px; font-size: 30px; }
        .n__b_num { height: 40px; }
        .n__b_icon {
          font-size: 16px; margin-top: 20px;
          &::before { width: 16px; height: 16px; }
        }
      }
    }
  }
}
</style>