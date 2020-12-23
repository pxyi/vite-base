<template>
  <div class="paper__update__container">
    <div class="header">
      <div class="tabs_box">
        {{title}}
      </div>
      <div class="btns">
        <el-button round @click="close();$router.push('/')">提交备课</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content-top">
        <div class="course-img">
          <img src="/@/assets/prepare-teach/courseBg.png" style="width: 130px" alt="">
        </div>
        <div class="class-top">
          <h2>{{title}}</h2>
          <div class="class-list">
            <div>
              <p class="front"><span class="span-title">科目：</span><span class="span-content">{{'无'}}</span></p>
              <p><span class="span-title">课程类型：</span><span class="span-content">{{'无'}}</span></p>
            </div>
            <div>
              <p class="front"><span class="span-title">年级：</span><span class="span-content">{{'无'}}</span></p>
              <p><span class="span-title">保存时间：</span><span class="span-content">{{'无'}}</span></p>
            </div>
          </div>       
        </div>
      </div>
      <div class="main">
        <div class="tab">
          <nav>
            <!-- @click="selectActive(item)" -->
            <a  @click.prevent="selectActive(item)">
              {{111}}
              <span class="num">
                {{111}}
              </span>
            </a>
          </nav>
        </div>

        <div class="content-list">
          <div class="btn-box">
            <el-button type="primary" @click="uploadPlan" round :disabled="courseInfo.lessonStatus==3">上传我的教案</el-button>
            <el-button type="primary" @click="uploadVideo" round :disabled="courseInfo.lessonStatus==5">上传我的说课</el-button>
          </div>
          <div class="content-list-box">
            <div class="content-list-box-item" v-for="(item,index) in allFileList" :key="index">
              <div class="content-list-box-item-bg">
                <img class="imgCover" style="width:116px;" v-if="item.ext !== 'mp3' && item.ext !== 'zip' && item.ext !== 'rar' && item.mediaType == null" :src="`/test${item.imgPath}`" alt="">
                <img v-else src="../../assets/images/icon_d44l6421sgu/weizhiwenjian.png" alt="">
              </div>
              <div class="content-list-box-item-title">
                <span>{{item.fileName}}</span>
              </div>
              <div class="btn-group">
                  <div class="btnBox">
                    <div>
                      <el-button size="mini" icon="el-icon-search" @click="preview(item)" round>预览</el-button>
                    </div>
                    <div>
                      <!-- <el-button size="mini" icon="el-icon-edit-outline" round>编辑</el-button> -->
                    </div>
                  </div>
                  <div class="private">
                    <i class="el-icon-lock" v-if="item.isPublic==0" style="font-size:12px"></i>
                  </div>
                </div>
            </div>
          </div>
            <p v-show="false" style="text-align:center;margin-top: 30px;">暂无数据</p>

        </div>
      </div> 
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, reactive, inject } from 'vue';
export default {
  props: {
    id: String,
    title: String,
  },
  setup(props) {
    let close = inject('close')
    let activeName = ref('first')

    
    return { close }
  }
}
</script>
<style lang="scss" scoped>
@import './../../../cus-var.scss';
.paper__update__container {
  background: $--background-color-base;
  height: 100%;
  .header {
    background: $--color-primary;
    padding: 0 80px;
    display: flex;
    height: 60px;
    line-height: 60px;
  }
  .save {
    color: #fff;
    i {
      font-size: 24px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .btns {
    margin-left: 30px;
    button {
      color: #1AAFA7;
      padding: 10px 23px;
      input {
        display: none;
      }
    }
  }
  .save, .btns {
    width: 200px;
    text-align: right;
  }
  .tabs_box {
    flex: auto;
    color: #fff;
    font-size: 18px;
    ul {
      display: inline-block;
    }
    li {
      float: left;
      padding: 0 20px;
      color: #fff;
      font-size: 18px;
      list-style: none;
      position: relative;
      cursor: pointer;
      &.active::after {
        content: '';
        display: block;
        width: 100%;
        height: 6px;
        background: #FAAD14;
        border-radius: 3px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  .content{
    width: 1200px;
    margin: 20px auto;
    .content-top{
      padding: 20px 30px;
      background: #fff;
      border-radius: 10px;
      display: flex;
      justify-content: flex-start;
      .class-top{
        padding: 8px 50px;
        h2{
          font-size: 18px;
          color: #333;
        }
        .class-list{
          margin-top: 30px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          div{
            line-height: 25px;
            .front{
              width: 300px;
            }
            .span-title{
              font-weight: 500;
            }
            .span-content{
              color: #77808D;
              
            }
          }
          
        }
      }
    }
    .main{
      margin-top: 30px;
      background: #fff;
      border-radius: 10px;
      .tab{
				margin-top: 20px;
				width: 100%;
				height: 44px;
				nav>a{
					cursor: pointer;
					position: relative;
					text-align: center;
					height: 44px;
					width: 120px;
					line-height: 44px;
					text-decoration: none;
					display: inline-block;
					margin-left: 18px;
					font-size: 14px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: rgba(119, 128, 141, 1);
					background: rgba(91, 125, 255, 0.08);
					background: #FAFBFD;
					&::before{
						content: '';
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background:#FAFBFD;
						box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
						border-bottom: none;
						transform:perspective(1em)scale(1.3,1.35) rotateX(5deg);
						z-index: -1;
						-webkit-transform-origin:bottom;
						transform-origin:bottom left
					}
					.num{
						margin-left: 5px;
						padding: 0 15px;
						background: rgba(119, 128, 141, 0.2);
						color: #77808D;
						height: 20px;
						width: 50px;
						border-radius: 15px;
					}
					&:first-child{
						margin-left: 0;
					}
				}
				.active{
					background: #fff;
					color: rgba(51, 51, 51, 1);
					&::before{
						background:#fff;
					}
					.num{
						color: #FFFFFF;
						background: rgba(250, 173, 20, 1);
					}
				}

				/* nav>a::before{
					content: '';
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background:#FAFBFD;
					box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
					border-bottom: none;
					transform:perspective(1em)scale(1.3,1.3) rotateX(5deg);
					z-index: -1;
					-webkit-transform-origin:bottom;
					 transform-origin:bottom left
				} */





				// background: #FAFBFD;
				// box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
				// border-radius: 6px 6px 0px 0px;
				&-box{
					width: 140px;
					overflow: hidden;
					line-height: 50px;
					margin-left: -10px;
					float: left;
					&:first-child{
						margin-left: 0;
					}
					&-1{
						width: 110px;
						height: 50px;
						background: #FAFBFD;
						float: left;
						box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
						border-radius: 6px 4px 0px 0px;
						display: flex;
						align-items: center;
						justify-content: space-around;
						.tab-name{
							display: inline-block;
							width: 130px;
							text-align: center;
							font-size: 14px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
							.count{
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
					&-2{
						float: left;
						width: 0;
						height: 0;
						border-bottom: 50px solid  #FAFBFD;
						border-right: 30px solid transparent;
						// border-radius: 6px 6px 0px 0px;
						// box-shadow: 0px -2px 6px 0px rgba(91, 125, 255, 0.08);
						margin-left: -2px;
					}
				}
			}

			&-list{
				background: #fff;
				padding: 15px;
				.btn-box{
					margin-bottom: 10px;
				}
				&-box{
					padding: 20px 0;
					display: flex;
					justify-content: flex-start;
					flex-direction: row;
					flex-wrap: wrap;
					&-item{
						margin-bottom: 15px;
						position: relative;
						box-sizing: border-box;
						padding: 10px 10px;
						width: 160px;
						height: 155px;
						border-radius: 6px;
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: center;
						cursor: pointer;
						margin-right: 15px;
						&:hover .btn-group{
							display: flex;
						}
						.btn-group{
							top: 0;
							left: 0;
							width: 160px;
							height: 155px;
							border-radius: 6px;
							position: absolute;
							display: none;
							justify-content: center;
							align-items: center;
							background: rgba(0, 0, 0, 0.15);
							.btnBox{
								margin-top: -8px;
								width: 100px;
								height: 60px;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								align-items: center;
							}
							.private{
								display: block;
							}
						}

						/* &:hover{
							background: rgba(0, 0, 0, 0.15);
							.btn-group{
								display: flex;
								border: 1px solid red;
							}
							.private{
								display: block;
							}
						} */
						&-bg{
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							width: 116px;
							height: 87px;
							position: relative;
							.imgCover{
								object-fit: cover;
								width: 100%;
								height: 100%;
							}
							.btn-group{
								position: absolute;
								top: 33px;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								align-items: center;
								width: 100%;
								height: 60px;
							}
						}
						&-title{
							width: 100%;
							text-align:center;
							text-justify:inter-ideograph;

							margin-top: 8px;
							font-size: 14px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #333333;
							overflow: hidden;
							word-break: break-all;
							word-wrap: break-word;
							white-space: pre-wrap;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							line-clamp: 2;
							-webkit-box-orient: vertical;
						}
						.private{
							display: none;
							position: absolute;
							left: 4px;
							bottom: 4px;
							z-index: 10;
							padding: 0 5px;
							background: rgba(0, 0, 0, 0.52);
							border-radius: 5px;
							color: #fff;
						}


					}

				}

			}
    }
  }
}
</style>