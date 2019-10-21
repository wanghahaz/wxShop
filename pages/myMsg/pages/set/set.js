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
    user: wx.getStorageSync('userInfo'),
    sexIndex: 0,
    sexLits: [{
      id: 0,
      name: '男'
    }, {
      id: 1,
      name: '女'
    }]
  },
  bindPickerChange(e) {
    this.setData({
      sexIndex: e.detail.value
    })
    http.postReq('/user/gender', {
      gender: e.detail.value == 0 ? '1' : 2
    }).then(res => {
      if (res.code == 200) {
        until.toast({
          title: '修改成功'
        })
      } else {
        until.toast({
          title: '修改失败'
        })
      }
    })
  },
  logout() {
    http.postReq('/logout').then(res => {
      console.log(res)
      if (res.code == 200) {
        wx.removeStorageSync('token')
        wx.removeStorageSync('userInfo')
        wx.switchTab({
          url: '/pages/tabar/mine/mine',
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
    console.log(options)
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