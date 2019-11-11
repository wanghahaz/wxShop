//index.js
//获取应用实例
const app = getApp();
import http from "../../../common/js/http.js";
import until from "../../../utils/util.js";
let timers = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    isTop: false, //下拉刷新
    scrollTop: 0,
    bannerList: [],
    length: 0,
    dots_index: 0,
    navList: [],
    page: 1,
    is_on: 2,
    clientHeight: app.globalData.clientHeight / 2,
    shopList: [],
    isPullDownRefresh: true,
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
    })
    if (e.detail.item.token) {
      this.setData({
        isLogin: true
      })
    }
  },
  changedots(e) {
    this.setData({
      dots_index: e.detail.current
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
  switchTab(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.path,
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
    this.getGoods()
    if (!wx.getStorageSync('share_id')) {
      wx.setStorage({
        key: "share_id",
        data: options.share_id ? options.share_id : 0
      })
    }
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
      if (res.code == 200) {
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
      } else {
        until.toast({
          title: '加载失败'
        })
      }
      if (this.data.isTop) {
        wx.stopPullDownRefresh();
        this.setData({
          isTop: false
        })
      }

    })
  },
  // 首页导航
  getNav() {
    this.setData({
      navList: [{
        name: '新品上线',
        link_url: '/pages/home/pages/newGoods/newGoods',
        icon: 'http://www.lyjp.shop/uploads/2019-10-31/OtpQyzUixulG4jmftX3lrjjrCaFAhlIO0SafTK4r.png'
      }, {
        name: '必买清单',
        link_url: '/pages/myMsg/pages/willBuy/willBuy',
        icon: 'http://www.lyjp.shop/uploads/2019-10-31/4bUHucQDIyOCB2TWcAoumxZClIYxIhlF6A4YUpSi.png'
      }, {
        name: '低价折扣',
        link_url: '',
        icon: 'http://www.lyjp.shop/uploads/2019-10-31/9FZpSmABuWTqBHjS9KhCiUUlmGJJysoEt9IBGRaS.png'
      }, {
        name: '排行榜',
          link_url: '/pages/myMsg/pages/ranking/ranking',
        icon: 'http://www.lyjp.shop/uploads/2019-10-31/M4Z2wbASoPltn9fmqpj3TuKmfEctxBRqJC3GERIL.png'
      }]
    })
    // http.getReq('/index/nav', {}, true).then(res => {
    //   this.setData({
    //     navList: res.data
    //   })
    // })
  },
  // 首页轮播图
  getBanner() {
    http.getReq('/index/slide', {}, true).then(res => {
      this.setData({
        bannerList: res.data,
        lenght: res.data.lenght
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
    if (!wx.getStorageSync('token')) {
      this.setData({
        dialogShow: true
      })
    }
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    this.getseckill()
    this.getBanner();
    this.getNav()
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
    this.setData({
      page: 1,
      isTop: true,
      isPullDownRefresh: true,
      shopList: [],
    })
    this.getGoods()
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
    let share_id = null;
    if (wx.getStorageSync('token')) {
      share_id = wx.getStorageSync('userInfo').id;
    } else {
      share_id = 0;
    }
    return {
      title: '您好，欢迎使用零元晋品',
      path: '/pages/tabar/index/index?share_id=' + share_id,
    }
  }
})