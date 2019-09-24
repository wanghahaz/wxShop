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
    sIndex: 0,
    userList: [],
    ads: {},
    showMask: true,
    isBottom: true,
    page: 1
  },
  showModel() {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  selectIndex(e) {
    this.setData({
      isBottom: true,
      page: 1,
      userList: [],
      sIndex: e.currentTarget.dataset.index
    })
    this.getShare_list()
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
  // 邀请规则
  getRule() {
    http.getReq('/user/share/share_rule', {}).then(res => {
      this.setData({
        rule: res.data.content
      })
    })
  },
  // 我的邀请列表
  getShare_list() {
    let url = null;
    if (this.data.sIndex == 0) {
      // 好友列表
      url = '/user/share/share_list'
    } else {
      // 道具卡
      url = '/user/share/gift_card'
    }
    http.getReq(url, {
      page: this.data.page
    }, true).then(res => {
      if (res.code == 200) {
        this.setData({
          userList: [...res.data.data, ...this.data.userList]
        })
        if (this.data.page == res.data.last_page) {
          this.setData({
            isBottom: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          userList: [],
          isBottom: false
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
    this.getImgList()
    this.getShare_list()
    this.getRule()
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
    if (this.data.isBottom) {
      this.getShare_list()
    }
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
      title: '您好，欢迎使用零元晋品',
      path: '/pages/tabar/share/share?share_id=' + share_id,
    }
  }
})