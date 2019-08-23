//index.js
//获取应用实例
const app = getApp();
import http from "../../common/js/http.js";
import until from "../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    adress: {},
    form: {
      name: '',
      phone: '',
      address_detail: '',
      is_default: 0,
      province: '',
      city: '',
      area: '',
      provinceName: '',
      cityName: '',
      areaName: '',
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

  submit: function(e) {
    console.log(this.data.form)
  },
  bindinput(e) {
    let form = this.data.form;
    form[e.currentTarget.dataset.name] = e.detail.value;
    this.setData({
      form: form
    })
  },
  switch1Change(e) {
    let form = this.data.form;
    form['is_default'] = e.detail.value ? 1 : 0;
    this.setData({
      form: form
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id || null
    })
    if (options.userName) {
      let form = this.data.form;
      form['name'] = options.userName;
      form['phone'] = options.telNumber;
      form['address_detail'] = `${options.countyName} ${options.detailInfo}`;
      form['provinceName'] = options.provinceName;
      form['cityName'] = options.cityName;
      console.log(form)
      this.setData({
        form: form
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})