//index.js
//获取应用实例
const app = getApp();
import http from "../../../common/js/http.js";
import until from "../../../utils/util.js";
let timers = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    dialogShow: false,
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 10,
    size: 14,
    interval: 45,
    ads: [],
    row: {},
    logsList: [],
    height: 0,
    cardNum: 0,
    time: ''
  },
  tapDialogButton(e) {
    console.log('dialog', e.detail)
    this.setData({
      dialogShow: false,
    })
  },
  //点击使用体验卡 
  startCard(e) {
    http.postReq('/advert/use_gift_card', {}, true).then(res => {
      console.log(res)
      if (res.code == 200) {
        until.toast({
          title: '您已开启双倍收益'
        })
        this.getIndex()
      } else {
        until.toast({
          title: res.msg || '操作失败'
        })
      }
    })
  },
  // 广告获得奖励列表
  getLogs() {
    http.getReq('/advert/jifen_logs', {
      page: this.data.page,
    }).then(res => {
      this.setData({
        logsList: res.data
      })

      var length = this.data.logsList.length * 60; //文字长度
      let windowWidth = this.data.height - 878
      this.setData({
        length: length,
        windowWidth: windowWidth,
        marquee2_margin: length < windowWidth ? windowWidth - length : this.data.marquee2_margin //当文字长度小于屏幕长度时，需要增加补白
      });
      this.run2()
    })
  },
  getIndex() {
    // 广告首页
    http.getReq('/advert/index', {
      user_id: app.globalData.userInfo.id ? app.globalData.userInfo.id : '0'
    }).then(res => {
      this.setData({
        cardNum: res.data.gift_card_num,
        ads: res.data.ads,
        row: res.data.row,
        supNum: res.data.is_useing_gift_card,
        time: res.data.left_time
      })
    })
  },
  toRouter(e) {
    if (e.currentTarget.dataset.path == "/pages/home/pages/invitation/invitation" || e.currentTarget.dataset.login) {
      if (!wx.getStorageSync('token')) {
        this.setData({
          dialogShow: true
        })
        return false;
      }
    }
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
  run2: function() {
    var vm = this;
    var interval = setInterval(function() {
      if (-vm.data.marqueeDistance2 < vm.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
        clearInterval(interval);
        vm.run2();
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          vm.run2();
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval);
  },
  onLoad: function(options) {
    if (!wx.getStorageSync('share_id')) {
      wx.setStorage({
        key: "share_id",
        data: options.share_id ? options.share_id : 0
      })
    }
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
        selected: 2
      })
    }
    this.setData({
      isLogin: wx.getStorageSync('token') ? true : false
    })
    this.getIndex()
    this.getLogs()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(timers)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

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
  onShareAppMessage: function(e) {
    let share_id = null;
    if (wx.getStorageSync('token')) {
      share_id = wx.getStorageSync('userInfo').id;
    } else {
      share_id = 0;
    }
    return {
      title: '您好，欢迎零元晋品',
      path: '/pages/tabar/advertising/advertising?share_id=' + share_id,
    }
  }
})