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
    orderList: [{
      name: '待付款',
      path: "/pages/myOrder/myOrder",
      clas: 'payment',
      status: '0',
      src: '../../image/fukuan.png'
    }, {
      name: '待发货',
      status: '1',
      path: "/pages/myOrder/myOrder",
      clas: "delivery",
      src: '../../image/fahuo.png'
    }, {
      name: '待收货',
      status: '2',
      path: "/pages/myOrder/myOrder",
      clas: "harvest",
      src: '../../image/fukuan.png'
    }, {
      name: '待评价',
      status: '8',
      path: "/pages/myOrder/myOrder",
      type: 1,
      clas: "comment",
      src: './iconfont/iconpingjia:before icon'
    }, {
      name: '退款/售后',
      status: '4',
      path: "/pages/myOrder/myOrder",
      clas: "sales",
      src: '../../image/shouhou.png'
    }],
    btList: [{
        name: '我的代金券',
        path: '/pages/myChit/myChit',
        clas: "money",
        style: 'margin:0 20rpx 0 0rpx',
        src: '../../image/money.png'
      },
      {
        name: '我的收藏',
        path: "/pages/myCollect/myCollect",
        clas: "collection",
        style: 'margin:0 22rpx 0 0rpx',
        src: '../../image/sc.png'
      }, {
        name: '邀请有礼',
        path: '/pages/invitation/invitation',
        clas: "adress",
        style: 'margin:0 16rpx 0 0rpx',
        src: '../../image/invita.png'
      },
      {
        name: '客服',
        path: '',
        clas: "people",
        style: 'margin:0 20rpx 0 0rpx',
        src: '../../image/peopel.png'
      }
    ],
    shopList: [],
    isPullDownRefresh: true,
    page: 1,
    token: true,
    userInfo: {}
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
          console.log(res)
          console.log(wx.getStorageSync('share_id'))
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
    if (e.currentTarget.dataset.path != "/pages/goodsDealis/goodsDealis") {
      if (!wx.getStorageSync('token')) {
        until.toast({title:'请您先进行登录，然后继续操作'})
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