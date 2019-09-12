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
    title: null,
    page: 1,
    list: [],
    isDownRefresh: true,
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
    let path = null;
    if (this.data.title == '领取记录') {
      path = '/jifen/get'
    } else {
      path = '/jifen/use'
    }
    http.getReq(path, {
      page: this.data.page
    }, true).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          list: [...this.data.list, ...res.data.data]
        })
        if (res.data.last_page == this.data.page) {
          this.setData({
            isDownRefresh: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          isDownRefresh: false,
          list: []
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.title
    })
    wx.setNavigationBarTitle({
      title: options.title
    })
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
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
})