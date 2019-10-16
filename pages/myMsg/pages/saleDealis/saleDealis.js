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
      '3_4': '退款处理中',
      '1_4': '售后处理中',
      '3_6': '商家审核通过',
      '1_6': '商家审核通过',
      '3_7': '退款已完成',
      '1_7': '售后已完成',
      '3_5': '退款申请拒绝',
      '1_5': '售后申请拒绝',
      '1_11': '已寄出,待商家收货'
    },
    form: {
      express_code: '',
      express_company: ''
    }
  },
  // 复制
  setClip(e) {
    wx.setClipboardData({
      data: String(e.currentTarget.dataset.content),
      success(res) {},
      fail(err) {}
    })
  },
  bindinput(e) {
    let data = this.data.form;
    data[e.currentTarget.dataset.type] = e.detail.value;
    this.setData({
      form: data
    })
  },
  // 撤回或者提交物流信息
  editStatus(e) {
    let data = {};
    if (this.data.dealis.status == 4) {
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
    http.postReq(`/order/refund/deal/${this.data.id}`, data, true).then(res => {
      if (res.code == 200) {
        until.toast({
          icon: 'success',
          title: this.data.dealis.status == 4 ? '撤销成功' : '操作成功'
        })
        if (this.data.dealis.status == 4) {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          this.getDealis()
        }
      } else {
        until.toast({
          title: '操作失败'
        })
      }
    })
  },
  call(e) {
    if (this.data.dealis.store.phone) {
      wx.makePhoneCall({
        phoneNumber: this.data.dealis.store.phone //仅为示例，并非真实的电话号码
      })
    } else {
      until.toast({
        title: "商家没有绑定电话！"
      })
    }
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
    http.getReq(`/order/refund/info/${this.data.id}`, {}, true).then(res => {
      console.log(res)
      if (res.code == 200) {
        let data = res.data;
        data.status_ = `${data.type}_${data.status}`
        this.setData({
          dealis: data
        })
      } else {
        until.toast({
          title: '加载失败'
        })
      }
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