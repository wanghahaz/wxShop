//index.js
//获取应用实例
const app = getApp();
import http from "../../common/js/http.js";
import until from "../../utils/util.js";
let timers = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    difference: '00:00:00',
    titleIndex: 2,
    timeList: [{
      time: '2019/08/21 08:00',
      showTime: '08:00',
      isUp: false
    }, {
      time: '2019/08/21 11:00',
      showTime: '11:00',
      isUp: false
    }, {
      time: '2019/08/21 14:00',
      showTime: '14:00',
      isUp: true
    }, {
      time: '2019/08/21 17:00',
      showTime: '17:00',
      isUp: false
    }, {
      time: '2019/08/21 20:00',
      showTime: '20:00',
      isUp: false
    }]
  },
  selectTitle(e) {
    this.setData({
      titleIndex: e.currentTarget.dataset.index
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
  onShow: function() {
    // timers = setInterval(() => {
    //   let difference = until.diffTime(new Date().getTime(), new Date('2019/08/21 10:59').getTime())
    //   this.setData({
    //     difference: difference
    //   })
    //   if (difference=="00:00:00"){
    //     console.log('抢购结束')
    //   }
    // }, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    timers = setInterval(() => {
      let difference = until.diffTime(new Date().getTime(), new Date('2019/08/21 11:00').getTime())
      this.setData({
        difference: difference
      })
    }, 1000)
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