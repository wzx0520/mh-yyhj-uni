<!--
 * @Date: 2022-12-07 14:57:46
 * @LastEditTime: 2025-08-04 08:55:26
 * @Description: content
-->
<template>
  <view class="page-wrap">
    <uni-nav-bar title="盒柜" color="#000" leftIcon="left" backgroundColor="#fff" :border="false" :statusBar="true"
      :fixed="true" @clickLeft="$common.back()"></uni-nav-bar>

    <view class="tab-list-content" :style="{
      top: `calc(${sysConfig.statusBarHeight}px + 44px)`
    }">
      <u-tabs :list="bagList" bg-color="#fff" :is-scroll="false" :current="currentTab" @change="changeTabs"></u-tabs>

      <view class="tab-list" v-if="currentTab == 0">
        <view @click="tabChage(i)" v-for="(item, i) in tabList" :key="i" class="tab-list-item" :class="{
          act: tabCur == i
        }">
          {{ item.title }}
        </view>
      </view>
    </view>

    <u-gap height="150" v-if="currentTab == 0"></u-gap>
    <u-gap height="70" v-if="currentTab == 1"></u-gap>

    <view class="list" v-if="listData.length && tabCur != 1">
      <view v-for="(item, i) in listData" :key="i" class="list-item">
        <view class="list-item-wrap">
          <!-- 复选框（仅 tabCur == 0 显示） -->
          <view class="cart_chk_warp" v-if="tabCur === 0">
            <u-checkbox-group @change="hangldeItemChange">
              <u-checkbox v-model="item.checked"></u-checkbox>
            </u-checkbox-group>
          </view>

          <!-- 商品卡片主体 -->
          <view class="card-item">
            <view class="list-item-hd">
              <view class="pic">
                <cimage :src="item.thumb" mode="scaleToFill" />
                <!-- 标签 -->
                <view v-if="item.mark_title" :style="{ background: item.mark_color }" class="tag">
                  <template v-if="item.is_box === 1">BX赏</template>
                  <template v-else>{{ item.mark_title }}</template>
                </view>
              </view>

              <view class="info">
                <view class="title hang2">{{ item.title }}</view>
                <!-- 可分解余额（仅 currentTab == 0 显示） -->
                <view class="title return_wrap" v-if="currentTab === 0">
                  <view class="return_price">
                    <image class="return-img" src="https://www.img.xcooo.cn/uploads/2024/02/231fcebf5c7a968d.png"
                      mode="widthFix" />
                    可分解余额: {{ item.total_return_price }}
                  </view>
                </view>

                <!-- 数量操作 -->
                <view class="return_total">
                  <u-number-box :min="1" v-model="item.num" :max="item.total"
                    @change="totalChange(item, $event)"></u-number-box>
                  <view class="return_num">X {{ item.total }}</view>
                </view>
              </view>
            </view>

            <!-- 操作按钮区 -->
            <view class="list-item-bd">
              <template v-if="tabCur === 0">
                <!-- 分解 -->
                <view @click="openDhModel(item)" v-if="item.type === 1 || item.type === 5 || item.type === 6" class="btn">
                  分解</view>
                <!-- 提货 -->
                <view @click="toSend(item)" class="btn" v-if="currentTab === 0">提货</view>
                <!-- 宝箱详情 -->
                <view @click="openBoxDetail(item)" class="btn" v-if="currentTab === 1">宝箱详情</view>
                <!-- 开宝箱 -->
                <view @click="openOneBox(item)" class="btn" v-if="currentTab === 1" :class="{ disabled: isRequesting }"
                  :style="{ pointerEvents: isRequesting ? 'none' : 'auto' }">
                  {{ isRequesting ? '开启中...' : '开宝箱' }}
                </view>
              </template>

              <!-- 查看详情（tabCur == 1 或 4） -->
              <view @click="toDetail(item)" v-if="tabCur === 1 || tabCur === 4" class="btn">查看详情</view>

              <!-- 物流/确认收货（tabCur == 2） -->
              <template v-if="tabCur === 2">
                <view @click="toExpress(item)" class="btn">查看物流</view>
                <view @click="openModel(item)" class="btn">确认收货</view>
              </template>

              <!-- 去评价（tabCur == 3 且 特定条件） -->
              <view @click="toComment(item)"
                v-if="tabCur === 3 && item.type === 1 && (item.mark_id === 1 || item.mark_id === 2)" class="btn">去评价
              </view>

              <!-- 再次购买（tabCur == 4 且 特定条件） -->
              <view @click="buyAgain(item)" v-if="tabCur === 4 && item.type === 1 && item.is_change === 0" class="btn">
                再次购买</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- status ≠ 0 的场景 -->
    <view class="list" v-else-if="listData.length && tabCur == 1">
      <view v-for="(shipItem, i) in listData" :key="i" class="ship-item">
        <!-- 发货信息概览 -->
        <view class="ship-header">
          <!-- 状态标签 + 操作区 单独一行 -->
          <view class="ship-header-top">
            <view class="status-tag" :style="{
              background: statusColor,
              color: statusTextColor
            }">
              {{ tabList[tabCur]['title'] }}
            </view>
            <!-- <view class="top-actions">
              <view class="action-btn edit-btn" @click="editAddress(shipItem)">
                修改地址
              </view>
              <view class="action-btn edit-btn" >
                复制单号
              </view>
            </view> -->
          </view>

          <!-- 核心信息区，分两列布局 -->
          <view class="ship-header-main">
            <view class="ship-info-col">
              <view class="info-item">
                <text class="label">发货单号：</text>
                <text class="value">{{ shipItem.ship_id }}</text>
              </view>
              <view class="info-item">
                <text class="label">收货信息：</text>
                <text class="value">{{ shipItem.address }} {{ shipItem.recipient }} {{ shipItem.mobile }}</text>
              </view>
              <view class="info-item">
                <text class="label">申请用户：</text>
                <text class="value">{{ shipItem.name }}</text>
              </view>
            </view>
            <view class="ship-info-col">
              <view class="info-item">
                <text class="label">申请时间：</text>
                <text class="value">{{ shipItem.ship_time }}</text>
              </view>
              <view class="info-item">
                <text class="label">发货数量：</text>
                <text class="value">× {{ shipItem.total_count }}</text>
              </view>
              <view class="info-item">
                <text class="label">发货编号：</text>
                <text class="value">NO.{{ shipItem.total_return_value }}</text>
              </view>
            </view>
          </view>

          <!-- 新增的发货详情行 -->
          <view class="ship-detail-row">
            <view class="detail-left" @click="viewShipInfo(shipItem)">
              <text class="detail-title">发货详情</text>
              <u-icon name="arrow-right" size="28" color="#000" class="detail-arrow"></u-icon>
            </view>
            <view class="detail-right">
              <view class="detail-btn" @click="copyShip(shipItem)">
                复制单号
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <template v-else>
      <view class="empty-list">
        <u-empty text="暂无数据~" mode="list"></u-empty>
      </view>
    </template>
    <template v-if="tabCur == 0">
      <!-- <view class="btn-bootm">
        <view class="btn btn-01" :style="{ 'background-image': 'url(' + `${imgBaseUrl}/static/web/06.png` + ')' }"
          @click="allChecked">{{ all ? '反选' : '全选' }}</view>
      </view>
      <view class="btn-bootm">
        <view class="btn btn-02" :style="{ 'background-image': 'url(' + `${imgBaseUrl}/static/web/06.png` + ')' }"
          @click="zsong">赠送</view>
      </view>
      <view class="btn-bootm">
        <view class="btn btn-04" :style="{ 'background-image': 'url(' + `${imgBaseUrl}/static/web/06.png` + ')' }"
          @click="rongjie">分解</view>
      </view>
      <view class="btn-bootm" v-if="currentTab == 1">
        <view class="btn btn-05" :style="{ 'background-image': 'url(' + `${imgBaseUrl}/static/web/06.png` + ')' }"
          @click="allOpen">开宝箱</view>
      </view>
      <view class="btn-bootm" v-if="currentTab == 0">
        <view class="btn btn-03" :style="{ 'background-image': 'url(' + `${imgBaseUrl}/static/web/06.png` + ')' }"
          @click="tihuo">提货</view>
      </view> -->
    </template>

    <!-- 底部操作工具栏（新增/修改部分） -->
    <view class="bottom-toolbar" :style="{ '--tab-bar-height': tabBarHeight + 'px' }">
      <!-- 全选反选区域 -->
      <view class="toolbar-select">
        <view class="">
          <u-checkbox shape="circle" :value="all" @change="handleAllCheck"></u-checkbox>
          <text class="select-text" @click="allChecked">
            {{ all ? '反选' : '全选' }}
          </text>
          <text class="split">|</text>
          <text class="select-text" @click="reverseCheck">反选</text>
        </view>

        <!-- 选中数量文本 -->
        <view class="toolbar-count">
          选中数量:{{ selectedCount }}
        </view>
      </view>

      <!-- 操作按钮区域 -->
      <view class="toolbar-btns">
        <view class="toolbar-btn btn-boder" @click="rongjie" v-if="currentTab == 0">
          分解
        </view>
        <!-- <view class="toolbar-btn lock-btn" @click="handleLock">
          锁定
        </view> -->
        <view class="toolbar-btn deliver-btn" @click="tihuo" v-if="currentTab == 0">
          提货
        </view>
        <view class="toolbar-btn openall-btn" @click="allOpen" v-if="currentTab == 1" :class="{ disabled: isRequesting }"
          :style="{ pointerEvents: isRequesting ? 'none' : 'auto' }">
          {{ isRequesting ? '开启宝箱中...' : '批量开宝箱' }}
        </view>
      </view>

    </view>

    <u-popup v-model="zsShow" mode="center" border-radius="16" height="30%" :closeable="true" @close="closeZz">
      <view class="zsbox">
        <view class="zs-title">请输入对方ID</view>
        <view class="zs-input-wrap">
          <u-field class="zs-input" v-model="zsid" placeholder="请输入对方ID"></u-field>
        </view>

        <view class="zs-tip">注: 一旦转赠成功不可撤回, 请谨慎操作!</view>

        <view class="zs-btn-wrap">
          <view class="zs-btn zs-btn-01" @click="cacelZs">
            取消
          </view>
          <view class="zs-btn zs-btn-02" @click="zsSubmit">
            确定
          </view>
        </view>
      </view>
    </u-popup>

    <u-modal v-model="showModel" :title="'提示'" :content="'请确认是否已收到货'" :show-cancel-button="true"
      @confirm="submitGet"></u-modal>

    <u-modal v-model="showRj" :title="'提示'" @confirm="duihuan" content="分解根据市场成本变化，一经分解无法撤销，请确认是否分解？"
      :show-cancel-button="true"></u-modal>

    <u-popup v-model="rjShow" mode="bottom" border-radius="16" height="50%" :closeable="true" @close="closeRj">
      <view class="rj-wrap">
        <view class="rj-title">分解确认单</view>
        <view class="rj-desc">确定要分解选中的赏品吗?</view>
        <view class="rj-mall">
          <view class="rj-shop">
            <view class="rj-shop-title">
              已选赏品
            </view>
            <view class="rh-shop-num">
              共<text>{{ totalNum }}</text>件
            </view>
          </view>
          <scroll-view class="ri-shop-scroll" scroll-x>
            <view class="ri-shop-list">
              <view class="ri-shop-item" v-for="(item, index) in checkedList" :key="index">
                <view class="rj-shop-img-wrap">
                  <image class="ri-shop-img" :src="item.thumb" mode="widthFix" lazy-load="false" binderror=""
                    bindload="" />
                </view>
                <view class="rj-shop-num">x{{ item.num }}</view>
                <view class="rj-shop-title">{{ item.title }}</view>
                <view class="rj-shop-money">可分解余额: {{ item.total_return_price }}</view>
              </view>

            </view>
          </scroll-view>
        </view>
        <view class="rj-bottom">
          <view class="rj-money">
            <image class="ri-bottom-img" src="https://www.img.xcooo.cn/uploads/2024/02/231fcebf5c7a968d.png"
              mode="widthFix" lazy-load="false" binderror="" bindload="" />可分解余额: {{ totalPrice.toFixed(2) }}
          </view>
          <view class="rj-btn" @click="duihuan">
            确认分解
          </view>
        </view>
      </view>
    </u-popup>
    <!-- 宝箱详情物品 -->
    <u-popup v-model="isBoxPopupShow" mode="center" border-radius="20" width="90%">
      <view class="box-content">
        <view class="box-popup-title">宝箱物品</view>
        <view class="box-popup-desc">打开后随机获得一个赏品</view>
        <template v-if="boxDetail.length">
          <view class="award-grid">

            <view class="award-card" v-for="(award, index) in boxDetail" :key="index">
              <view class="award-img-container">
                <image :src="award.thumb" class="award-img" mode="aspectFill"></image>
                <view class="award-tag">{{ award.mark_title || 'A' }}</view>
                <!-- <view class="award-probability">{{ award.show_rate }}%</view> -->
              </view>
              <view class="award-info">
                <view class="award-name">{{ award.title }}</view>
                <view class="award-ref-price">参考价{{ award.price }}</view>
              </view>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="empty">
            <u-empty text="暂无数据" mode="list"></u-empty>
          </view>
        </template>
        <view class="close-btn-wrap">
          <button class="box-popup-close-btn" @click="isBoxPopupShow = false">关闭</button>
        </view>
      </view>
    </u-popup>

    <!-- 宝箱中奖物品 -->
    <u-popup v-model="boxAwradShow" mode="center" border-radius="20" width="90%">
      <view class="box-content">
        <view class="box-popup-title">宝箱赏品预览</view>
        <view class="box-popup-desc">恭喜获得以下赏品</view>
        <template v-if="awardList.length">
          <view class="award-grid">
            <view class="award-card" v-for="(award, index) in awardList" :key="index">
              <view class="award-img-container">
                <image :src="award.thumb" class="award-img" mode="aspectFill"></image>
                <view class="award-tag">{{ award.mark_title || 'A' }}</view>
                <view class="award-probability">x{{ award.num }}</view>
              </view>
              <view class="award-info">
                <view class="award-name">{{ award.title }}</view>
                <view class="award-ref-price">参考价{{ award.price }}</view>
              </view>
            </view>
          </view>
        </template>
        <template v-else>
          <view class="empty">
            <u-empty text="暂无数据" mode="list"></u-empty>
          </view>
        </template>
        <view class="close-btn-wrap">
          <button class="box-popup-close-btn" @click="boxAwradShow = false">关闭</button>
        </view>
      </view>
    </u-popup>

    <view class="fixed-timer">
      <CountdownCircle @click="goYFS" @finish="onFinishCountDown" />
    </view>
    <!-- <cusTabbar /> -->
  </view>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  data () {
    return {
      optionsData: '',
      // 下拉刷新的配置(可选, 绝大部分情况无需配置)
      downOption: {
        auto: false
      },
      // 上拉加载的配置(可选, 绝大部分情况无需配置)
      upOption: {
        auto: false,
        page: {
          size: 20 // 每页数据的数量,默认10
        },
        empty: {
          use: true, // 是否显示空布局
          // icon: "https://img.alicdn.com/imgextra/i3/2200676927379/O1CN01j9LvjN24NdcpT0y4i_!!2200676927379.png", // 图标路径
          tip: '这里什么都没有~', // 提示
          fixed: false, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效 (transform会使fixed失效,最终会降级为absolute)
          top: "100rpx", // fixed定位的top值 (完整的单位值,如 "10%"; "100rpx")
          zIndex: 99 // fixed定位z-index值
        },
      },
      listData: [],
      selectedCount: 0, // 选中数量
      tabList: [{
        id: 0,
        title: '待提货'
      },
      {
        id: 1,
        title: '待发货'
      },
      {
        id: 2,
        title: '已发货'
      },
      // {
      //   id: 3,
      //   title: '已完成'
      // },
      {
        id: 4,
        title: '已完成'
      },
      ],
      tabCur: 0,
      btnList: [],
      btnCur: 0,
      canRefresh: false,
      curItem: '',
      showModel: false,
      showRj: false,
      zsShow: false,
      zsid: '',
      userInfo: '',
      // ---------分割线----------
      // 全选
      all: false,
      rjShow: false,
      // 总数
      totalNum: 0,
      // 总价格
      totalPrice: 0,
      checkedList: [],
      bagList: [
        {
          name: '现货柜'
        }, {
          name: '宝箱柜'
        }
      ],
      currentTab: 0,
      isBoxPopupShow: false,
      boxDetail: [],
      boxAwradShow: false,
      awardList: [],
      oneBox: {},
      userQueueInfo: {},
      tabBarHeight: 0, // TabBar 高度
      isRequesting: false, // 全局请求锁
      btnDisabled: false,  // 按钮禁用状态
      oneBox: null,        // 单独开的宝箱
      showExpressBtn: false
    }
  },

  computed: {
    ...mapGetters(['sysConfig']),
    statusColor () {
      // 根据 tabCur 对应的状态设置不同背景色
      const statusColorMap = {
        0: '#FFA500', // 待提货 - 橙色
        1: '#FFD700', // 待发货 - 金色 
        2: '#32CD32', // 已发货 - 绿色
        4: '#90EE90'  // 已完成 - 浅绿
      };
      return statusColorMap[this.tabCur] || '#fff';
    },
    statusTextColor () {
      // 根据背景色动态调整文字颜色，保证可读性
      const bgColor = this.statusColor;
      // 简单的颜色亮度判断（可根据实际需求优化）
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? '#333' : '#fff';
    }
  },
  onLoad (options) {
    this.optionsData = options
  },
  onShow () {
    // this.tabCur = getApp().globalData.tabCur ?? 0
    // this.currentTab = getApp().globalData.tabCur ?? 0
    this.$store.dispatch('getUserInfo').then(res => {
      this.userInfo = res.data
    })
    this.all = false
    // this.getTab()
    this.getQueueStatus()
    this.getList()
    this.getTabBarHeight();
  },
  watch: {
    // 监听列表数据变化，实时计算选中数量
    listData: {
      deep: true,
      handler (newVal) {
        this.selectedCount = newVal.filter(item => item.checked).length;
      }
    },
    rjShow (val) {
      console.log(val)
      if (!val) {
        this.totalNum = 0
        this.totalPrice = 0
        this.checkedList = []
      }
    }
  },
  methods: {
    // 获取 TabBar 高度
    getTabBarHeight () {
      const info = uni.getSystemInfoSync();
      // #ifdef H5
      this.tabBarHeight = 50; // H5 默认高度
      // #endif

      // #ifdef APP-PLUS
      this.tabBarHeight = 80; // App 默认高度
      // #endif

      // #ifdef MP
      // 微信小程序获取 TabBar 高度
      const res = uni.getMenuButtonBoundingClientRect();
      this.tabBarHeight = info.screenHeight - res.bottom + res.height + 30;
      // #endif
    },
    // 全选/反选主逻辑
    allChecked () {
      this.all = !this.all;
      this.listData.forEach(item => {
        item.checked = this.all;
      });
    },
    // 单独处理全选复选框状态（可选，根据 u-checkbox 逻辑调整）
    handleAllCheck (val) {
      this.all = val;
      this.listData.forEach(item => {
        item.checked = val;
      });
    },
    // 反选逻辑
    reverseCheck () {
      this.listData.forEach(item => {
        item.checked = !item.checked;
      });
      // 同步全选状态
      this.all = this.listData.every(item => item.checked);
    },
    openBoxDetail (item) {
      this.isBoxPopupShow = true
      this.boxDetail = item.award_items
    },
    changeTabs (index) {
      this.all = false
      this.currentTab = index;
      this.getList()
    },
    resetParams () {
      this.listData = []
      this.rjShow = false
      this.totalNum = 0
      this.totalPrice = 0
      this.checkedList = []
    },
    // 步进器 
    totalChange (item, e) {
      // 当前数量
      let value = e.value
      item.total_return_price = this.preciseMultiply(item.return_price, value)
    },
    // 自定义函数来处理浮点数乘法精度问题
    preciseMultiply (a, b) {
      const factor = Math.pow(10, 10);
      let num = (Math.round(a * factor) * Math.round(b * factor)) / (factor * factor);
      return num.toFixed(2)
    },
    // 自定义函数来处理浮点数加法精度问题
    preciseAdd (a, b) {
      function toInteger (floatNum) {
        var str = floatNum.toString();
        var dotPos = str.indexOf('.');
        var len = str.length - (dotPos + 1);
        var factor = Math.pow(10, len);
        var intNum = Math.round(floatNum * factor);
        return { intNum, factor };
      }

      var aInt = toInteger(a);
      var bInt = toInteger(b);

      var maxFactor = Math.max(aInt.factor, bInt.factor);
      var result = (aInt.intNum * (maxFactor / aInt.factor)) + (bInt.intNum * (maxFactor / bInt.factor));
      return result / maxFactor;
    },
    closeRj () {
      this.rjShow = false
    },
    // 批量溶解
    rongjie () {
      // this.all = true
      let flag = this.listData.some(item => item.checked)
      if (!flag) {
        this.$common.toast({
          title: '请选择要分解的赏品',
          icon: 'none',
          duration: 1500,
        })
        return
      }
      this.checkedList = this.listData.filter(item => item.checked)

      this.checkedList.forEach(v => {
        // 计算总数
        this.totalNum = this.preciseAdd(this.totalNum, v.num)
        // 计算总分解价格
        let itemPrice = this.preciseMultiply(v.num, v.return_price)
        this.totalPrice = this.preciseAdd(this.totalPrice, itemPrice)
      })

      this.rjShow = true
    },
    closeZz () {
      this.zsShow = false
      this.zsid = ''
    },
    cacelZs () {
      this.zsShow = false
      this.zsid = ''
    },
    zsSubmit () {
      if (this.zsid == '') {
        this.$common.toast({
          title: '请输入对方ID',
          icon: 'none',
          duration: 1500,
        })
        return
      }
      let goods_id = []
      this.checkedList.forEach((item, index) => {
        for (let i = 1; i <= item.num; i++) {
          goods_id.push(item.goods_id)
        }
      })
      this.req({
        url: '/v1/user/ship/echargez',
        data: {
          zsid: this.zsid,
          goods_id
        },
        Loading: true,
        success: (res) => {
          if (res.code == 200) {
            this.$common.toast({
              title: '赠送成功',
              icon: 'success',
              duration: 1500,
              success: () => {
                this.zsShow = false
                this.getList()
              }
            })
          }
        }
      })
    },
    zsong () {
      let newArr = this.listData.filter(item => item.checked)
      if (newArr.length == 0) {
        this.$common.toast({
          title: '请选择至少一个赏品',
          icon: 'none',
          duration: 1500,
        })
        return
      }
      this.zsShow = true
      this.checkedList = newArr
    },
    allChecked () {
      this.all = !this.all
      this.listData.forEach(item => {
        item.checked = this.all
      })
    },
    toSend (item) {
      // 当前箱子商品
      const items = [item]

      if (items.length === 0) {
        this.$common.toast({
          title: '暂无可提货商品',
          icon: 'none',
          duration: 1500,
        });
        return;
      }

      // 构造传递数组，保留需要字段
      const goodsArray = items.map(item => ({
        goods_id: item.goods_id,
        num: item.num,
        id: item.id,
      }));

      const queryStr = encodeURIComponent(JSON.stringify(goodsArray));

      this.$common.to({
        url: '/package/mine/bag-send',
        query: {
          goods: queryStr
        }
      });

      console.log('跳转同箱子提货', goodsArray);
    },

    tihuo () {
      const checkedItems = this.listData.filter(item => item.checked);
      if (checkedItems.length === 0) {
        this.$common.toast({
          title: '暂无可提货商品',
          icon: 'none',
          duration: 1500,
        });
        return;
      }

      // 多商品参数，直接传一个数组，每条保留 goods_id、num、id
      // 注意编码成字符串，避免 url 参数错乱
      const goodsArray = checkedItems.map(item => ({
        goods_id: item.goods_id,
        num: item.num,
        id: item.id,
      }));

      const queryStr = encodeURIComponent(JSON.stringify(goodsArray));

      this.$common.to({
        url: '/package/mine/bag-send',
        query: {
          goods: queryStr,
        }
      });

      console.log('多商品提货:', goodsArray);
    },
    buyAgain (item) {
      this.$common.to({
        url: '/package/box/box-detail',
        query: {
          id: item.box_id
        }
      })
    },
    openModel (item) {
      this.curItem = item
      this.showModel = true
    },
    openDhModel (item) {
      this.curItem = item
      this.showRj = true
    },
    hangldeItemChange (e) {
      console.log(e)
    },
    toExchange (item) {

    },
    toComment (item) {
      this.$common.to({
        url: '/package/mine/comment',
        query: {
          id: item.id,
          title: item.title
        }
      })
    },
    submitGet () {
      this.req({
        url: '/v1/user/ship/box/receipt',
        data: {
          goods_id: this.curItem.goods_id,
          num: this.curItem.num,
          status: this.curItem.status
        },
        success: res => {
          if (res.code == 200) {
            this.$common.toast({
              title: res.msg,
              icon: 'success',
              duration: 600,
              success: () => {
                this.resetParams()
                this.getList()
              }
            })
          }
        }
      })
    },
    duihuan () {
      let goods_id = []
      if (this.checkedList.length > 0) {
        // 处理奖品id
        this.checkedList.forEach((item, index) => {
          for (let i = 1; i <= item.num; i++) {
            goods_id.push(item.goods_id)
          }
        })
      } else {
        for (let i = 1; i <= this.curItem.num; i++) {
          goods_id.push(this.curItem.goods_id)
        }
      }

      this.req({
        url: '/v1/user/ship/box/dissolveByGoodsId',
        data: {
          goods_id
        },
        success: res => {
          if (res.code == 200) {
            this.$common.toast({
              title: res.msg,
              icon: 'success',
              duration: 600,
              success: () => {
                this.all = false
                this.listData = []
                this.rjShow = false
                this.getList()
              }
            })
          }
        }
      })
    },
    btnChange (e) {
      this.btnCur = e
      this.resetParams()
      this.getList()
    },
    getTab () {
      return new Promise((resolve, reject) => {
        this.req({
          url: '/v1/box/mark',
          data: {},
          Loading: true,
          success: res => {
            if (res.code == 200) {
              this.btnList = res.data.map(item => {
                if (item.id == 1) {
                  item.title = '传说'
                }
                if (item.id == 4) {
                  item.title = '高级'
                }
                return item
              })
              this.getList()
              resolve()
            }
          }
        })
      })
    },
    // 单独开宝箱
    openOneBox (item) {
      // 如果正在请求，直接拦截
      if (this.isRequesting) {
        this.$common.toast({ title: '操作处理中，请稍候', icon: 'none' });
        return;
      }
      // 清空批量选中列表，避免参数冲突
      this.checkedList = [];
      // 赋值单独开的宝箱
      this.oneBox = item;
      // 调用开箱方法
      this.openBox('single'); // 传递操作类型：single-单独开
    },
    // 批量开宝箱
    allOpen () {
      // 如果正在请求，直接拦截
      if (this.isRequesting) {
        this.$common.toast({ title: '操作处理中，请稍候', icon: 'none' });
        return;
      }
      // 检查是否有选中项
      const checkedItems = this.listData.filter(item => item.checked);
      if (checkedItems.length === 0) {
        this.$common.toast({ title: '请选择要开的宝箱', icon: 'none' });
        return;
      }
      // 清空单独开的参数，避免冲突
      this.oneBox = null;
      // 赋值批量选中列表
      this.checkedList = checkedItems;
      // 调用开箱方法
      this.openBox('batch'); // 传递操作类型：batch-批量开
    },
    // 核心开箱逻辑（接收操作类型）
    openBox (type) {
      // 再次校验请求锁（防止极端情况）
      if (this.isRequesting) return;

      // 1. 构建请求参数
      let items = [];
      if (type === 'single' && this.oneBox) {
        // 单独开：使用oneBox参数
        items.push({
          order_id: this.oneBox.order_id,
          goods_id: this.oneBox.goods_id,
          num: this.oneBox.num
        });
      } else if (type === 'batch' && this.checkedList.length > 0) {
        // 批量开：使用checkedList参数
        items = this.checkedList.map(item => ({
          order_id: item.order_id,
          goods_id: item.goods_id,
          num: item.num
        }));
      } else {
        // 参数异常处理
        this.$common.toast({ title: '参数错误，请重试', icon: 'none' });
        return;
      }

      // 2. 锁定状态，禁用按钮
      this.isRequesting = true;
      this.btnDisabled = true;
      // 显示加载提示（区分操作类型）
      this.$common.toast({
        title: type === 'single' ? '正在开启宝箱...' : '正在批量开启宝箱...',
        icon: 'loading',
        duration: 0 // 不自动关闭，手动控制
      });

      // 3. 发起请求
      this.req({
        url: '/v1/user/openbox',
        data: { items },
        success: (res) => {
          if (res.code === 200) {
            this.$common.toast({
              title: res.msg || (type === 'single' ? '宝箱开启成功' : '批量开启成功'),
              icon: 'success',
              duration: 600,
              success: () => {
                // 重置参数和列表
                this.resetParams();
                this.all = false;
                this.currentTab = 1;
                this.getList(); // 重新获取列表
                this.boxAwradShow = true;
                this.awardList = res.data.list;
              }
            });
          } else {
            // 接口返回错误（如后端验证失败）
            this.$common.toast({ title: res.msg || '操作失败', icon: 'none' });
          }
        },
        fail: () => {
          // 网络错误等
          this.$common.toast({ title: '网络异常，请重试', icon: 'none' });
        },
        complete: () => {
          // 4. 无论成败，解锁状态
          this.isRequesting = false;
          this.btnDisabled = false;
          // 清空临时参数（避免下次操作冲突）
          this.oneBox = null;
          this.checkedList = [];
        }
      });
    },
    getList () {
      this.req({
        url: '/v1/user/award',
        data: {
          status: this.tabList[this.tabCur].id,
          is_box: this.currentTab
        },
        Loading: true,
        success: res => {
          if (res.code == 200) {
            let newArr = res.data.map(item => {
              if (item.mark_id == 33) {
                item.mark_title = 'A赏'
              } else if (item.mark_id == 34) {
                item.mark_title = 'B赏'
              }
              else if (item.mark_id == 35) {
                item.mark_title = 'C赏'
              } else if (item.mark_id == 36) {
                item.mark_title = 'D赏'
              }
              return { ...item, checked: false, num: item.total }
            })

            this.listData = newArr
          } else {
          }
        }
      })
    },
    toExpress (item) {
      this.$common.to({
        url: '/package/mine/bag-express',
        query: {
          id: item.id
        }
      })
    },
    viewShipInfo (item) {
      this.$common.to({
        url: '/pages/tabBar/bag-detail',
        query: {
          ship_id: item.ship_id
        }
      })
    },
    toDetail (item) {
      this.$common.to({
        url: '/package/mine/bag-order-detail',
        query: {
          goods_id: item.goods_id,
          status: item.status,
          num: item.num
        }
      })
    },
    tabChage (e) {
      this.tabCur = e
      getApp().globalData.tabCur = e
      this.resetParams()
      this.getList()
    },
    // 获取当前用户队列状态
    getQueueStatus () {
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
    onFinishCountDown () {
      this.$store.dispatch('stopQueueCountdown')
    },
    goYFS () {
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
    },
    copyShip (shipItem) {
      this.$copy({
        content: shipItem.ship_id,
        success (res) {
          uni.showToast({
            title: res,
            icon: 'success'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  // background: #effceb;
  // background: #effdea;
}

.page-wrap {
  // background: url("https://img.alicdn.com/imgextra/i1/2200676927379/O1CN01B5oy6T24NdWgIw6JR_!!2200676927379.png") no-repeat;
  // background-size: 100% 100%;
  background-color: #fff;
  max-height: 100vh;
  overflow: hidden;
  overflow-y: scroll;

  ::v-deep .uni-nav-bar-text {
    font-size: 36rpx;
    font-family: xcooo;
  }

  ::v-deep .uni-navbar__header-btns-left {
    font-size: 16px;
    width: 80px !important;
    color: #705cff;
  }

  ::v-deep .uni-navbar__header-btns-right {
    font-size: 16px;
    width: 80px !important;
    color: #705cff;
  }

  .tab-list-content {
    position: fixed;
    left: 0;
    width: 100%;
    z-index: 10;
  }

  .tab-list {
    // height: 88rpx;
    padding: 20rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    // background: #dbf7cb;
    // background: #effdea;
    background-color: #fff;

    &-item {
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333;
      transition: all 0.3s;

      &.act {
        font-size: 32rpx;
        font-weight: bold;
        color: #000;
      }
    }
  }


  .list {
    padding: 1rpx 30rpx 40rpx;
    // background: #f4f4fe;
    // background: #222333;
    // background: url("https://img.alicdn.com/imgextra/i1/2200676927379/O1CN01B5oy6T24NdWgIw6JR_!!2200676927379.png") no-repeat;
    // background-size: 100% 100%;
    padding-bottom: 250rpx;
    min-height: 100vh;

    &-item {
      border-radius: 20rpx;
      padding: 20rpx;
      margin-top: 30rpx;
      // background: rgba(0, 0, 0, 0.6);
      // border: 1rpx solid #999;
      // background: linear-gradient(to right, #5dfda1, #baf828);
      box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;

      .list-item-wrap {
        // background: #e1fee9;
        display: flex;
        align-items: center;
        border-radius: 20rpx;
        padding: 40rpx;

        ::v-deep .u-checkbox__icon-wrap {
          border-color: #6c5bde;
        }
      }

      .card-item {
        flex: 1;
      }

      &-hd {
        display: flex;
        padding-bottom: 30rpx;

        .pic {
          width: 166rpx;
          height: 166rpx;
          border-radius: 20rpx;
          box-sizing: border-box;
          border: 1rpx solid #f7f7f7;
          position: relative;

          .tag {
            position: absolute;
            z-index: 1;
            padding: 2rpx 10rpx;
            border-radius: 20rpx 0 0 0;
            right: 0;
            bottom: 0;
            background: #0d6bc9;
            // background: #a8f93f;

            font-size: 20rpx;
            font-family: PingFang SC;
            font-weight: bold;
          }
        }

        .info {
          width: calc(100% - 166rpx);
          box-sizing: border-box;
          padding-left: 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .title {
            font-size: 32rpx;
            font-family: PingFang SC;
            font-weight: 500;
            margin-bottom: 20rpx;
          }

          .return_wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .return_price {
              font-size: 14px;
              color: orange;
              display: flex;
              align-items: center;

              .return-img {
                width: 30rpx;
                margin-right: 10rpx;
              }
            }

            .return_num {
              font-size: 14px;
            }


          }

          .return_total {
            display: flex;
            justify-content: space-between;
            align-items: center;

            ::v-deep .u-icon-disabled {
              background: linear-gradient(to right, #5dfda1, #baf828) !important;
              color: #333 !important;
            }

            ::v-deep .u-icon-minus {
              background: linear-gradient(to right, #5dfda1, #baf828) !important;
              color: #333 !important;
            }

            ::v-deep .u-icon-plus {
              background: linear-gradient(to right, #5dfda1, #baf828) !important;
              color: #333 !important;
            }

            ::v-deep .u-number-input {
              background: none !important;
              color: #000 !important;
            }
          }

        }
      }

      &-bd {
        padding-top: 30rpx;
        border-top: 1rpx solid #ededed;
        display: flex;
        justify-content: flex-end;

        .btn {
          width: 148rpx;
          height: 58rpx;
          background: #ffffff;
          border: 2rpx solid #6c5bde;
          border-radius: 50rpx;
          box-sizing: border-box;
          line-height: 58rpx;
          text-align: center;

          font-size: 24rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #333333;

          &:last-child {
            background: #6c5bde;
            background: linear-gradient(to right, #5dfda1, #baf828);
            color: #000;
          }
        }

        .btn.disabled {
          background-color: #cccccc;
          /* 灰色背景 */
          opacity: 0.7;
          /* 降低透明度 */
        }

        .btn+.btn {
          margin-left: 30rpx;
        }
      }
    }
  }
}

.zsbox {
  width: 600rpx;
  padding-top: 40rpx;
  padding: 20rpx 40rpx;

  .zs-input-wrap {
    margin: 30rpx 0;
  }

  .zs-input {
    background-color: #eee;
    border-radius: 40rpx;
    color: #333;
  }

  .zs-title {
    margin-top: 20rpx;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
  }

  .zs-tip {
    text-align: center;
    margin-bottom: 40rpx;
  }

  .zs-btn-wrap {
    display: flex;
    justify-content: space-between;

    .zs-btn {
      background: #333;
      width: 200rpx;
      padding: 20rpx 30rpx;
      color: #fff;
      text-align: center;
      border-radius: 40rpx;
    }

    .zs-btn-01 {
      background: #333;
      color: #fff;
    }

    .zs-btn-02 {
      background: #fee7b6;
      color: #333;
    }
  }
}

.btn-bootm {
  .btn {
    position: fixed;
    bottom: 100px;
    z-index: 1;
    right: 30rpx;
    width: 200rpx;
  }

  .btn-01 {
    bottom: 400px;
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
    color: #fff;
    font-size: 17px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-02 {
    bottom: 300px;
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
    color: #fff;
    font-size: 17px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-03 {
    bottom: 120px;
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
    color: #fff;
    font-size: 17px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-04 {
    bottom: 200px;
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
    color: #fff;
    font-size: 17px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .btn-05 {
    bottom: 120px;
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
    color: #fff;
    font-size: 17px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.rj-wrap {
  padding: 40rpx;
  padding-bottom: 40rpx;
  background-color: #222333;
  min-height: 100%;

  .rj-title {
    color: #fff;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    position: relative;
    margin-bottom: 40rpx;
  }

  .rj-desc {
    color: #98999e;
    font-size: 14px;
    text-align: center;
  }

  .rj-mall {
    margin-top: 40rpx;
    background-color: #05060a;
    padding: 30rpx;
    border-radius: 20rpx;


    .rj-shop {
      display: flex;
      justify-content: space-between;
      color: #fff;

      .rj-shop-title {}

      .rh-shop-num {
        text {
          color: orange;
        }
      }
    }

  }

  .ri-shop-list {
    margin-top: 20rpx;
    color: #fff;
    display: flex;

    .ri-shop-item {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      margin-right: 20rpx;
      flex-shrink: 0;

      .rj-shop-img-wrap {

        .ri-shop-img {
          width: 100rpx;
        }
      }


      .rj-shop-num {}

      .rj-shop-title {
        max-width: 200rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 10rpx 0;
      }

      .rj-shop-money {
        font-size: 12px;
        color: #999a9e;
      }
    }
  }

  .rj-bottom {
    margin-top: 100rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;

    .rj-money {
      display: flex;
      align-items: center;

      .ri-bottom-img {
        width: 30rpx;
        margin-right: 5rpx;
      }
    }

    .rj-btn {
      background: linear-gradient(270deg, #039aff, #705cff, #af38ff);
      color: #fff;
      padding: 10rpx 40rpx;
      font-size: 16px;
      border-radius: 20rpx;
    }
  }
}

.empty-list {
  min-height: 80vh;
  margin-top: 300rpx;
}

.box-content {
  padding: 20rpx;


  .box-popup-title {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15rpx;
  }

  .box-popup-desc {
    font-size: 28rpx;
    color: #666;
    text-align: center;
    margin-bottom: 25rpx;
  }

  .award-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    // gap: 15rpx;
    padding: 0 10rpx;

    .award-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8rpx;

      .award-img-container {
        position: relative;
        width: 140rpx; // 固定宽度
        height: 140rpx; // 固定高度
        border-radius: 16rpx;
        overflow: hidden;
        background-color: #f5f5f5;

        .award-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .award-tag {
          position: absolute;
          top: 8rpx;
          left: 8rpx;
          background: #fff;
          color: #ff9900;
          font-size: 20rpx;
          padding: 2rpx 8rpx;
          border-radius: 6rpx;
          box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
          z-index: 10;
        }

        .award-probability {
          position: absolute;
          bottom: 8rpx;
          right: 8rpx;
          font-size: 20rpx;
          color: #fff;
          background: rgba(0, 0, 0, 0.6);
          padding: 2rpx 8rpx;
          border-radius: 16rpx;
          z-index: 10;
        }
      }

      .award-info {
        margin-top: 10rpx;
        text-align: center;

        .award-name {
          font-size: 24rpx;
          margin-bottom: 5rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 140rpx; // 与图片宽度一致
        }

        .award-ref-price {
          font-size: 20rpx;
          color: #999;
        }
      }
    }
  }

  .empty {
    display: flex;
    justify-content: center;
  }

  .close-btn-wrap {
    display: flex;
    justify-content: center;
    margin: 30rpx 0 10rpx;

    .box-popup-close-btn {
      width: 70%;
      max-width: 360rpx;
      height: 70rpx;
      line-height: 70rpx;
      font-size: 28rpx;
      color: #666;
      background: #f5f5f5;
      border: none;
      border-radius: 35rpx;
    }
  }
}

.fixed-timer {
  position: fixed;
  top: 20%;
  right: 30rpx;
  z-index: 999;
}

/* 底部操作工具栏 */
/* 底部工具栏整体 */
.bottom-toolbar {
  position: fixed;
  bottom: 0;
  /* 基于 TabBar 高度调整 */
  left: 0;
  right: 0;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 20rpx;
  z-index: 99;
}

/* 全选反选区域 */
.toolbar-select {
  font-size: 26rpx;
  color: #333;

  .u-checkbox {
    margin-right: 0rpx;
  }

  .select-text {
    color: #000;
    margin: 0 10rpx;
    line-height: 32rpx;
  }

  .split {
    color: #999;
  }

  .toolbar-count {
    margin-top: 10rpx;
    margin-bottom: 10rpx;
    margin-left: 80rpx;
    font-size: 24rpx;
    color: #666;
  }
}

/* 操作按钮区域 */
.toolbar-btns {
  display: flex;
  align-items: center;

  .toolbar-btn {
    height: 60rpx;
    line-height: 60rpx;
    padding: 0 30rpx;
    margin: 0 10rpx;
    border-radius: 30rpx;
    font-size: 26rpx;
    text-align: center;
  }

  /* 批量开宝箱按钮样式 */
  .openall-btn {
    background-color: #000;
    color: #fff;
  }

  // /* 批量按钮禁用状态 */
  .openall-btn.disabled {
    background-color: #cccccc;
    opacity: 0.7;
  }

  .btn-boder {
    border: 2rpx solid;
  }

  .lock-btn {
    background-color: #fff;
    color: #333;
    border: 2rpx solid #999;
  }

  /* 发货按钮样式（示例） */
  .deliver-btn {
    background-color: #000;
    color: #fff;
  }
}



/* 列表底部留白 */
.list {
  padding-bottom: 120rpx !important;
  margin-top: 20rpx;
}

/* status≠0 新样式 */
.ship-header {
  background: #fff;
  border-radius: 8px;
  padding: 16rpx 10rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 12px;

  // 顶部状态 + 操作
  &-top {
    display: flex;
    align-items: center;
    // justify-content: space-between;
    justify-content: flex-end;
    margin-bottom: 12rpx;

    .status-tag {
      padding: 6rpx 12rpx;
      border-radius: 4px;
      font-size: 24rpx;
      font-weight: 500;

      // 搭配不同状态的文字颜色
      &.pending {
        background: #ffd100;
        color: #333;
      }

      &.delivered {
        background: #4cd964;
        color: #fff;
      }

      &.canceled {
        background: #f0f0f0;
        color: #999;
      }
    }

    .top-actions {
      .edit-btn {
        background: #f5f5f5;
        color: #333;
        padding: 6px 14px;
        border-radius: 4px;
        font-size: 14px;

        &:active {
          opacity: 0.8;
        }
      }
    }
  }

  // 核心信息区
  &-main {
    display: flex;
    flex-wrap: wrap;

    .ship-info-col {
      flex: 1;
      min-width: 200px;

      .info-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 8px;

        .label {
          color: #999;
          width: 150rpx;
          text-align: right;
          margin-right: 8px;
          display: inline-block;
        }

        .value {
          color: #333;
          flex: 1;
        }
      }
    }
  }

  // 发货详情行样式
  .ship-detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12rpx 0 0; // 与上方信息保持间距
    border-top: 1px dashed #eee; // 虚线分隔
    color: #333;

    .detail-left {
      display: flex;
      align-items: center;
      cursor: pointer; // 点击可展开/查看详情
      padding: 5px 0;

      .detail-title {
        font-size: 15px;
        color: #000;
        margin-right: 5px;
      }

      .detail-arrow {
        transition: transform 0.3s ease;
        // 可根据展开状态添加旋转动画
        // transform: rotate(90deg);
      }
    }

    .detail-right {
      .detail-btn {
        /* 主色调采用品牌蓝，增强识别度 */
        background-color: #1677ff;
        color: #fff;

        /* 优化尺寸和圆角 */
        padding: 7px 20px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;

        /* 细腻的阴影增加立体感 */
        box-shadow: 0 2px 6px rgba(22, 119, 255, 0.2);

        /* 过渡动画提升交互质感 */
        transition: all 0.25s ease;

        /* 点击状态反馈 */
        &:active {
          background-color: #0958d9;
          /* 深色变体 */
          box-shadow: 0 1px 3px rgba(22, 119, 255, 0.3);
          transform: translateY(1px);
          /* 微下沉效果 */
        }

        /* hover状态（非移动端可选） */
        &:hover {
          background-color: #4096ff;
          /* 亮色变体 */
        }
      }
    }
  }
}
</style>