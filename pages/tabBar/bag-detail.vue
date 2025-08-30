<template>
  <view class="ship-detail-page">
    <uni-nav-bar title="发货详情" color="#333" leftIcon="left" backgroundColor="#fff" :border="false" :statusBar="true"
      :fixed="true" @clickLeft="$common.back()"></uni-nav-bar>
    <view class="ship-detail-content">
      <!-- 发货信息卡片 -->
      <view class="card ship-info-card">
        <view class="card-header">
          <text class="card-title">发货信息</text>
        </view>
        <view class="card-content">
          <view class="info-item">
            <text class="label">发货数量：</text>
            <text class="value">× {{ shipData.total_count }}</text>
          </view>
          <view class="info-item">
            <text class="label">发货邮费：</text>
            <text class="value">¥ {{ shipData.express_money }}</text>
          </view>
          <view class="info-item">
            <text class="label">发货价值：</text>
            <text class="value">¥ {{ shipData.total_return_value }}</text>
          </view>
          <view class="info-item">
            <text class="label">发货状态：</text>
            <text class="value status-unviewed">待发货</text>
          </view>
        </view>
      </view>

      <!-- 收货信息卡片 -->
      <view class="card recipient-info-card">
        <view class="card-header">
          <text class="card-title">收货信息</text>
        </view>
        <view class="card-content">
          <view class="info-item">
            <text class="label">收货地址：</text>
            <text class="value">{{ shipData.address }}</text>
          </view>
          <view class="info-item">
            <text class="label">收货人：</text>
            <text class="value">{{ shipData.name }}</text>
          </view>
          <view class="info-item">
            <text class="label">联系方式：</text>
            <text class="value">{{ shipData.mobile }}</text>
          </view>
        </view>
      </view>

      <!-- 包裹物品卡片 -->
      <view class="card package-items-card">
        <view class="card-header">
          <text class="card-title">包裹物品</text>
        </view>
        <view class="card-content">
          <view class="item-list">
            <view class="item" v-for="(item, index) in shipData.items" :key="index">
              <image :src="item.thumb" class="item-image"></image>
              <view class="item-info">
                <view class="item-name">{{ item.title }}</view>
                <view class="item-desc">赏品类别：{{ item.mark_title }}</view>
                <view class="item-desc">产品单价：¥ {{ item.return_price }}</view>
                <view class="item-desc">奖品数量：× {{ item.total }}</view>
                <view class="item-desc">奖品总价：¥ {{ item.total_return_price }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  data () {
    return {
      shipData: {},
      ship_id: null
    };
  },
  onLoad (options) {
    this.ship_id = options.ship_id
    // 调用获取发货详情的方法
    this.getShipInfo();
  },
  methods: {
    // 获取发货详情的方法
    getShipInfo () {
      this.req({
        url: '/v1/user/shipInfo',
        data: {
          ship_id: this.ship_id
        },
        success: res => {
          if (res.code == 200) {
            this.shipData = res.data;
          } else {
            uni.showToast({
              title: '获取发货详情失败',
              icon: 'none'
            });
          }
        },
        fail: err => {
          uni.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          console.error('请求发货详情接口失败：', err);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
page {
  background-color: #f5f5f5;
}

.ship-detail-page {
  background-color: #f5f5f5;

  .ship-detail-content {
    padding: 20rpx 12rpx;
  }

  // 卡片通用样式
  .card {
    background-color: #fff;
    border-radius: 10rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
    margin-bottom: 20rpx;

    // 卡片头部
    .card-header {
      padding: 15rpx;
      border-bottom: 1px solid #f5f5f5;

      .card-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
    }

    // 卡片内容
    .card-content {
      padding: 15rpx;

      // 信息项通用样式
      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;

        .label {
          font-weight: bold;
          color: #666;
          width: 150rpx;
        }

        .value {
          flex: 1;
          color: #333;
          text-align: right;
        }

        .status-unviewed {
          color: orange;
        }
      }

      // 包裹物品列表
      .item-list {
        display: flex;
        flex-direction: column;

        .item {
          display: flex;
          align-items: center;
          padding: 10rpx 0;
          border-bottom: 1px solid #f5f5f5;

          .item-image {
            width: 120rpx;
            height: 120rpx;
            border-radius: 10rpx;
            margin-right: 20rpx;
          }

          .item-info {
            flex: 1;

            .item-name {
              font-size: 30rpx;
              font-weight: bold;
              margin-bottom: 5rpx;
              color: #333;
            }

            .item-desc {
              font-size: 26rpx;
              color: #999;
              margin-bottom: 3rpx;
            }

            .item-count {
              font-size: 28rpx;
              color: #666;
              margin-top: 5rpx;
            }
          }
        }
      }
    }
  }
}
</style>