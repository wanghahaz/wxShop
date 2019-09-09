//index.js
//获取应用实例
const app = getApp()
import until from "../../../../utils/util.js";
import http from "../../../../common/js/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',
    page: 1,
    hotList: [],
    shopList: [],
    isPullDownRefresh: true,
    isHot: true
  },
  bindinput(e) {
    this.setData({
      searchText: e.detail.value || e.currentTarget.dataset.text
    })
    if (e.type == 'tap') {
      this.setData({
        page: 1,
        isPullDownRefresh: true,
        shopList: []
      })
      this.getList()
    }
  },
  goBack() {
    wx.navigateBack()
  },
  gethot() {
    http.getReq('/search/hot', {}, true).then(res => {
      this.setData({
        hotList: res.data || []
      })
    }).catch(err => { })
  },
  getList() {
    http.postReq('/search', {
      keywords: this.data.searchText,
      page: 1
    }, true).then(res => {
      if (res.code == '200') {
        this.setData({
          isHot: false,
          shopList: [...this.data.shopList, ...res.data.data]
        })
        if (res.data.last_page == this.data.page) {
          this.setData({
            isPullDownRefresh: false
          })
        } else {
          this.setData({
            isHot: false,
            page: this.data.page++
          })
        }
      } else {
        this.setData({
          isHot: false,
          isPullDownRefresh: false
        })
      }

    }).catch(err => { })
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
  // 搜索取消
  seach(e) {
    this.setData({
      page: 1,
      isPullDownRefresh: true,
      shopList: []
    })
    this.getList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethot()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isPullDownRefresh) {
      this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})