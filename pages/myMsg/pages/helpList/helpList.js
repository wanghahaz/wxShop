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
    id: 0,
    content: '',
    issue: [],
    isLoding: true,
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
  bindconfirm(e) {
    console.log(e)
    this.setData({
      page: 1,
      type: 1,
      isLoding: true,
      issue: [],
      keywords: e.detail.value
    })
    this.getSearch()
  },
  getSearch() {
    http.postReq('/helper/search', {
      keywords: this.data.keywords
    }, true).then(res => {
      if (res.code == 200) {
        this.setData({
          issue: [...this.data.issue, ...res.data.data]
        })
        if (res.data.last_page == this.data.page) {
          this.setData({
            isLoding: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          isLoding: false
        })
      }
    })
  },
  bindinput(e) {
    this.setData({
      content: e.detail.value
    })
  },
  getDealis() {
    http.getReq(`/helper/list/${this.data.id}`, {
      page: this.data.page
    }, true).then(res => {
      if (res.code == 200) {
        this.setData({
          issue: [...this.data.issue, ...res.data.data]
        })
        if (res.data.last_page == this.data.page) {
          this.setData({
            isLoding: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          isLoding: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      type: options.type,
      id: options.id
    })
    if (!options.type) {
      this.getDealis()
    }
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
    if (this.data.isLoding) {
      if (this.data.type == 1) {
        this.getSearch()
      } else {
        this.getDealis()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})