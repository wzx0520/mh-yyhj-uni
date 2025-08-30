<template>
  <view v-if="queueCountdown > 0" @click="$emit('click')" class="countdown-circle-wrapper"
    :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <!-- 外围旋转三角形 -->
    <view class="triangle-container">
      <view class="triangle triangle-1"></view>
      <view class="triangle triangle-2"></view>
      <view class="triangle triangle-3"></view>
      <view class="triangle triangle-4"></view>
    </view>

    <!-- 倒计时圆环 -->
    <view class="countdown-circle" :style="{ width: size * 0.8 + 'rpx', height: size * 0.8 + 'rpx' }">
      <!-- 背景圆环 -->
      <view class="circle-bg"></view>

      <!-- 左半圆 -->
      <view class="circle-left" :style="{ transform: 'rotate(' + leftDeg + 'deg)' }"></view>

      <!-- 右半圆 -->
      <view class="circle-right" :style="{ transform: 'rotate(' + rightDeg + 'deg)' }"></view>

      <!-- 中心数字 -->
      <view class="countdown-text">
        {{ queueCountdown }}
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CountdownCircle',
  props: {
    // 移除 duration 属性，完全依赖 Vuex 中的 queueCountdown
    size: {
      type: Number,
      default: 100
    },
    color: {
      type: String,
      default: '#4caf50'
    },
    triangleColor: {
      type: String,
      default: '#4caf50'
    },
    triangleRotateSpeed: {
      type: Number,
      default: 20
    }
  },
  computed: {
    ...mapGetters(['queueCountdown']),

    // 计算圆环角度
    leftDeg () {
      // 假设最大倒计时为 60 秒，可以通过 prop 传入或从 Vuex 获取
      const maxSeconds = 60;
      const progressDeg = ((maxSeconds - this.queueCountdown) / maxSeconds) * 360;
      return progressDeg > 180 ? progressDeg - 180 : 0;
    },

    rightDeg () {
      const maxSeconds = 60;
      const progressDeg = ((maxSeconds - this.queueCountdown) / maxSeconds) * 360;
      return progressDeg <= 180 ? progressDeg : 180;
    }
  },
  watch: {
    // 监听倒计时变化
    queueCountdown (newVal) {
      if (newVal <= 0) {
        this.$emit('finish');
      }
    }
  },
  mounted () {
    // 组件挂载时不启动倒计时，由父组件控制
  },
  beforeDestroy () {
    // 组件销毁时不清除计时器，由 Vuex 统一管理
  },
  methods: {
    ...mapActions(['startQueueCountdown', 'stopQueueCountdown'])
  }
};
</script>

<style lang="scss" scoped>
// 保持原有样式不变
.countdown-circle-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  /* 外围三角形容器 */
  .triangle-container {
    position: absolute;
    width: 100%;
    height: 100%;
    animation: rotate-triangles var(--triangle-speed, 10s) linear infinite;
    // background-color: var(--circle-color, #4caf50);
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 50%;

    .triangle {
      position: absolute;
      width: 0;
      height: 0;

      &-1 {
        // 顶部三角，朝上
        left: 50%;
        top: 0;
        transform: translate(-50%, -50%);
        border-left: 12rpx solid transparent;
        border-right: 12rpx solid transparent;
        border-top: 24rpx solid var(--triangle-color, #0b800f);
      }

      &-2 {
        // 右侧三角，朝右
        top: 50%;
        right: 0;
        transform: translate(50%, -50%);
        border-top: 12rpx solid transparent;
        border-bottom: 12rpx solid transparent;
        border-right: 24rpx solid var(--triangle-color, #0b800f);
      }

      &-3 {
        // 底部三角，朝下
        left: 50%;
        bottom: 0;
        transform: translate(-50%, 50%);
        border-left: 12rpx solid transparent;
        border-right: 12rpx solid transparent;
        border-bottom: 24rpx solid var(--triangle-color, #0b800f);
      }

      &-4 {
        // 左侧三角，朝左
        top: 50%;
        left: 0;
        transform: translate(-50%, -50%);
        border-top: 12rpx solid transparent;
        border-bottom: 12rpx solid transparent;
        border-left: 24rpx solid var(--triangle-color, #0b800f);
      }
    }
  }

  /* 倒计时圆环 */
  .countdown-circle {
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    .circle-bg,
    .circle-left,
    .circle-right {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .circle-bg {
      // background-color: var(--circle-color, #4caf50);
      z-index: 1;
    }

    .circle-left,
    .circle-right {
      background-color: transparent;
      z-index: 2;
      transform-origin: center;

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .countdown-text {
      position: relative;
      z-index: 3;
      font-size: 32rpx;
      font-weight: bold;
      color: white;
      color: #000;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
  }
}

/* 三角形旋转动画 */
@keyframes rotate-triangles {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>  