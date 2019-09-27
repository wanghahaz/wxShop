import until from "../../../../utils/util.js";
import http from "../../../../common/js/http.js";
var websocket = require("../../../../common/js/websocket.js");
let inputVal = "";
const app = getApp();
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;
/**
 * 初始化数据
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgList: msgList,
    inputVal: '',
    shopName: null,
    shopId: null,
    scrollHeight: '100vh',
    inputBottom: 0,
    userObj: {}
  },
  pageScrollToBottom() {
    let _this = this;
    wx.createSelectorQuery().select('#scrollMsg').boundingClientRect(function(rect) {
      _this.setData({
        scrollTop: rect.height
      });
    }).exec();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  toRouter(e) {
    wx.navigateBack()
    // let data = until.cutShift(e.currentTarget.dataset);
    // if (data) {
    //   wx.navigateTo({
    //     url: `${e.currentTarget.dataset.path}?${data}`,
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: e.currentTarget.dataset.path,
    //   })
    // }
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    if (options.type) {
      this.setData({
        goods: app.globalData.webGoods
      })
    }
    let _this = this;
    let userObj = wx.getStorageSync('userInfo');
    _this.setData({
      thumb: options.thumb,
      userObj: userObj,
      shopId: options.id,
      bindUser: options.binduser,
      shopName: options.name,
      cusHeadIcon: app.globalData.userInfo.avatar,
    });
    websocket.connect(function(res) {
      let obj = JSON.parse(res.data);
      console.log(obj)
      // console.log(obj)
      if (obj.type == 3) {
        obj.message = `https://www.lyjp.shop/${obj.message}`
      }
      let list = _this.data.msgList;
      list.push(obj)
      _this.setData({
        msgList: list,
        inputVal: ''
      })
      _this.setData({
        toView: 'msg-' + (list.length - 1)
      })
    })
    setTimeout(() => {
      wx.hideLoading();
      let data = {
        uid: this.data.userObj.id,
        ruid: this.data.bindUser,
        cmd: 'login'
      }
      websocket.send(data)
    }, 1000)
    _this.pageScrollToBottom()
    //
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
  lookImg(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  addImg(e) {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        console.log(res)
        wx.uploadFile({
          url: 'https://www.lyjp.shop/file/upload', //仅为示例，非真实的接口地址
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
          },
          formData: {
            file: res.tempFilePaths[0]
          },
          success: function(r) {
            let re = JSON.parse(r.data);
            console.log(re)
            if (re.code == 200) {
              let data = {
                uid: that.data.userObj.id,
                ruid: that.data.bindUser,
                type: 3,
                content: re.data,
                cmd: 'msg'
              }
              websocket.send(data)
            } else {
              until.toast({
                title: '上传失败'
              })
            }
          },
          fail: function(e) {

          }
        })

      }
    })
  },
  onUnload() {
    wx.closeSocket({
      success(res) {
        console.log('已关闭')
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 获取聚焦
   */
  focus: function(e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
  },

  //失去聚焦(软键盘消失)
  blur: function(e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })

  },

  /**
   * 发送点击监听
   */
  bindinput(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  sendClick: function(e) {
    let data = {
      uid: this.data.userObj.id,
      ruid: this.data.bindUser,
      type: 1,
      content: this.data.inputVal || e.detail.value,
      cmd: 'msg'
    }
    websocket.send(data)
    // let time = until.formatTime(new Date()).substring(until.formatTime(new Date()).length, 11);
    // msgList.push({
    //   time: time,
    //   speaker: 'customer',
    //   contentType: 'text',
    //   content: this.data.inputVal || e.detail.value
    // })
    // this.setData({
    //   msgList,
    //   inputVal
    // });
  },

  /**
   * 退回上一页
   */
  toBackClick: function() {
    wx.navigateBack({})
  }

})