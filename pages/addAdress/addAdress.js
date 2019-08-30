//index.js
//获取应用实例
const app = getApp();
import http from "../../common/js/http.js";
import until from "../../utils/util.js";
var model = require('../../element/area/area.js')
var show = false;
var item = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      show: show
    },
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
  //点击选择城市按钮显示picker-view
  translate: function(e) {
    model.animationEvents(this, 0, true, 200);
  },
  //隐藏picker-view
  hiddenFloatView: function(e) {
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function(e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    let data = JSON.parse(JSON.stringify(this.data.form))
    data.area = item.countys[item.value[2]].code;
    data.areaName = item.countys[item.value[2]].name;
    data.city = item.citys[item.value[1]].code;
    data.cityName = item.citys[item.value[1]].name;
    data.province = item.provinces[item.value[0]].code;
    data.provinceName = item.provinces[item.value[0]].name;
    this.setData({
      form: data
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
  // 删除地址
  del() {
    http.postReq(`/address/del/${this.data.id}`, {}, true).then(res => {
      if (res.code == 200) {
        until.toast({
          title: '删除成功'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        until.toast({
          title: '操作失败'
        })
      }
    })
  },
  // 提交新增编辑
  submit: function(e) {
    let api = this.data.id ? `/address/edit/${this.data.id}` : `/address/add`;
    let data = {
      province: this.data.form.province,
      city: this.data.form.city,
      area: this.data.form.area,
      address_detail: this.data.form.address_detail,
      name: this.data.form.name,
      phone: this.data.form.phone,
      is_default: this.data.form.is_default ? 1 : 0,
    }
    console.log(data)
    for (let i in data) {
      if (i != 'is_default' && !data[i]) {
        until.toast({
          title: '请您填写完整信息'
        })
        return false;
      }
    }
    http.postReq(api, data, true).then(res => {
      if (res.code == 200) {
        until.toast({
          title: this.data.id ? '修改成功' : '添加成功'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        until.toast({
          title: '操作失败'
        })
      }
    })
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
    let that = this;
    if (options.id) {
      http.getReq(`/address/edit/${options.id}`, {}, true).then(res => {
        if (res.code == 200) {
          let data = JSON.parse(JSON.stringify(this.data.form))
          data.address_detail = res.data.address_detail;
          data.area = res.data.area;
          data.city = res.data.city;
          data.name = res.data.name;
          data.phone = res.data.phone;
          data.province = res.data.province;
          data.is_default = res.data.is_default ? true : false;
          item = this.data.item;
          this.setData({
            form: data
          })
          model.updateAreaData(that, 0);
        }
      })
    } else {
      model.updateAreaData(that, 0);
    }
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
      this.setData({
        form: form
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {},

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