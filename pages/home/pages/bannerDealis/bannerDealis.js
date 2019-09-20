//index.js
//获取应用实例
const app = getApp();
import until from "../../../../utils/util.js";
import http from "../../../../common/js/http.js";
let timers = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: null,
    video: '',
    id: 0,
    ad_link: null,
    ad_thumb: null,
  },
  // 双倍收益结束
  double() {
    until.modal({
      title: '提示',
      content: '您的双倍收益卡时长已用完，是否使用下一张收益卡？'
    }).then(res => {

    })
  },
  // 右上角关闭
  back() {
    if (this.data.time > 0) {
      let video = wx.createVideoContext("myVideo")
      video.pause()
      until.modal({
        title: '确定要退出吗？',
        content: '看完即获得代金券，退出将无法获得哦!'
      }).then(res => {
        wx.navigateBack()
      }).catch(err => {
        video.play()
      })
    } else {
      wx.navigateBack()
    }
  },
  // 获取下一条广告
  getNext() {
    if (this.data.time > 0) {
      return;
    }
    http.getReq('/advert/get_next_advert', {}).then(res => {
      if (res.code == 200) {
        this.setData({
          id: res.data
        })
        this.getAdvert()
      } else {
        until.toast({
          title: res.msg || '获取失败'
        })
      }
    })
  },
  // 查看广告
  getAdvert() {
    http.getReq(`/advert/check/${this.data.id}`, {}, true).then(res => {
      this.setData({
        video: res.data.video,
        ad_link: res.data.ad_link,
        ad_thumb: res.data.ad_thumb,
      })
      let video = wx.createVideoContext("myVideo")
      // video.requestFullScreen()
      video.play()
      // console.log(res.data)
    })
  },
  // 获取观看奖励 (登录)  播放结束触发
  bindended() {
    let that = this;
    if (wx.getStorageSync('token')) {
      http.getReq(`/advert/get_reward/${this.data.id}`, {}).then(res => {
        if (res.code == '200') {
          wx.showModal({
            title: '观看完成',
            content: `恭喜您获得${res.data}元代金券！`,
            confirmText: '下一条',
            onfirmColor: '#223CC9',
            cancelText: '去购物',
            success(res) {
              if (res.confirm) {
                that.getNext()
                console.log('用户点击确定')
              } else if (res.cancel) {
                wx.switchTab({
                  url: '/pages/tabar/index/index',
                })
              }
            }
          })
        } else {
          until.toast({
            title: res.msg
          })
        }

      })
    } else {
      wx.showModal({
        title: '观看完成',
        content: `您还未登陆,登录后观看可获得代金券哦~`,
        confirmText: '去购物',
        onfirmColor: '#223CC9',
        cancelText: '去登录',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/tabar/index/index',
            })
          } else if (res.cancel) {
            wx.switchTab({
              url: '/pages/tabar/mine/mine',
            })
          }
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
    this.setData({
      id: options.id
    })
    if (options.time > 0) {
      timers = setInterval(() => {
        let times = until.diffTime(new Date().getTime(), `${options.time}000`)
        this.setData({
          h: times.hours,
          m: times.minutes,
          s: times.seconds
        })
        if (times.hours == '00' && times.minutes == '00' && times.seconds == '00') {
          clearInterval(timers)
        }
      }, 1000)
    } else {
      this.setData({
        h: '00',
        m: '00',
        s: '00'
      })
    }
    this.getAdvert()
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
    clearInterval(timers)
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