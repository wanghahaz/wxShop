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
    noSales: 0
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
  changeTitle(e) {
    this.setData({
      titleIndex: e.currentTarget.dataset.index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goodId: options.goodid,
      orderId: options.orderid
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
})