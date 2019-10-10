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
    cate_id: null,
    page: 1,
    shopList: [],
    type: 0,
    isPullDownRefresh: true
  },
  getGoods() {
    let url = null;
    let data = {
      page: this.data.page
    }
    if (this.data.type == 1) { //商店跳转过来
      url = `/store/info/goods/${this.data.cate_id}`
      data.cate = this.data.clfiyId;
    } else { //分类跳转过来
      url = `/cate/get_goods_list/${this.data.cate_id}`
    }
    http.getReq(url, data, true).then(res => {
      if (res.code == 200) {
        this.setData({
          shopList: [...this.data.shopList, ...res.data.data]
        })
        if (res.data.last_page == this.data.page) {
          this.setData({
            isPullDownRefresh: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          isPullDownRefresh: false,
          shopList: []
        })
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
      title: options.name, //页面标题为路由参数
    })
    this.setData({
      type: options.type || 0,
      clfiyId: options.clfiyid || 0,
      cate_id: options.id
    })
    this.getGoods()
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
    if (this.data.isPullDownRefresh) {
      this.getGoods()
    }
  },

  /**
   * 用户点击右上角分享
   */

})