//index.js
//获取应用实例
const app = getApp();
import until from "../../../../utils/util.js";
import http from "../../../../common/js/http.js";
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
    is_collect: 0,
    shopId: null,
    shopObj: {},
    titleIndex: 1,
    shopList: [],
    page: 1,
    store_cate: [],
    isPullDownRefresh: true,
    showMask: true
  },
  showModel() {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  // 组件返回值
  tapDialogButton(e) {
    console.log('dialog', e.detail)
    this.setData({
      dialogShow: false,
    })
  },
  getShopDealis() {
    http.getReq(`/store/info/${this.data.shopId}`, {
      user_id: app.globalData.userInfo.id ? app.globalData.userInfo.id : '0'
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          is_collect: res.data.is_collect,
          shopObj: res.data.row,
          store_cate: res.data.store_cate
        })
      } else {
        until.taost({
          title: res.msg || '获取数据失败，请您重新获取'
        })
      }
    })
  },
  getFiyList() {
    // http.getReq(`/store/info/goods/${this.data.shopId}`, {}).then(res => {
    //   console.log(res)
    // })
  },
  getList(e) {
    http.getReq(`/store/info/goods_list/${this.data.shopId}`, {
      type: this.data.titleIndex,
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
        this.setData({
          shopList: [],
          isPullDownRefresh: false
        })
      }

    })
  },
  collectGoods() {
    http.postReq('/collect', {
      id: this.data.shopId,
      type: 2
    }, true).then(res => {
      let is_collect = res.msg == '收藏成功' ? 1 : 0
      this.setData({
        is_collect: is_collect
      })
    })
  },
  selectTitle(e) {
    this.setData({
      titleIndex: e.currentTarget.dataset.index,
      page: 1,
      shopList: [],
      isPullDownRefresh: true
    })
    this.getList()
  },
  toRouter(e) {
    let data = until.cutShift(e.currentTarget.dataset);
    if (e.currentTarget.dataset.path == '/pages/home/pages/websocket/websocket') {
      if (!wx.getStorageSync('token')) {
        this.setData({
          dialogShow: true
        })
        return false;
      }
    }
    if (data) {
      wx.navigateTo({
        url: `${e.currentTarget.dataset.path}?${data}`,
      })
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.path,
      })
    }
    this.setData({
      showMask: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!wx.getStorageSync('share_id')) {
      wx.setStorage({
        key: "share_id",
        data: options.share_id ? options.share_id : 0
      })
    }
    this.setData({
      shopId: options.id
    })
    this.getShopDealis()
    this.getList()
    this.getFiyList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
      this.getList()
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
      path: '/pages/home/pages/shopDetails/shopDetails?share_id=' + share_id,
    }
  }
})