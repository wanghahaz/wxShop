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
    list: [{
      src: '../../../../image/pick.png',
      style: 'width:40rpx;height:40rpx',
      path: '',
      name: '扫一扫',
    }, {
      path: '/pages/myMsg/pages/verification/verification',
      style: 'width:42rpx;height:40rpx',
      src: '../../../../image/helpP.png',
      name: '客服'
    }]
  },
  qr(e) {
    if (e.currentTarget.dataset.path) {
      wx.navigateTo({
        url: `${e.currentTarget.dataset.path}`,
      })
    } else {
      wx.scanCode({
        onlyFromCamera: true,
        success(res) {
          console.log(res)
          var path = res.path
          path = path.split('?');
          var scene = String(path[1]);
          let str = scene.split('scene=')[1]
          scene = str.split("&")
          var obj = {};
          for (var i = 0; i < scene.length; i++) {
            var b = scene[i].split("=");
            obj[b[0]] = b[1];
          }
          wx.navigateTo({
            url: `/pages/myMsg/pages/verification/verification?id=${obj.id}&params=${obj.params}`,
          })
        }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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