//index.js
//获取应用实例
const app = getApp();
import http from "../../../../common/js/http.js";
import until from "../../../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oftenList: ['下单后商家迟迟没有发货怎么办', '下单后商家迟迟没有发货怎么办', '下单后商家迟迟没有发货怎么办', '下单后商家迟迟没有发货怎么办'],
    moreList: [{
      name: '订单问题',
      path: '/pages/myMsg/pages/helpList/helpList',
      list: ['修改订单', '修改订单', '修改订单', '修改订单', '修改订单']
    }, {
      name: '订单问题',
      path: '/pages/myMsg/pages/helpList/helpList',
      list: ['修改订单', '修改订单', '修改订单', '修改订单', '修改订单']
    }, {
      name: '订单问题',
      path: '/pages/myMsg/pages/helpList/helpList',
      list: ['修改订单', '修改订单', '修改订单', '修改订单', '修改订单']
    }]
  },
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})