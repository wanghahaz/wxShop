//index.js
//获取应用实例
const app = getApp();
import until from "../../utils/util.js";
import http from "../../common/js/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noSales: 0,
    show_model: false,
    titleName: null,
    radioIndex:null,
    checkList: ['商品无货', '发货时间问题', '不想要了', '商品信息填写有误', '其他',
      '不想要了', '商品信息填写有误', '其他'
    ]
  },
  select() {
    this.setData({
      show_model: !this.data.show_model
    })
  },
  radioChange(e) {
    this.setData({
      radioIndex:e.detail.value
    })
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
      titleName: options.name
    })
    wx.setNavigationBarTitle({
      title: options.name,
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
  onShareAppMessage: function() {

  }
})