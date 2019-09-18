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
    id: null,
    dealis: {},
    statusObj: {
      '1_4': '退款处理中',
      '3_4': '售后处理中',
      '1_6': '商家审核通过',
      '3_6': '商家审核通过',
      '1_7': '退款已完成',
      '3_7': '售后已完成',
      '1_5': '退款申请拒绝',
      '3_5': '售后申请拒绝',
    },
    form: {
      express_code: '',
      express_company: ''
    }
  },
  editStatus(e) {
    let data = {};
    if (this.dealis.status == 4) {
      data = {
        action: 1
      }
    } else {
      data = {
        action: 2,
        express_code: this.data.form.express_code,
        express_company: this.data.form.express_company,
      }
    }
    http.postReq(`/order/refund/deal/${this.data.id}`).then(res => {
      if (res.code == 200) {
        until.toast({
          icon: 'success',
          title: '撤销成功'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {

      }
    })
  },
  call(e) {
    until.toast({
      title: "商家没有绑定电话！"
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
  getDealis() {
    http.getReq(`/order/refund/info/${this.data.id}`, {}).then(res => {
      console.log(res)
      let data = res.data;
      data.status_ = `${data.type}_${data.status}`
      this.setData({
        dealis: data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
    this.getDealis()
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