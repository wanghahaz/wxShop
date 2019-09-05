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
    sIndex: 0,
    userList: [],
    ads: {},
    showMask: true
  },
  showModel() {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  selectIndex(e) {
    this.setData({
      sIndex: e.currentTarget.dataset.index
    })
  },
  // 邀请首页上部
  getImgList() {
    http.getReq('/user/share', {}, true).then(res => {
      if (res.code == 200) {
        this.setData({
          ads: res.data
        })
      } else {
        until.toast({
          'title': '加载失败'
        })
      }
    })
  },
  // 我的邀请列表
  getShare_list() {
    http.getReq('/user/share/share_list', {}, true).then(res => {
      // if(res.code==200){
      //   this.setData({
      //     userList:res.data
      //   })
      // }
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
    this.getImgList()
    this.getShare_list()
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
    let share_id = null;
    if (wx.getStorageSync('token')) {
      share_id = wx.getStorageSync('userInfo').id;
    } else {
      share_id = 0;
    }
    return {
      title: '您好，欢迎零元晋品',
      path: '/pages/share/share?share_id=' + share_id,
    }
  }
})