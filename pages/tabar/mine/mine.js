//index.js
//获取应用实例
const app = getApp();
import until from "../../../utils/util.js";
import http from "../../../common/js/http.js";
let btList = [{
    name: '我的代金券',
    path: '/pages/myMsg/pages/myChit/myChit',
    style: 'width:42rpx;height:34rpx',
    src: '../../../image/money.png'
  }, {
    name: '邀请有礼',
    path: '/pages/myMsg/pages/invitation/invitation',
    clas: "adress",
    style: 'width:42rpx;height:40rpx',
    src: '../../../image/invita.png'
  },
  {
    name: '收货地址',
    path: '/pages/myMsg/pages/adressList/adressList',
    clas: "people",
    style: 'width:34rpx;height:40rpx',
    src: '../../../image/adressL.png'
  },
  {
    name: '自提订单',
    path: '/pages/myMsg/pages/pickList/pickList',
    style: 'width:40rpx;height:38rpx',
    src: '../../../image/ziti.png'
  },
  {
    name: '商品收藏',
    path: "/pages/myMsg/pages/myCollect/myCollect?type=0",
    clas: "collection",
    style: 'width:46rpx;height:40rpx',
    src: '../../../image/goodsC.png'
  },
  {
    name: '店铺收藏',
    path: "/pages/myMsg/pages/myCollect/myCollect?type=1",
    clas: "collection",
    style: 'width:44rpx;height:42rpx',
    src: '../../../image/shopC.png'
  },
  {
    name: '帮助中心',
    path: '/pages/myMsg/pages/help/help',
    clas: "people",
    style: 'width:40rpx;height:42rpx',
    src: '../../../image/help.png'
  },

  {
    name: '联系我们',
    path: '',
    clas: "people",
    style: 'width:42rpx;height:40rpx',
    src: '../../../image/helpP.png'
  }
];
let shop = [{
  name: '扫一扫',
  path: '/pages/myMsg/pages/pickList/pickList',
  style: 'width:40rpx;height:38rpx',
  src: '../../../image/pick.png'
}, {
  name: '在线客服',
  path: '/pages/myMsg/pages/userList/userList',
  clas: "people",
  style: 'width:40rpx;height:44rpx',
  src: '../../../image/qr.jpg'
}]
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
    dialogShow: false,
    isMerchant: false,
    orderList: [{
      name: '待付款',
      path: "/pages/home/pages/myOrder/myOrder",
      status: '0',
      src: '../../../image/fukuan.png',
      style: 'width:42rpx;height:34rpx;'
    }, {
      name: '待发货',
      status: '1',
      path: "/pages/home/pages/myOrder/myOrder",
      src: '../../../image/fahuo.png',
      style: 'width:42rpx;height:36rpx;'
    }, {
      name: '待收货',
      status: '2',
      path: "/pages/home/pages/myOrder/myOrder",
      src: '../../../image/shouhuo.png',
      style: 'width:46rpx;height:44rpx'
    }, {
      name: '待评价',
      status: '8',
      path: "/pages/home/pages/myOrder/myOrder",
      src: '../../../image/pingjia.png',
      style: 'width:44rpx;height:46rpx'
    }, {
      name: '退款/售后',
      status: '4',
      path: "/pages/myMsg/pages/saleList/saleList",
      src: '../../../image/shouhou.png',
      style: 'width:54rpx;height:50rpx'
    }],
    btList: [],
    shopList: [],
    isPullDownRefresh: true,
    page: 1,
    token: true,
    userInfo: {}
  },
  setMerchant() {
    if (this.data.isMerchant) {
      this.setData({
        btList: [...btList, ...shop]
      })
    }
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
    })
    if (e.detail.item.token) {
      this.setData({
        token: false,
        isMerchant: !!e.detail.item.userInfo.is_agent,
        userInfo: e.detail.item.userInfo
      })
      this.setMerchant()
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
            userInfo: app.globalData.userInfo,
            isMerchant: re.data.user.is_agent == 1 ? true : false
          })
          that.setMerchant()
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
    if (e.currentTarget.dataset.path != "/pages/home/pages/goodsDealis/goodsDealis" || e.currentTarget.dataset.path != '/pages/myMsg/pages/help/help') {
      if (!wx.getStorageSync('token')) {
        this.setData({
          dialogShow: true
        })
        return false;
      }
    }
    if (e.currentTarget.dataset.name == "扫一扫") {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          console.log(res)
          var path = res.path
          path = path.split('?');
          var scene = String(path[1]);
          let str = scene.split('scene=')[1]
          scene = str.split("&")
          var obj = {};
          for (var i = 0; i < scene.length; i++) {
            var b = scene[i].split("=");
            obj[b[0]] = b[1];
          }
          wx.navigateTo({
            url: `/pages/myMsg/pages/verification/verification?id=${obj.id}&params=${obj.params}`,
          })
        }
      })
      return;
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
        btList: btList,
        dialogShow: true
      })
    } else {
      if (wx.getStorageSync('userInfo').is_agent == 1) {
        this.setData({
          isMerchant: true,
        })
        this.setMerchant()
      }
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