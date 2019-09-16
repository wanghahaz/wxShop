//index.js
//获取应用实例
const app = getApp();
import http from "../../../common/js/http.js";
import until from "../../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fyList: [],
    leftList: [],
    leftIndex: 0,
    pid: null,
    height: 0,
  },
  // 顶级分类
  getIndex() {
    http.getReq('/cate/index', {}).then(res => {
      // console.log(res)
      let id = res.data[this.data.leftIndex].id;
      this.setData({
        fyList: res.data,
        pid: id
      })
      this.getCate()
    })
  },
  // 获取二三级
  getCate() {
    http.getReq(`/cate/get_cate/${this.data.pid}`, {}, true).then(res => {
      if (res.code == 200) {
        this.setData({
          leftList: res.data
        })
      } else {
        until.toast({
          title: res.msg || '加载失败'
        })
      }
    }).catch(err => {})
  },
  changelf(e) {
    let id = this.data.fyList[e.currentTarget.dataset.index].id;
    this.setData({
      leftIndex: e.currentTarget.dataset.index,
      pid: id
    })
    this.getCate()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!wx.getStorageSync('share_id')) {
      wx.setStorage({
        key: "share_id",
        data: options.share_id ? options.share_id : 0
      })
    }
    this.getIndex()
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight;
        let clientWidth = res.windowWidth;
        let ratio = 750 / clientWidth;
        let height = clientHeight * ratio;
        that.setData({
          height: height
        });
      }
    });

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
        selected: 1
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
      path: '/pages/tabar/classify/classify?share_id=' + share_id,
    }
  }
})