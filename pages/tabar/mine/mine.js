//index.js
//获取应用实例
const app = getApp();
import until from "../../../utils/util.js";
import http from "../../../common/js/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
      text: '确定'
    }],
    dialogShow: false,
    orderList: [{
      name: '待付款',
      path: "/pages/home/pages/myOrder/myOrder",
      status: '0',
      src: '../../../image/fukuan.png',
      style: 'width:58rpx;height:48rpx;margin-top:4rpx'
    }, {
      name: '待发货',
      status: '1',
      path: "/pages/home/pages/myOrder/myOrder",
      src: '../../../image/fahuo.png',
      style: 'width:52rpx;height:48rpx;margin-top:4rpx'
    }, {
      name: '待收货',
      status: '2',
      path: "/pages/home/pages/myOrder/myOrder",
      src: '../../../image/shouhuo.png',
      style: 'width:54rpx;height:52rpx'
    }, {
      name: '待评价',
      status: '8',
      path: "/pages/home/pages/myOrder/myOrder",
      src: '../../../image/pingjia.png',
      style: 'width:54rpx;height:52rpx'
    }, {
      name: '退款/售后',
      status: '4',
      path: "/pages/myMsg/pages/saleList/saleList",
      src: '../../../image/shouhou.png',
      style: 'width:58rpx;height:52rpx'
    }],
    btList: [{
        // path: '/pages/home/pages/sureGoods/sureGoods',
        name: '我的代金券',
        path: '/pages/myMsg/pages/myChit/myChit',
        clas: "money",
        style: 'margin:0 20rpx 0 0rpx',
        src: '../../../image/money.png'
      },
      {
        name: '我的收藏',
        path: "/pages/myMsg/pages/myCollect/myCollect",
        clas: "collection",
        style: 'margin:0 22rpx 0 0rpx',
        src: '../../../image/sc.png'
      }, {
        name: '邀请有礼',
        path: '/pages/myMsg/pages/invitation/invitation',
        clas: "adress",
        style: 'margin:0 16rpx 0 0rpx',
        src: '../../../image/invita.png'
      },
      {
        name: '我的客服',
        path: '',
        clas: "people",
        style: 'margin:0 20rpx 0 0rpx',
        src: '../../../image/peopel.png'
      },
      {
        name: '我的自提',
        path: '/pages/myMsg/pages/pickList/pickList?index=1',
        clas: "people",
        style: 'margin:0 20rpx 0 0rpx',
        src: '../../../image/peopel.png'
      },
      {
        name: '收货地址',
        path: '/pages/myMsg/pages/adressList/adressList',
        clas: "people",
        style: 'margin:0 20rpx 0 0rpx',
        src: '../../../image/peopel.png'
      },
      {
        name: '帮助中心',
        path: '',
        clas: "people",
        style: 'margin:0 20rpx 0 0rpx',
        src: '../../../image/peopel.png'
      }
    ],
    shopList: [],
    isPullDownRefresh: true,
    page: 1,
    token: true,
    userInfo: {}
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
    })
    if (e.detail.item.token) {
      this.setData({
        token: false,
        userInfo: e.detail.item.userInfo
      })
    }
  },
  getInfo() {
    let that = this;
    wx.getUserInfo({
      success: function(res) {
        http.postReq('/login', {
          nickname: res.userInfo.nickName,
          share_user: wx.getStorageSync('share_id') ? wx.getStorageSync('share_id') : 0,
          openid: app.globalData.openid,
          avatar: res.userInfo.avatarUrl
        }).then(re => {
          app.globalData.userInfo = re.data.user;
          app.globalData.token = re.data.token;
          wx.setStorage({
            key: "token",
            data: re.data.token
          })
          wx.setStorage({
            key: "userInfo",
            data: re.data.user
          })
          that.setData({
            token: re.data.token ? false : true,
            userInfo: app.globalData.userInfo
          })

        })
      },
      fail: function(res) {
        // console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getGoods() {
    http.getReq('/rec/goods', {
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
  onLoad: function(options) {
    this.getGoods()
  },
  toRouter(e) {
    if (e.currentTarget.dataset.path != "/pages/home/pages/goodsDealis/goodsDealis") {
      if (!wx.getStorageSync('token')) {
        this.setData({
          dialogShow: true
        })
        return false;
      }
    }
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
    this.setData({
      token: wx.getStorageSync('token') ? false : true,
      userInfo: app.globalData.userInfo
    })
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
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
})