/*
 * @Date: 2022-05-14 18:25:15
 * @LastEditTime: 2025-07-15 21:20:42
 * @Description: content
 */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    appConfig: '',
    msgConfig: '', // 订阅消息配置
    userInfo: '',
    sysConfig: uni.getSystemInfoSync(), // 设备系统信息
    musicContext: null,
    ingMusic: null, // 抽奖中音效
    allMusic: null, // 全部开奖音效
    hasMusic: null, // 有重抽卡的开奖音效
    noMusic: null, // 没有重抽卡的开奖音效
    queueCountdown: 0, // 倒计时
    queueTimer: null
  },
  getters: {
    appConfig: state => state.appConfig,
    msgConfig: state => state.appConfig,
    userInfo: state => state.userInfo,
    sysConfig: state => state.sysConfig,
    musicContext: state => state.musicContext,
    ingMusic: state => state.ingMusic,
    allMusic: state => state.allMusic,
    hasMusic: state => state.hasMusic,
    noMusic: state => state.noMusic,
    queueCountdown: state => state.queueCountdown
  },
  mutations: {
    /* 设置用户信息 */
    setUserInfo (state, data) {
      state.userInfo = data
      uni.setStorageSync('userInfo', data)
    },

    /* 设置应用全局配置 */
    setAppConfig (state, data) {
      state.appConfig = data
      uni.setStorageSync('appConfig', data)
      // console.log(state.appConfig)
    },

    /* 设置订阅消息配置 */
    setMsgConfig (state, data) {
      state.msgConfig = data
      uni.setStorageSync('msgConfig', data)
      // console.log(state.appConfig)
    },

    /* 设置音乐组件 */
    setMusicContext (state, data) {
      state.musicContext = data
    },

    /* 设置抽奖音效 */
    setDrawMusic (state) {
      state.ingMusic = uni.createInnerAudioContext()
      // state.ingMusic.src = Vue.prototype.imgBaseUrl + '/static/mp3/draw.mp3'
      state.ingMusic.src = 'https://www.img.xcooo.cn/uploads/2024/02/efa9b5a3ac2ae0cb.mp3'
    },
    setQueueCountdown (state, seconds) {
      state.queueCountdown = seconds
    },
    decreaseQueueCountdown (state) {
      state.queueCountdown--
    },
    clearQueueTimer (state) {
      if (state.queueTimer) {
        clearInterval(state.queueTimer)
        state.queueTimer = null
      }
    }
  },
  actions: {
    /**
     * @description: 获取用户信息
     * @param {*} commit
     * @return {*}
     */
    getUserInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.req({
          url: '/v1/user/info',
          Loading: true,
          success: function (res) {
            if (res.code == 200) {
              commit('setUserInfo', res.data)
              resolve(res)
            }
          }
        })
      })
    },

    /**
     * @description: 获取项目配置项
     * @param {*} commit
     * @return {*}
     */
    getAppConfig ({ commit }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.req({
          url: '/v1/config/global',
          Loading: true,
          success: function (res) {
            if (res.code == 200) {
              // uni.setStorageSync(
              // 	'token',
              // 	`${res.data.user.token_type}${res.data.user.access_token}`
              // )
              commit('setAppConfig', res.data)
              resolve(res)
            }
          }
        })
      })
    },

    /**
     * @description: 获取订阅消息配置项
     * @param {*} commit
     * @return {*}
     */
    getMsgConfig ({ commit }, data) {
      return new Promise((resolve, reject) => {
        Vue.prototype.req({
          url: '/v1/config/wxmessage',
          Loading: true,
          data: {
            type: data
          },
          success: function (res) {
            if (res.code == 200) {
              commit('setMsgConfig', res.data)
              resolve(res)
            }
          }
        })
      })
    },
    startQueueCountdown ({ commit, state }, seconds) {
      commit('clearQueueTimer')
      commit('setQueueCountdown', seconds)

      state.queueTimer = setInterval(() => {
        if (state.queueCountdown > 0) {
          commit('decreaseQueueCountdown')
        } else {
          commit('clearQueueTimer')
        }
      }, 1000)
    },
    stopQueueCountdown ({ commit }) {
      commit('clearQueueTimer')
      commit('setQueueCountdown', 0) // 再将倒计时设为0
    }
  }
})
export default store
