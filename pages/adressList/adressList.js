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
    isLoding: true,
    page: 1,
    items: []
  },
  // 收货地址列表
  getItems() {
    http.getReq('/address/index', {
      page: this.data.page
    }, true).then(res => {
      if (res.code == 200) {
        this.setData({
          items: [...this.data.items, ...res.data.data]
        })
        if (this.data.page >= res.data.last_page) {
          this.setData({
            isLoding: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          isLoding: false
        })
      }
    })
  },
  radioChange: function(e) {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2];
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
        if (res.authSetting["scope.address"] == false) {
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
    this.setData({
      items: []
    })
    this.getItems()
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
    if (this.data.isLoding) {
      this.getItems()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})