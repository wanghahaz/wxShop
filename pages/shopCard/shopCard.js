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
    shopList: [],
    goodsList: app.globalData.goodsList,
    totalPrice: 0,
    count: 0,
    allCheck: true,
    page: 1,
    isPullDownRefresh: true,
  },
  getGoods() {
    http.getReq('/index/goods', {
      page: this.data.page
    }, true).then(res => {
      this.setData({
        shopList: [...this.data.shopList, ...res.data.data]
      })
      if (res.data.last_page == this.data.page) {
        this.setData({
          isPullDownRefresh: false
        })
      } else {
        this.setData({
          page: this.data.page++
        })
      }
    })
  },
  getShopList() {
    http.getReq('/cart', {}, true).then(res => {
      console.log(res)
    })
  },
  // 设置选择
  setShopCheck(e) {
    let list = [];
    if (e.currentTarget.dataset.ind != undefined) {
      this.data.goodsList[e.currentTarget.dataset.index].goods[e.currentTarget.dataset.ind].check = !e.currentTarget.dataset.check;
      list = this.data.goodsList;
      this.setData({
        goodsList: app.setCheck(list, '1').list,
        allCheck: app.setCheck(list, '1').allCheck,
      })
    } else {
      this.data.goodsList[e.currentTarget.dataset.index].check = !e.currentTarget.dataset.check;
      list = this.data.goodsList;
      this.setData({
        goodsList: app.setCheck(list, '2').list,
        allCheck: app.setCheck(list, '2').allCheck,
      })
    }
  },
  // 全选切换
  selectAll() {
    this.setData({
      allCheck: !this.data.allCheck,
      goodsList: app.setCheck(this.data.goodsList, '', !this.data.allCheck).list
    })
    app.getPrice()
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
    this.getShopList()
    this.getGoods();//好物推荐
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
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
    if (this.data.isPullDownRefresh && this.data.goodsList.length == 0) {
      this.getGoods()
    }
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