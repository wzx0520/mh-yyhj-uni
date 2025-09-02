<template>
    <!-- <view class="tabbar">
		<view class="tabs" v-for="(item,index) in tabList" :key="index" @tap="switchTab(index)">
			<uni-icons :type="item.iconType" size="30" color="#9E9E9E"></uni-icons>
			<view class="text">{{item.text}}</view>
		</view>
	</view> -->
    <uni-transition mode-class="fade" :duration="200" :show="true">
        <view>
            <view class="tab-content">
                <slot />
            </view>
            <view class="tabbar">
                <view class="navigator">
                    <view ref='warpper' class="warpper">
                        <view ref="navItem" class="navigator-item" v-for="(item, index) in tabList" :key="item.pagePath"
                            @click="switchTab(item, index)" :data-index='index'>
                            <uni-icons :type="item.iconType" size="30"
                                :color="selectedIndex === index ? '#00F7FF' : '#8F8D8E'"></uni-icons>
                            <!-- <image class="icon" :src="$jointImage(item.iconPath)" v-if="selectedIndex !== index">
							</image>
							<image class="icon" :src="$jointImage(item.selectedIconType)" v-else></image> -->
                            <text :class="['item-text', { 'text-active': selectedIndex === index }]">{{ item.text }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </uni-transition>
</template>

<script>
export default {
    data() {
        return {
            selectedIndex: uni.getStorageSync('selectedIndex') || 0,
            configuration: {},
            tabList: [],
        };
    },
    mounted() {
        console.log (this.isChecked);

        this.alliconSet()
        console.log(this.tabList);

    },
    methods: {
        alliconSet() {
            this.tabList = [{
                pagePath: "/pages/tabBar/home",
                text: "首页",
                state: false,
                iconType: "home",
                selectedIconType: "home-filled"
            },

            {
                pagePath: "/pages/index/index",
                text: "商城",
                state: false,
                iconType: "shop",
                selectedIconType: "shop-filled"
            },
            {
                pagePath: "/pages/tabBar/bag",
                text: "盒柜",
                state: false,
                iconType: "wallet",
                selectedIconType: "wallet-filled"
            },
            {
                pagePath: "/pages/tabBar/my",
                text: "我的",
                state: false,
                iconType: "person",
                selectedIconType: "person-filled"
            },
            ]
        },
        switchTab(items, indexs) {
            uni.navigateTo({
                url: `${this.tabList[indexs].pagePath}`
            });
            this.tabList.forEach((v, i) => {
                if (items.pagePath === v.pagePath) {
                    uni.setStorageSync('selectedIndex', indexs);
                }
            })

        },
    },
};
</script>

<style lang="scss" scoped>
.tabbar {
    position: fixed;
    bottom: 40rpx;
    margin: 0 auto;
    left: 0;
    right: 0;
    width: 90%;
    height: 140rpx;
    padding: 20rpx 40rpx;
    z-index: 999;
    background: #000;
    border-radius: 30rpx;
}

// .navigator {
// 	width: 85%;
// 	margin: 0 auto;
// 	padding: 20rpx;
// 	overflow: hidden;
// }

.warpper {
    display: flex;
    justify-content: space-between;
    width: auto;
    transition-timing-function: ease-out;
}

.navigator-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 50rpx;
    height: 100%;
}

.item-text {
    margin-top: 6rpx;
    color: #777E86;
    font-size: 24rpx;
}

.text-active {
    color: #00F7FF !important;
}

.icon {
    width: 24px;
    height: 24px;
}
</style>