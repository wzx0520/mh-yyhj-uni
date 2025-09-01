
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