<template>
  <view>
      <uni-nav-bar :title="optionsData.title" color="#000" leftIcon="left" backgroundColor="#fff" :border="false" :statusBar="true"
      :fixed="true" @clickLeft="$common.back()"></uni-nav-bar>
        <view class="home-body">
          <mescroll-body ref="mescrollRef" height="400" @init="mescrollInit" @down="downCallback" @up="getList"
            :down="downOption" :up="upOption">
            <view class="list-container">
              <view class="list-item" v-for="(item, index) in listData" :key="item.id" @click="toDetail(item)">
                <!-- 图片自适应比例显示 如 "16:9"、"4:3"、"1:1" 等 -->
                <view class="image-wrap">
                  <xc-image :src="item.thumb" ratio="3:3" @load="onImageLoad(item)" :borderRadius="20" />
                  <!-- 标签元素，这里先写死为“无限抽”，实际可根据数据动态判断 -->
                  <view class="tag" :style="{ backgroundColor: tagMap(item).color }">
                    {{ tagMap(item).text }}
                  </view>
                </view>
                <view class="item-title">{{ item.title }}</view>
                <!-- 累计信息（仅“无限抽”显示） -->
                <!-- <view class="item-count-wrap" v-if="tagMap(item).text === '无限抽'">
                <view class="count-label">累计</view>
                <view class="count-number">{{ item.sales || 0 }} 张</view>
              </view> -->
                <view class="item-price"><text>¥</text><text class="price">{{ item.price }}</text><text
                    class="price-text">售价</text></view>
              </view>
            </view>
          </mescroll-body>
        </view>
    </view>
</template>


<script>
const switchMusic = uni.createInnerAudioContext();
const bgMusic = uni.createInnerAudioContext();
import { mapGetters } from 'vuex'
export default {
  name: 'home',
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
    console.log(this.optionsData, '1111');


  },
  onShow() {
    // this.getLog()
    this.getQueueStatus()
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
        is_new: this.optionsData.is_new,
        type: 1,
        box_type: this.optionsData.box_type,
        type: this.optionsData.type,
        is_recommend: this.optionsData.is_recommend || ''
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
    goRoom() {
      this.$common.to({
        url: '/package/rightTouch/list'
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

<style>
.home-body {
  padding: 0 30rpx;
}

.top-header {
  padding: 0 30rpx;
  padding-top: 20rpx;
}

.list-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 50rpx 0;
}

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
  overflow: hidden;
}

/* 累计信息外层容器 */
.item-count-wrap {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
}

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



.item-price {
  font-size: 24rpx;
  color: #000;
  padding: 20rpx 20rpx;
  font-weight: 700;
}

.price {
  font-size: 32rpx;
}

.price-text {
  color: #999;
  margin-left: 10rpx;
}
</style>