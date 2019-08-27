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
    page: 1,
    list: [],
    isDownRefresh: true,
    first: true
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
  getList() {
    http.getReq('/jifen/logs', {
      page: this.data.page
    }, true).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          list: [...this.data.list, ...res.data.data]
        })
        if (this.data.page >= res.data.last_page) {
          this.setData({
            isDownRefresh: false
          })
          return;
        }
        this.setData({
          page: this.data.page + 1
        })
        if (this.data.first) {
          setTimeout(() => {
            this.getList()
            this.setData({
              first: false
            })
          }, 1000)
        }
      } else {
        this.setData({
          isDownRefresh: false,
          list:[]
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList()
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
    if (this.data.isDownRefresh) {
      console.log(2)
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})