//app.js
import until from "./utils/util.js";
App({
  setBadge() {
    let that = this;
    if (that.globalData.totalCount > 0) {
      wx.setTabBarBadge({
        index: 3,
        text: String(that.globalData.totalCount > 9 ? '9+' : that.globalData.totalCount),
        success: function(res) {},
      })
    }
  },
  onLaunch: function() {
    wx.setStorage({
      key: "key",
      data: "value"
    })
    this.setBadge();
    this.getPrice()
    // 获取屏幕高度
    wx.getSystemInfo({
      success: res => {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        this.globalData.clientHeight = height;
      }
    });
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //设置全选
  setCheck(list, type, boolean) {
    // type 1：商品选择  2：商店选择 under：全选 
    let allCheck = true;
    let isCheck = false;
    let goodsList = list || this.globalData.goodsList;
    if (type == 1) {
      goodsList.forEach(item => {
        isCheck = item.goods.every(item => item.check);
        item.check = isCheck;
      })
    } else if (type == 2) {
      goodsList.forEach(item => {
        item.goods.forEach(value => {
          value.check = item.check
        })
      })
    } else {
      goodsList.forEach(item => {
        item.check = boolean;
        item.goods.forEach(value => {
          value.check = boolean
        })
      })
    }
    allCheck = goodsList.every(item => item.check);
    return {
      list: list,
      allCheck: allCheck
    };
  },
  // 获取价钱和数量
  getPrice(list) {
    let goodsList = list || this.globalData.goodsList;
    let sum = 0;
    let count = 0;
    goodsList.forEach(item => {
      item.goods.forEach(value => {
        if (value.check) {
          sum += value.price * value.amount;
          count += value.amount
        }
      })
    })
    this.globalData.totalPrice = sum;
    this.globalData.totalCount = count;
    this.setBadge();
    return {
      sum: sum,
      count: count
    }
  },
  globalData: {
    clientHeight: 0,
    userInfo: null,
    goodsList: [{
      name: '007商铺',
      check: true,
      goods: [{
        name: '我是商品我是商品',
        src: '../../image/moneyBg.png',
        amount: 2,
        price: '30',
        check: true,
      }, {
        name: '我是商品我是商品',
        src: '../../image/moneyBg.png',
        amount: 2,
        price: '30',
        check: true,
      }]
    }, {
      name: '008商铺',
      check: true,
      goods: [{
        name: '我是商品我是商品我是商品我是商品我是商品我是商品商品我是商品',
        src: '../../image/moneyBg.png',
        amount: 2,
        price: '20',
        check: true,
      }]
    }],
    totalPrice: 0,
    totalCount: 0,
  }
})