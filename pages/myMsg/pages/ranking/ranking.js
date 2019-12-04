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
    goodsList: [],
    typeInd: 0
  },
  bindinput(e) {
    console.log(e)
  },
  secectType(e) {
    this.setData({
      typeInd: e.currentTarget.dataset.index
    })
  },
  getList(e) {
    http.getReq(`/store/info/goods_list/1`, {
      type: 1,
      page: 1
    }, true).then(res => {
      if (res.code == 200) {
        this.setData({
          goodsList: res.data.data
        })
        console.log(this.data.goodsList)
        // goodsList: [...this.data.goodsList, ...res.data.data]
        // if (res.data.last_page == this.data.page) {
        //   this.setData({
        //     isPullDownRefresh: false
        //   })
        // } else {
        //   this.setData({
        //     page: this.data.page + 1
        //   })
        // }
      } else {
        // this.setData({
        //   goodsList: [],
        //   isPullDownRefresh: false
        // })
      }

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
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: `${options.name}`
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})