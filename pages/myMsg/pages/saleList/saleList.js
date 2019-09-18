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
    status: {
      '3_4': '退款处理中',
      '1_4': '售后处理中',
      '3_7': '退款已完成',
      '1_7': '售后已完成',
      '3_5': '退款申请拒绝',
      '1_5': '售后申请拒绝',
    },
    isLoading: true,
    list: [],
    page: 1
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
    http.getReq('/order/refund/list', {
      page: this.data.page
    }).then(res => {
      if (res.code == 200) {
        let list = res.data.data;
        list.forEach(item => {
          item.status_ = `${item.type}_${item.status}`
        })
        this.setData({
          list: [...this.data.list, ...list]
        })
        if (res.data.last_page == this.data.page) {
          this.setData({
            isLoading: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          isLoading: false
        })
      }
    })
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
    this.setData({
      list: []
    })
    this.getList()
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
    if (this.data.isLoading) {
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
})