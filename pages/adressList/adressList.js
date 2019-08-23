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
    type: false,
    address: {},
    items: [{
      id: 1,
      name: "张三",
      adress: '山西省太原市小店区',
      tel: '15700001234',
      checked: true
    }, {
      id: 2,
      name: "李四",
      adress: '山西省太原市小店区',
      tel: '15700001234'
    }]
  },
  radioChange: function(e) {
    var obj1 = {
      address_id: '1',
      list: [{
        name: '张三',
        age: 12
      }]
    }
    console.log(obj1)
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2];
    console.log(prevPage)
    let obj = this.data.items.find(value => value.id == e.detail.value)
    prevPage.setData({
      address: obj
    })
    wx.navigateBack()
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
  //获取位置
  getLocation() {
    let that = this;
    wx.chooseAddress({
      success: function(res) {
        that.setData({
          address: res
        })
        let data = until.cutShift(res);
        if (res) {
          wx.navigateTo({
            url: `/pages/addAdress/addAdress?${data}`,
          })
        }
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  getAddress() {
    var _this = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.address"]==false) {
          wx.openSetting({
            success(res) {
              _this.getLocation()
            }
          })
        } else {
          _this.getLocation()
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type || false
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
  onShow: function() {

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