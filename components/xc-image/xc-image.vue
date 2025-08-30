<!-- /**
 * 功能描述：
 * 1. 根据传入的宽高比自动计算容器高度，实现图片自适应比例显示。
 * 2. 支持多种宽高比格式（数字比例和字符串比例，如 "16:9"、"4:3" 等）。
 * 3. 支持圆角自定义，默认20rpx，兼容H5和小程序。
 * 4. 图片加载时带有淡入动画效果，提升用户体验。
 * 5. 支持懒加载和加载状态显示，优化性能和加载效果。
 */ -->
<template>
  <view class="xc-image-wrapper" :style="[{ paddingTop: ratioStyle }, borderRadiusStyleObj]">
    <u-image class="xc-image" :src="finalSrc" width="100%" height="100%" :style="borderRadiusStyleObj" :class="[
      'fade-in-image',
      {
        'fade-in-image-loaded': loaded,
        'image-has-bg': showBg
      }
    ]" :mode="mode" :show-loading="showLoading" :lazy-load="lazyLoad" @load="handleLoad" @error="handleError"
      @click="handleClick" />
  </view>
</template>

<script>
export default {
  name: 'xcImage',
  props: {
    src: {
      type: String,
      required: true
    },
    showBg: {
      type: Boolean,
      default: false
    },
    /**
   * 图片宽高比
   * 支持传数字或字符串，如 '16:9', '4:3', '1:1'
   * 宽高比	效果描述	推荐场景
   * 16:9	横向宽屏风格	视频封面、通用展示图
   * 4:3	  标准中等比例	商品轮播、资讯头图
   * 3:2	  比较适中（偏扁）	活动横幅、广告模块
   * 1:1	  正方形	社交头像轮播、小卡片轮播
   * 2:1	  横幅广告风格	顶部 banner、首页轮播图
    */
    ratio: {
      type: [Number, String],
      default: '4:3'
    },
    /**
  * 圆角，支持字符串整体圆角或对象单独设置四个圆角（优先级高）
  * 示例对象格式：
  * {
  *   topLeft: '10rpx',
  *   topRight: '0',
  *   bottomRight: '5rpx',
  *   bottomLeft: '20rpx'
  * }
  */
    borderRadius: {
      type: [String, Number, Object],
      default: '20rpx'
    },
    mode: {
      type: String,
      default: 'aspectFill'
    },
    showLoading: {
      type: Boolean,
      default: false
    },
    lazyLoad: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loaded: false,
      hasError: false
     
    };
  },
  computed: {
    finalSrc () {
        return this.hasError ? 'https://img.alicdn.com/imgextra/i2/2200676927379/O1CN01QVx42t24NdcX9gMKF_!!2200676927379.png' : this.src;
      },
    ratioStyle () {
      let ratioNum = 3 / 4;  // 默认4:3比例，高度是宽度的75%
      if (typeof this.ratio === 'number') {
        ratioNum = 1 / this.ratio;
      } else if (typeof this.ratio === 'string') {
        const parts = this.ratio.split(':');
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          const w = parseFloat(parts[0]);
          const h = parseFloat(parts[1]);
          ratioNum = h / w;
        } else if (!isNaN(this.ratio)) {
          ratioNum = 1 / parseFloat(this.ratio);
        }
      }
      return `${ratioNum * 100}%`;
    },
    borderRadiusStyleObj () {
      const addUnit = val => {
        if (typeof val === 'number') return val + 'rpx';
        // 如果已经带单位，直接返回，否则补单位
        if (typeof val === 'string') return /[a-zA-Z%]+$/.test(val) ? val : val + 'rpx';
        return '0';
      };

      if (typeof this.borderRadius === 'string' || typeof this.borderRadius === 'number') {
        return {
          'border-radius': addUnit(this.borderRadius)
        };
      } else if (typeof this.borderRadius === 'object' && this.borderRadius !== null) {
        const br = this.borderRadius;
        return {
          'border-top-left-radius': addUnit(br.topLeft || 0),
          'border-top-right-radius': addUnit(br.topRight || 0),
          'border-bottom-right-radius': addUnit(br.bottomRight || 0),
          'border-bottom-left-radius': addUnit(br.bottomLeft || 0)
        };
      }
      return {
        'border-radius': '20rpx'
      };
    }
  },
  methods: {
    handleLoad (e) {
      this.loaded = true;
      this.$emit('load', e);
    },
    handleError (e) {
      this.hasError = true;
      this.$emit('error', e);
    },
    handleClick (e) {
      this.$emit('click', e);
    }
  }
};
</script>

<style scoped lang="scss">
.xc-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;

  .xc-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.05);
    transition: opacity 0.5s ease, transform 0.3s ease;
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.05);

    &.image-has-bg {
      background-color: #f5f5f5;
    }

    &.fade-in-image {
      opacity: 0;
      transition: opacity 0.5s ease, transform 0.3s ease;
    }

    &.fade-in-image-loaded {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
