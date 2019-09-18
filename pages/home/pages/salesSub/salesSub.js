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
    noSales: 0,
    show_model: false,
    titleName: null,
    radioIndex: null,
    saleData: {},
    goods: {},
    checkList: []
  },
  bindinput(e) {
    let data = this.data.saleData;
    data.content = e.detail.value;
    this.setData({
      saleData: data
    })
  },
  select() {
    this.setData({
      show_model: !this.data.show_model
    })
  },
  radioChange(e) {
    this.setData({
      radioIndex: e.detail.value,
      show_model: false
    })
  },
  sub() {
    if (this.data.radioIndex == null) {
      until.toast({
        title: `请您选择${this.data.titleName}原因`
      })
      return
    }
    let data = this.data.saleData;
    data.reason = this.data.checkList[this.data.radioIndex]
    http.postReq('/order/refund/apply', data).then(res => {
      if (res.code == 200) {
        until.toast({
          icon: 'success',
          title: `${this.data.titleName}成功`
        })
        setTimeout(() => {
          wx.navigateTo({
            url: `/pages/myMsg/pages/saleDealis/saleDealis?id=${res.data}`,
          })
        }, 1500)
      } else {
        until.toast({
          title: res.msg || `操作失败`
        })
      }
    })
  },
  getCheckList() {
    http.getReq('/order/refund/get_refund_reason', {
      type: this.data.name == '退款' ? 3 : 1,
    }).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          checkList: res.data
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
  changeTitle(e) {
    this.setData({
      titleIndex: e.currentTarget.dataset.index,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let obj = {
      order_id: options.orderid,
      order_data_id: options.goodid,
      type: options.name == '退款' ? 3 : 1,
      goods_num: app.globalData.saleGoods.goods_num,
      content: '',
      reason: '',
    }
    this.setData({
      titleName: options.name,
      saleData: obj,
      goods: app.globalData.saleGoods
    })
    this.getCheckList()
    wx.setNavigationBarTitle({
      title: `申请${options.name}`,
    })
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
})