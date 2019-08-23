//index.js
//获取应用实例
const app = getApp();
import until from "../../utils/util.js";
import http from "../../common/js/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 0,
    video: '',
    id: 0,
    obj: {},
    src: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
  },
  // 查看广告
  getAdvert() {
    http.getReq(`/advert/check/${this.data.id}`, {}).then(res => {
      console.log(res)
    })
  },
  // 获取观看奖励 (登录)  播放结束触发
  bindended() {
    http.getReq(`/advert/get_reward/${this.data.obj.id}`, {}).then(res => {
      if (res.code == '200') {
        wx.showModal({
          title: '观看完成',
          content: `恭喜您获得${res.data}元代金券！`,
          confirmText: '下一条',
          onfirmColor: '#223CC9',
          cancelText: '去购物',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        until.toast({title:res.msg})
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
  // 播放进度变化时触发
  bindtimeupdate(e) {
    this.setData({
      time: parseInt(e.detail.duration) - parseInt(e.detail.currentTime)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let video = wx.createVideoContext("myVideo")
    this.setData({
      id: options.id
    })
    this.getAdvert()
    // video.requestFullScreen()
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
    console.log(1)
    return;
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