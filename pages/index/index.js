//index.js
//获取应用实例
const app = getApp();
import http from "../../common/js/http.js";
import until from "../../utils/util.js";
let timers = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isGetInfo: false,
    scrollTop: 0,
    bannerList: [],
    navList: [],
    page: 1,
    is_on: 0,
    clientHeight: app.globalData.clientHeight / 2,
    shopList: [],
    isPullDownRefresh: true,
  },
  // 组件返回值
  myevent(e) {
    this.setData({
      isGetInfo: false
    })
  },
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  suckTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 跳转页面
  toRouter(e) {
    let data = until.cutShift(e.currentTarget.dataset);
    if (data) {
      wx.navigateTo({
        url: `${e.currentTarget.dataset.path}?${data}`,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.path,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBanner();
    this.getNav()
    this.getGoods()
    this.getseckill()
  },
  countDown() {
    timers = setInterval(() => {
      let time = until.diffTime(new Date().getTime(), this.data.endTime);
      if (time.hours == "00" && time.minutes == "00" && time.seconds == "00") {
        this.setData({
          is_on: 0
        })
        clearInterval(times)
      } else {
        this.setData({
          h: time.hours,
          m: time.minutes,
          s: time.seconds
        })
      }
    }, 1000)
  },
  // 秒杀活动
  getseckill() {
    http.getReq('/index/seckill ', {}).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          is_on: res.data.is_on,
          seckillList: res.data.row,
          endTime: res.data.endtime + new Date().getTime()
        })
        if (res.data.is_on == 1) {}
        let time = until.diffTime(new Date().getTime(), this.data.endTime);
        this.setData({
          h: time.hours,
          m: time.minutes,
          s: time.seconds
        })
        this.countDown()
      }
    })
  },
  // 首页商品推荐
  getGoods() {
    http.getReq('/index/goods', {
      page: this.data.page
    }, true).then(res => {
      this.setData({
        shopList: [...this.data.shopList, ...res.data.data]
      })
      if (res.data.last_page == this.data.page) {
        this.setData({
          isPullDownRefresh: false
        })
      } else {
        this.setData({
          page: this.data.page + 1
        })
      }
    })
  },
  // 首页导航
  getNav() {
    http.getReq('/index/nav', {}, true).then(res => {
      this.setData({
        navList: res.data
      })
    })
  },
  // 首页轮播图
  getBanner() {
    http.getReq('/index/slide', {}, true).then(res => {
      this.setData({
        bannerList: res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // wx.hideTabBar()
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.isPullDownRefresh) {
      this.getGoods()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
// Page({
//   data: {
//     motto: 'Hello World',
//     userInfo: {},
//     hasUserInfo: false,
//     canIUse: wx.canIUse('button.open-type.getUserInfo')
//   },
//   //事件处理函数
//   bindViewTap: function() {
//     wx.navigateTo({
//       url: '../logs/logs'
//     })
//   },
//   onLoad: function () {
//     if (app.globalData.userInfo) {
//       this.setData({
//         userInfo: app.globalData.userInfo,
//         hasUserInfo: true
//       })
//     } else if (this.data.canIUse){
//       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//       // 所以此处加入 callback 以防止这种情况
//       app.userInfoReadyCallback = res => {
//         this.setData({
//           userInfo: res.userInfo,
//           hasUserInfo: true
//         })
//       }
//     } else {
//       // 在没有 open-type=getUserInfo 版本的兼容处理
//       wx.getUserInfo({
//         success: res => {
//           app.globalData.userInfo = res.userInfo
//           this.setData({
//             userInfo: res.userInfo,
//             hasUserInfo: true
//           })
//         }
//       })
//     }
//   },
//   getUserInfo: function(e) {
//     console.log(e)
//     app.globalData.userInfo = e.detail.userInfo
//     this.setData({
//       userInfo: e.detail.userInfo,
//       hasUserInfo: true
//     })
//   }
// })