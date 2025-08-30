<template>
  <view class="reward-page">
    <!-- <view class="nav-bar">
      <view class="nav-left" @click="goBack">
        <u-icon name="arrow-left" color="#333" size="40"></u-icon>
      </view>
      <view class="nav-title">消费奖励</view>
    </view> -->
    <uni-nav-bar title="消费奖励" color="#333" leftIcon="left" backgroundColor="#fff" :border="false" :statusBar="true"
      :fixed="true" @clickLeft="back()"></uni-nav-bar>

    <!-- 消费活动列表 -->
    <template v-if="activityList.length">
      <view class="activity-box" v-for="(item, index) in activityList" :key="index">
        <view class="activity-title">{{ item.title }}</view>
        <view class="activity-time">
          活动时间：
          <text>{{ item.start_time }}</text>
          <text class="gap">-</text>
          <text>{{ item.end_time }}</text>
        </view>

        <template v-if="item.rules.length">
          <view class="reward-item" v-for="(reward, idx) in item.rules" :key="idx">
            <view class="reward-info">
              满 {{ reward.total_amount }} 元可领取 {{ reward.reward_money }}
            </view>

            <button class="reward-btn" :class="{
              received: reward.received,
              disabled: !reward.received && !reward.can_receive
            }" :disabled="reward.received || !reward.can_receive" @click="openPopup(reward)">
              <template v-if="reward.received">已领取</template>
              <template v-else-if="reward.can_receive">领取</template>
              <template v-else>未达成</template>
            </button>
          </view>
        </template>
        <template v-else>
          <view class="empty">
            <u-empty text="暂无消费奖励规则" mode="list"></u-empty>
          </view>
        </template>
      </view>
    </template>

    <template v-else>
      <view class="empty">
        <u-empty text="暂无消费奖励活动" mode="list"></u-empty>
      </view>

    </template>


    <!-- 奖励弹窗 -->
    <u-popup v-model="popupShow" mode="center" border-radius="20">
      <view class="popup-content">
        <view class="popup-title">领取奖励</view>
        <view class="popup-desc">
          确定领取「{{ selectedReward.reward_money }}」？
        </view>

        <view class="btn-group">
          <button class="close-btn" @click="popupShow = false">取消</button>
          <button class="confirm-btn" @click="receiveReward">确定</button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data () {
    return {
      activityList: [],
      popupShow: false,
      selectedReward: {},
    }
  },
  onShow () {
    this.getRewardList();
  },
  methods: {
    getRewardList () {
      this.req({
        url: '/v1/consume/rewardList',
        data: {},
        success: res => {
          if (res.code == 200) {
            this.activityList = res.data || [];
          }
        }
      });
    },
    openPopup (reward) {
      this.selectedReward = reward;
      this.popupShow = true;
    },
    receiveReward () {
      this.req({
        url: '/v1/consume/receiveReward',
        data: {
          rule_id: this.selectedReward.id
        },
        success: res => {
          if (res.code === 200) {
            this.$set(this.selectedReward, 'received', true);
            this.popupShow = false;
            uni.showToast({ title: '领取成功', icon: 'success' });
          } else {
            uni.showToast({ title: res.msg || '领取失败', icon: 'none' });
          }
        }
      });
    },
    goBack () {
      uni.switchTab({
        url: '/pages/tabBar/home',
      });
    },
    back () {
      this.$common.to({
        type: 3,
        url: '/pages/tabBar/home'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.reward-page {
  padding: 30rpx;

  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    z-index: 10;
    padding-top: var(--status-bar-height); // iOS 刘海屏兼容（如使用 uView）
    // box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);

    .nav-left {
      position: absolute;
      left: 30rpx;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
    }

    .nav-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
  }


  .empty {
    margin-top: 20%;
  }

  .activity-box {
    margin-bottom: 40rpx;
    background: #f8f8f8;
    padding: 20rpx;
    border-radius: 16rpx;

    .activity-title {
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .activity-time {
      font-size: 24rpx;
      color: #888;
      margin-bottom: 12rpx;

      .gap {
        margin: 0 20rpx;
      }
    }

    .reward-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      padding: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 12rpx;
      box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);

      .reward-info {
        font-size: 26rpx;
        color: #333;
      }

      .reward-btn {
        padding: 10rpx 30rpx;
        border-radius: 8rpx;
        background-color: #ff9900;
        color: #fff;
        font-size: 26rpx;

        &.disabled {
          background-color: #ccc;
          color: #666;
        }

        &.received {
          background-color: #aaa;
          color: #fff;
        }
      }
    }
  }

  .popup-content {
    width: 600rpx;
    padding: 40rpx 50rpx;
    background: #fff;
    border-radius: 24rpx;
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.12);
    text-align: center;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;

    .popup-title {
      font-size: 36rpx;
      font-weight: 700;
      color: #222;
      margin-bottom: 28rpx;
    }

    .popup-desc {
      font-size: 30rpx;
      color: #666;
      line-height: 1.5;
      margin-bottom: 50rpx;
      margin-top: 50rpx
    }

    .btn-group {
      display: flex;
      justify-content: center;
      gap: 40rpx;

      .confirm-btn,
      .close-btn {
        flex: 1;
        padding: 2rpx 0;
        font-size: 30rpx;
        font-weight: 600;
        border-radius: 14rpx;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;
        box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
        user-select: none;
      }

      .confirm-btn {
        background-color: #4caf50;
        color: #fff;
        border: none;

        &:hover {
          background-color: #43a047;
        }

        &:active {
          background-color: #388e3c;
        }
      }

      .close-btn {
        background-color: #f0f0f0;
        color: #555;
        border: none;

        &:hover {
          background-color: #d9d9d9;
        }

        &:active {
          background-color: #bfbfbf;
        }
      }
    }
  }

}
</style>
