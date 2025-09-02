<template>
  <view>
    <!-- <cus-tabbar :current-page="0"></cus-tabbar> -->
    <!-- #ifdef MP-WEIXIN -->
    <view class="xc-top" :style="{ height: `${sysConfig.statusBarHeight - 5}px` }">
    </view>
    <!-- #endif -->
    <view class="home-page">
      <view class="top-header">
        <view class="title-wrap">
          羊羊盒机
        </view>

        <view class="carousel-wrapper">
          <view class="invit-box">
            <view></view>
              <view class="invit-con" @click="onShareAppMessage" >
                <view class="invit-text">邀请好友</view>
                <image class="invit-img" src="/static//img/invit.png" mode="widthFix" @click="" />
              </view>
          </view>
          <image src="/static/img/hm_banner.png" lazy-load="false" mode="widthFix" binderror="" bindload=""
            class="carousel-img" />

        </view>
      </view>

      <view class="home-body">
        <view class="menu-con">
        </view>
        <view class="menu-container">
          <view class="menu-item" v-for="(item, index) in menuList" :key="index" @click="goList(item)">
            <image class="menu-image" :src="item.thumb" mode="widthFix" />
          </view>
        </view>
        <view class="second-container">
          <view class="coupon-num">
            <view class="coupon-con" @click="goMenu({ url: '/package/mine/coupon' })">
              <view class="coupon-text">优惠券</view>
              <image class="nav-image" src="/static/img/coupon.png" mode="widthFix" />
            </view>
          </view>
          <view class="menu-item" v-for="(item, index) in secondList" :key="index" @click="goMenu(item)">
            <image class="menu-image" :src="item.thumb" mode="widthFix" />
          </view>
          <view class="coupon-num">
            <view class="sign-con" @click="goMenu({ url: '/pages/index/sign' })">
              <image class="nav-image" src="/static/img/qiandao.png" mode="widthFix" />
              <view class="sign-box">
                <image class="sign-icon" src="/static/img/sign-icon.png" mode="widthFix" />
                <view class="sign-text">签到</view>
              </view>
            </view>
          </view>
        </view>

        <!-- <view class="cate-wrap">
          <view class="cate-item" :class="[currentIndex == index ? 'cate-item-active' : '']"
            v-for="(item, index) in cateList" @click="changeIndex(item, index)">
            {{ item.title }}
          </view>
          <view class="cate-item" :class="[currentIndex == index ? 'cate-item-active' : '']"
            v-for="(item, index) in cateList" @click="changeIndex(item, index)">
            {{ item.title }}
          </view>
        </view> -->
      </view>

    </view>

    <!-- 进群 -->
    <u-popup v-model="kefushow" mode="center" border-radius="16">
      <view class="bgbox">
        <view class="content">
          <view class="ma">
            <image class="" :src="wx_group" mode="widthFix" lazy-load="false" binderror="" bindload="" />
          </view>
          <view class="yi">
            微信扫一扫
          </view>
        </view>
        <view class="off" @click="kefushow = false">
          <uni-icons type="close" color="#fff" size="45" />
        </view>
      </view>
    </u-popup>

    <view class="fixed-timer">
      <CountdownCircle @click="goYFS" @finish="onFinishCountDown" />
    </view>
    <cusTabbar />
  </view>
</template>

<script>
const switchMp3 = 'https://www.img.xcooo.cn/uploads/2024/02/17887756404cea30.mp3'
const switchMusic = uni.createInnerAudioContext();
const bgMp3 = ''
const bgMusic = uni.createInnerAudioContext();
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  onShareAppMessage(){},
  components: {

  },
  data() {
    return {
      show: false,
      showHome: false,
      background: ['color1', 'color2', 'color3'],
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      activeIndex: 0,
      logList: [],
      // 下拉刷新的配置(可选, 绝大部分情况无需配置)
      downOption: {
        use: false,
        auto: false
      },
      // 上拉加载的配置(可选, 绝大部分情况无需配置)
      upOption: {
        auto: true,
        page: {
          size: 20 // 每页数据的数量,默认10
        }
      },
      listData: [],
      optionsData: '',
      swiperList: [],
      muteBgMusic: true,
      currentIndex: 0,
      cateList: [
        {
          id: 0,
          title: '推荐',
          type: '',
          box_type: '',
          is_recommend: 1
        },
        {
          id: 1,
          title: '一番赏',
          type: 1,
          box_type: 1
        },
        {
          id: 2,
          title: '无限赏',
          type: 1,
          box_type: 2
        },
        {
          id: 3,
          title: '福袋',
          type: 1,
          box_type: 4
        },
        {
          id: 4,
          title: '对对碰',
          type: 4,
          box_type: ''
        },
        {
          id: 5,
          title: '爬塔',
          type: 5,
          box_type: ''
        },
        {
          id: 4,
          title: '宝箱',
          type: 1,
          box_type: 5
        }
      ],
      is_new: '',
      site_title: '',
      menuList: [
        {
          thumb: '/static/img/fudai.png',
          id: 3,
          title: '福袋',
          type: 1,
          box_type: 4
        },
        {
          thumb: '/static/img/duiduipeng.png',
          id: 4,
          title: '对对碰',
          type: 4,
          box_type: ''
        },
        {
          thumb: '/static/img/yifan.png',
          id: 1,
          title: '一番赏',
          type: 1,
          box_type: 1
        },

      ],
      secondList: [
        {
          type: 4,
          thumb: '/static/img/pata.png',
          title: '爬塔',
          url: '/pages/box/tower'
        },
        {
          type: 5,
          thumb: '/static/img/dataosha.png',
          title: '羊羊好物',
        }
      ],
      userInfo: '',
      kefushow: false,
      wx_group: '',
      userQueueInfo: {},
      // 标签配置映射表
      tagConfig: {
        1: { // type 1: 普通盒子
          1: { text: '一番赏', color: '#FF9900' },
          2: { text: '无限抽', color: '#FF9900' },
          3: { text: '好物', color: '#FF9900' },
          4: { text: '福袋', color: '#FF9900' },
          5: { text: '爬塔', color: '#FF9900' },
          6: { text: '宝箱', color: '#FF9900' }
        },
        4: { // type 4: 对对碰
          default: { text: '对对碰', color: '#FF9900' }
        }
      },
    }
  },
  onLoad(options) {
    this.optionsData = options
    // 推广码获取
    // console.log('参数', options)
    let invite_code = this.getUrlCode().invite_code
    if (invite_code) {
      uni.setStorageSync('invite_code', invite_code);
    }

    // 微信二维码undo
    if (options.scene) {
      let invite_code = decodeURIComponent(options.scene)
      let index = invite_code.indexOf('=') + 1
      if (index > 0) {
        invite_code = invite_code.slice(index, invite_code.length)
        uni.setStorageSync('invite_code', invite_code);
      } else {
        uni.setStorageSync('invite_code', invite_code);
      }
    }

    // #ifdef H5
    this.wxH5Code = this.getUrlCode().code // 截取code
    // console.log(this.wxH5Code)
    if (this.wxH5Code) {
      this.getOpenid() //获取openid
    }
    // #endif

    switchMusic.src = switchMp3

  },
  onShow() {
    this.$store.dispatch('getAppConfig').then((res) => {
      this.site_title = res.data.site_title
      this.wx_group = res.data.wx_group
      if (res.data.bg_music) {
        bgMusic.src = res.data.bg_music
        bgMusic.autoplay = false;
        bgMusic.loop = false;
      }
    })
    this.$store.dispatch('getUserInfo').then(res => {
      console.log(res)
      this.userInfo = res.data
    })
    this.getQueueStatus()
    this.getSwiperList()
    // this.getLog()
    this.getList({ num: 1, size: 20 })
  },
  onUnload() {
    // bgMusic.pause()
  },
  computed: {
    ...mapGetters(['sysConfig']),
    // 计算属性：生成每个item对应的标签信息映射
    tagMap() {
      return (item) => {
        const { type, box_type } = item;

        // 基础默认值
        let defaultTag = { text: '', color: '#FF9900' };

        // 如果没有type或box_type，返回默认值
        if (!type || !box_type) return defaultTag;

        // 查找特定类型的配置
        const typeConfig = this.tagConfig[type];
        if (!typeConfig) return defaultTag;

        // 查找特定box_type的配置，或使用默认配置
        return typeConfig[box_type] || typeConfig.default || defaultTag;
      };
    }
  },
  methods: {
    onSwiperChange(e) {
      this.activeIndex = e.detail.current
    },
    onImageLoad(item) {
      this.$set(item, 'loaded', true);
    },
    changeIndex(item, index) {
      if (item.id == 5) {
        this.$common.to({
          url: '/pages/box/tower'
        })
      } else {
        this.currentIndex = index
        if (item.sort) {
          if (item.sortType !== 4) {
            item.sortType = 4
          } else {
            item.sortType = 5
          }
        } else {
          this.cateList.map(item => {
            item.sortType = ''
          })
        }
        if (item.is_new) {
          this.is_new = 2
        } else {
          this.is_new = ''
        }
        this.listData = []
        this.mescroll.resetUpScroll()
        this.mescroll.scrollTo(0, 0)
      }

    },
    playMusic() {
      this.muteBgMusic = !this.muteBgMusic;
      this.$nextTick(() => {
        if (switchMusic) {
          switchMusic.play()
        }
      })
      if (!this.muteBgMusic) {
        bgMusic.play()
      } else {
        bgMusic.pause()
      }
    },
    jump() {
      uni.navigateTo({
        url: '/pages/index/web-view?url=http://dts.yi-ruan.com/',
        success: (result) => {

        },
        fail: () => { },
        complete: () => { }
      });
    },
    getSwiperList() {
      /* 获取轮播图 */
      this.$common.getBanner(1).then(res => {
        this.swiperList = res
      })
    },
    getUrlCode() { //
      var url = location.search
      var theRequest = new Object()
      if (url.indexOf("?") != -1) {
        var str = url.substr(1)
        var strs = str.split("&")
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
        }
      }
      return theRequest
    },
    getOpenid() { //获取opendi
      this.req({
        url: '/v1/shop/wxLogin',
        data: {
          code: this.wxH5Code,
          invite_code: uni.getStorageSync('invite_code')
        },
        success: res => {
          if (res.code == 200) {
            if (res.code == 200) {
              uni.setStorageSync(
                'token',
                `${res.data.token_type}${res.data.access_token}`
              )

              // setTimeout(() => {
              //   uni.showToast({
              //     title: '登录成功',
              //     icon: 'success',
              //     mask: true
              //   })
              // }, 100)

              setTimeout(() => {
                this.pageTo('wxH5')
              }, 500)
            }
          }
        }
      })
    },
    /**
 * @description: 统一处理登录后页面跳转传参
 * @param {*}
 * @return {*}
 */
    pageTo(wx) {
      this.$store.dispatch('getUserInfo').then(() => {
        let pages = getCurrentPages()
        console.log(pages)

        console.log('this.optionsData', this.optionsData)
        let data = ''
        if (this.optionsData) {
          let query = this.optionsData
          if (this.optionsData.page == 'package/fuli/fuli-detail') {
            query.is_new = 1
          }
          data = query
        }
        /* 小程序码进入 */
        if (this.optionsData.scene) {
          let query = {}
          let arr = this.optionsData.scene.split('_')
          /**
           * 小程序码参数为 1_1_1 格式 参数间通过_分隔
           * 参数1为类型,之后参数为与后台约定的参数
           * 类型:
           * 1 幸运盒子 参数1为分享人id,参数2为盒子id
           * 未完待续...
           */
          if (arr[0] == 1) {
            query.userId = arr[1]
            query.id = arr[2]
          }
          data = query
        }
        if (wx) {
          // 清理 URL 中的参数部分
          this.clearUrlParams();
          uni.switchTab({
            url: '/pages/home/index'
          })
        }

        uni.redirectTo({
          url: `${this.optionsData.page}${this.$common.qs(this.optionsData)}`,
          fail: err => {
            console.log('跳转失败--', this.optionsData.page)
            uni.switchTab({
              url: `${this.optionsData.page}`
            })
          }
        })
      })
    },
    clearUrlParams() {
      // 获取当前 URL
      let url = window.location.href;
      // 找到 URL 中的参数部分
      let index = url.indexOf('?');
      if (index > -1) {
        // 移除参数部分
        url = url.substring(0, index);
      }
      // 使用 History API 替换当前 URL
      history.replaceState(null, '', url);
    },
    /**
* @description: 中奖记录
* @return {*}
*/
    getLog() {
      this.req({
        url: '/v1/box/log',
        data: {},
        Loading: true,
        success: res => {
          if (res.code == 200) {
            this.logList = res.data
          }
        }
      })
    },
    /**
* @description: 获取商品列表数据
* @param {*}
* @return {*}
*/
    getList({
      num,
      size
    }) {

      let data = {
        page: num,
        per_page: size,
        sort_type: '',
        is_new: this.is_new,
        type: 1,
        box_type: this.cateList[this.currentIndex].box_type,
        type: this.cateList[this.currentIndex].type,
        is_recommend: this.cateList[this.currentIndex].is_recommend
      }
      if (this.cateList[this.currentIndex].id != 4) {
        data.sort_type = this.cateList[this.currentIndex].id
      } else {
        data.sort_type = this.cateList[this.currentIndex].sortType
      }
      this.req({
        url: '/v1/box/homeList',
        data,
        Loading: true,
        success: res => {
          if (res.code == 200) {
            if (num == 1) {
              this.listData = []
            }
            let newArr = res.data.data.map(item => ({
              ...item,
              loaded: false
            }));
            this.listData = [...this.listData, ...newArr]
            this.mescroll.endBySize(res.data.data.length, res.data.total)
          } else {
            this.mescroll.endBySize(0, 0)
          }
        }
      })
    },
    toDetail(item) {
      console.log(item)
      // return
      switch (item.type) {
        // 普通盒子
        case 1:
          // 一番赏
          switch (item.box_type) {
            case 1:
              this.$common.to({
                url: '/pages/box/firstReward',
                query: {
                  id: item.id,
                  title: '一番赏'
                }
              })
              break
            case 5:
              this.$common.to({
                url: '/pages/box/firstReward',
                query: {
                  id: item.id,
                  title: '宝箱'
                }
              })
              break
            // 无限赏
            case 2:
              this.$common.to({
                url: '/pages/box/kaixiang',
                query: {
                  id: item.id
                }
              })
              break
            // 福袋
            case 4:
              this.$common.to({
                url: '/pages/box/lotteryBag',
                query: {
                  id: item.id
                }
              })
              break
          }
          break
        // 对对碰
        case 4:
          this.$common.to({
            url: '/package/rightTouch/detail',
            query: {
              id: item.id
            }
          })
          break

      }

    },
    goList(item) {
      this.$common.to({
        url: '/pages/tabBar/goods',
        query: item
      })
    },
    goRoom() {
      this.$common.to({
        url: '/package/rightTouch/list'
      })
    },
    goTower() {
      this.$common.to({
        url: '/pages/box/tower'
      })
    },
    goMenu(item) {
      if (item.type === 5) {
        this.jump()
      }
      this.$common.to({
        url: item.url,
      })
    },
    // 获取当前用户队列状态
    getQueueStatus() {
      this.req({
        url: '/v1/box/getUserQueue',
        data: {},
        success: res => {
          if (res.code == 200) {
            this.userQueueInfo = res.data
            if (res.data && res.data.remainingTime > 0) {
              const countdown = res.data.remainingTime;
              this.$store.dispatch('startQueueCountdown', countdown)
            }
          }
        }
      });
    },
    onFinishCountDown() {
      this.$store.dispatch('stopQueueCountdown')
    },
    goYFS() {
      console.log(this.userQueueInfo)
      // 一番赏
      if (this.userQueueInfo.box_type == 1) {
        this.$common.to({
          url: '/pages/box/firstReward',
          query: {
            id: this.userQueueInfo.box_id,
            set_count: this.userQueueInfo.set_count
          }
        })
      } else if (this.userQueueInfo.box_type == 4) {
        this.$common.to({
          url: '/pages/box/lotteryBag',
          query: {
            id: this.userQueueInfo.box_id,
            set_count: this.userQueueInfo.set_count
          }
        })
      }
      else {
        // 无限赏
        this.$common.to({
          url: '/pages/box/kaixiang',
          query: {
            id: this.userQueueInfo.box_id
          }
        })
      }
    }
  },
}
</script>

<style lang='scss' scoped>
.cate-wrap {
  display: flex;
  margin: 20rpx 0;

  .cate-item {
    color: #777;
    font-size: 30rpx;
    font-weight: 700;
    margin-right: 20rpx;
    text-align: center;
    padding: 5rpx 15rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    padding-bottom: 10rpx;
    white-space: nowrap;
    /* 确保文字不换行 */
    position: relative;
    /* 设置为相对定位，为伪元素提供定位上下文 */

    &:last-child {
      margin-right: 0;
    }
  }

  .cate-item-active {
    color: #333333;
  }

  .cate-item-active::after {
    content: '';
    display: block;
    width: 60rpx;
    height: 10rpx;
    background-color: #333333;
    position: absolute;
    bottom: -5rpx;
    left: 50%;
    transform: translateX(-50%);
  }
}

.xc-top {
  background:url(/static/img/hmbg.png);
}

.home-page {
  height: 100vh;
  background: url(/static/img/hmbg.png);
  // background-repeat: repeat;


  .top-header {
    // background: linear-gradient(95deg, #8bf9ba, #c0fac6, #c3edee, #c2f6f4);
    border-bottom-left-radius: 30rpx;
    border-bottom-right-radius: 30rpx;
    padding: 0 30rpx;
    padding-top: 20rpx;
    // padding-bottom: 10rpx;
  }

  .home-body {
    padding: 0 30rpx;
  }


  .title-wrap {
    display: flex;
    align-items: center;
    color: #000;
    font-size: 40rpx;
    font-weight: 700;
    margin-bottom: 0rpx;
  }

  .box-wrap {
    margin-bottom: 20rpx;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .new-box-title {
    height: 82rpx;
    background: url('https://www.img.xcooo.cn/uploads/2024/03/a8a8919fa7bf9c39.png') no-repeat;
    background-size: 100% 100%;
    position: relative;

    .new-img {
      width: 62px;
      height: 62px;
      position: absolute;
      right: 15px;
      bottom: -30px;
    }
  }

  .box-list {
    width: 100%;
    height: 156px;
    margin: 15px auto;
    border-radius: 5px;
    overflow: hidden;
    box-sizing: border-box;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    padding: 13px 31px;
    background: url('https://www.img.xcooo.cn/uploads/2024/03/0c164d87c844fa6d.png') no-repeat;
    // background-size: 358px 156px;
    background-size: 100% 100%;
  }

  .new-box-content {
    height: 270rpx;
    box-sizing: border-box;
    border: 2px solid #cb5967;
    margin: 0;
    background: none;
  }

  .box-list-left {
    width: 104px;
    height: 104px;
    flex-shrink: 0;
    margin-right: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .good-list-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .box-list-right-name-2 {
    margin-top: 20px;
    height: 40px;
    font-size: 14px;
    color: #000;
    font-weight: 700;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .box-list-right-Zprice-active {
    width: 156px;
    height: 41px;
    -webkit-animation: newBtn 2s linear infinite;
    animation: newBtn 2s linear infinite;
    margin-top: 5px;
    display: flex;
    margin-bottom: 36rpx;

    box-sizing: border-box;

    image {
      width: 100%;
      height: 100% !important;
    }
  }

  @keyframes newBtn {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.1);
    }

    100% {
      transform: scale(1);
    }
  }

  .box-list-right-Zprice-image {
    width: 100%;
    height: 100%;
  }

  .price-view-0 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .product-price-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .price-view-0-right {
    font-size: 26rpx;
    color: #e20014;
    margin-left: 20rpx;
  }

  .box-list-right-Zprice-left {
    color: #cb5967;
    font-size: 12px;
    text-align: center;
    // background: url('https://img.alicdn.com/imgextra/i3/2215984279448/O1CN01NeifUh2JfEvWYT4jM_!!2215984279448.png') no-repeat;
    background-size: 100% 15px;
    margin-right: 20rpx;
  }

  .box-list-right-Zprice-right {
    font-size: 12px;
    color: #cb5967;
    // background: url('https://img.alicdn.com/imgextra/i3/2215984279448/O1CN01rX2qX22JfEvVkVh1w_!!2215984279448.png') no-repeat;
    background-size: 100% 15px;
  }



  .box-img-0 {
    height: 82rpx;
    width: 100%;
    margin-top: 10rpx;
    padding: 0 16rpx;
    padding-left: 0;
    display: flex;
    justify-content: space-between;
  }

  .box-img-0-view {
    width: 41px;
    height: 41px;
    background-color: #9400d3;
    border-radius: 5px;
    overflow: hidden;
  }

  .flip-box {
    position: relative;
    -webkit-animation: flip 4s linear infinite;
    animation: flip 4s linear infinite;

    .front {
      z-index: 2;
      -webkit-transform: rotateY(0deg);
      transform: rotateY(0deg);
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;

      .front-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .back {
      -webkit-transform: rotateY(-180deg);
      transform: rotateY(-180deg);
      z-index: 1;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;

      .back-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }


  }

  @keyframes flip {
    0% {
      transform: rotateY(0deg);
    }

    50% {
      transform: rotateY(180deg);
    }

    100% {
      transform: rotateY(0deg);
    }
  }

  .show-more {
    background-color: #fff;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #222;
    background-color: hsla(0, 0%, 100%, .2);
    opacity: .9;
    border: 1rpx solid #de8bfb;
    color: #de8bfb;
    font-weight: 700;
  }

}

.xc-popup {

  // width: 540rpx;
  .link-wrap {
    width: 85vw;
    padding: 40rpx 20rpx;

    .link-title {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 20rpx;
      text-align: center;
    }

    .link-url {
      margin: 0 20rpx;
      color: #62C234;
      margin: 10rpx 0;
      display: block;
      word-break: break-all;
    }

    .link-desc {
      margin-bottom: 40rpx;
    }

  }
}

.carousel-wrapper {
  margin-top: 30rpx;

  .invit-box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30rpx;
  }

  .invit-con {
    width: 220rpx;
    position: relative;

  }

  .invit-text {
    position: absolute;
    top: 40%;
    left: 10%;
    color: #FFFFFF;
    z-index: 999;
  }

  .carousel {
    border-radius: 20rpx;
    // overflow: hidden;
    /* height: calc(100vw * 340 / 750); */
    transform: translateY(0);
  }

  .carousel-img {
    width: 100%;
    border-radius: 20rpx;

    image {
      width: 100%;
    }
  }
}

.wind-list {
  position: absolute;
  top: -10rpx;
  width: 345px;
  height: 50px;
  background-size: 100% 100%;
  box-sizing: border-box;
  padding-top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;

  .notice-main {
    width: 100%;

    .notice-swiper {
      height: 50px;
      line-height: 50px;

      .swiper-item {
        .notice-swiper-item {
          width: 100%;
          height: 100%;
          background-image: url('https://www.img.xcooo.cn/uploads/2024/02/0d14c37cd7a6649c.png');
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          padding: 0 40rpx;
          box-sizing: border-box;

          .list-item-view {
            display: flex;
            align-items: center;
            box-sizing: border-box;

            .txxt-view {
              display: flex;
              align-items: center;
              box-sizing: border-box;

              .user-pic {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                overflow: hidden;
              }

              .username {
                width: 72px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
                color: #fff;
              }

              .goods_name {
                width: 166px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 12px;
                color: #fff;
                text-align: left;
              }
            }

            .good-img {
              width: 36px;
              height: 36px;
              border-radius: 50%;
              overflow: hidden;
              flex-shrink: 0;
            }
          }
        }
      }
    }
  }
}

.play-wrap {
  display: flex;
  justify-content: space-between;
  width: 100%;


  .pd-img {
    flex: 1;
    margin-right: 20rpx;

    &:last-child {
      margin-right: 0;
    }
  }
}

.menu-container {
  display: flex;
  align-items: center;
  padding: 30rpx 0;

  .menu-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 10rpx;

    &:last-child {
      margin-right: 0;
    }
  }

  .menu-image {
    width: 200rpx;
  }
}

.second-container {
  margin-top: -50rpx;
  display: flex;
  justify-content: space-between;

  .coupon-num {
    position: relative;
  }

  .menu-image {
    width: 206rpx;
  }

  .nav-image {
    width: 94rpx;
  }

  .coupon-text {
    position: absolute;
    writing-mode: vertical-rl;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    color: #040000;
    font-size: 32rpx;
    font-weight: 700;
  }

  .coupon-con {
    position: relative;

  }

  .sign-con {
    position: relative;
  }

  .sign-icon {
    width: 50rpx;

  }

  .sign-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .sign-text {
    color: #040000;
    font-weight: 700;
    font-size: 32rpx;
    writing-mode: vertical-rl;
  }
}



// 列表项目
.list-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx 0;

  .list-item {
    padding: 20rpx;
    background-color: #fff;
    box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.1);
    border-radius: 10rpx;
    overflow: hidden;
  }

  .image-wrap {
    position: relative;
    /* 开启相对定位，为标签绝对定位做准备 */
  }

  .tag {
    position: absolute;
    top: 0rpx;
    left: 0rpx;
    background-color: #FF9900;
    /* 标签背景色，可按需调整 */
    color: #fff;
    font-size: 24rpx;
    padding: 10rpx 20rpx;
    border-radius: 20rpx;
    border-bottom-left-radius: 0;
    border-top-right-radius: 0;
    z-index: 1;
    /* 保证标签在图片上方 */
  }

  .item-title {
    font-size: 28rpx;
    color: #333;
    margin-top: 10rpx;
    text-align: left;
    padding: 0 20rpx;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  /* 累计信息外层容器 */
  .item-count-wrap {
    display: flex;
    align-items: center;
    margin-top: 20rpx;

    /* “累计”标签样式 */
    .count-label {
      background-color: #333;
      /* 深色背景，可按需调整 */
      color: #fff;
      font-size: 24rpx;
      padding: 4rpx 8rpx;
      border-radius: 20rpx;
    }

    /* 数量样式 */
    .count-number {
      background-color: #f2f2f2;
      color: #999;
      font-size: 24rpx;
      padding: 4rpx 8rpx;
      border-radius: 20rpx;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      min-width: 100rpx;
      text-align: center;
    }
  }



  .item-price {
    font-size: 24rpx;
    color: #000;
    padding: 20rpx 20rpx;
    font-weight: 700;

    .price {
      font-size: 32rpx;
    }

    .price-text {
      color: #999;
      margin-left: 10rpx;
    }
  }
}


::v-deep .u-mode-center-box {
  background: transparent !important;
}

.bgbox {
  background: transparent;
  background: url('https://img.alicdn.com/imgextra/i4/2200676927379/O1CN01gTyc2924NdcXV2Wi1_!!2200676927379.png') no-repeat;
  background-size: 100% 100%;
  width: 540rpx;
  height: 680rpx;
  position: relative;

  .content {
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);

    .ma {
      width: 300rpx;
      height: 300rpx;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .yi {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    line-height: 26px;
    margin-top: 40rpx;
  }

  .off {
    text-align: right;
    padding: 15px;
    box-sizing: border-box;
    position: absolute;
    right: -7%;
    // bottom: -20%;
  }


}

.fixed-timer {
  position: fixed;
  top: 28%;
  right: 30rpx;
  z-index: 999;
}
</style>