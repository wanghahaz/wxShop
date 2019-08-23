//index.js
//获取应用实例
const app = getApp();
import until from "../../utils/util.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maskType: 0,
    address: {},
    goodsList: app.globalData.goodsList,
    is_jifen:true
  },
  setShopCheck(){
    this.setData({
      is_jifen: !this.data.is_jifen
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
  // 显示make
  showMake(e) {
    this.setData({
      maskType: e.currentTarget.dataset.type / 1,
    })
  },
  // 结算
  submint() {
    let that = this;
    if (!this.data.address.name) {
      wx.showModal({
        title: '提示',
        content: '您还没有设置收货地址，请先添加收货地址！',
        success(res) {}
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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