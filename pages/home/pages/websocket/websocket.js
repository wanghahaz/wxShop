import until from "../../../../utils/util.js";
import http from "../../../../common/js/http.js";
var websocket = require("../../../../common/js/websocket.js");
let inputVal = "";
const app = getApp();
var msgList = [{
    created_at: '12:12:23',
    ziji: '0',
    type: '1',
    message: '您好，欢迎光临，非常高兴为您服务，有什么可以为您效劳呢?'
  },
  {
    created_at: '12:15:58',
    ziji: '1',
    type: '1',
    message: '我怕是走错片场了...'
  }, {
    created_at: '12:12:23',
    ziji: '0',
    type: '1',
    message: '您好，欢迎光临，非常高兴为您服务，有什么可以为您效劳呢?'
  },
  {
    created_at: '12:15:58',
    ziji: '1',
    type: '1',
    message: '我怕是走错片场了...'
  }, {
    created_at: '12:12:23',
    ziji: '0',
    type: '1',
    message: '您好，欢迎光临，非常高兴为您服务，有什么可以为您效劳呢?'
  },
  {
    created_at: '12:15:58',
    ziji: '1',
    type: '1',
    message: '我怕是走错片场了...'
  }, {
    created_at: '12:12:23',
    ziji: '0',
    type: '1',
    message: '您好，欢迎光临，非常高兴为您服务，有什么可以为您效劳呢?'
  },
  {
    created_at: '12:15:58',
    ziji: '1',
    type: '1',
    message: '我怕是走错片场了...'
  }
];
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
  onLoad: function(options) {
    let _this = this;
    let userObj = wx.getStorageSync('userInfo');
    _this.setData({
      userObj: userObj,
      shopId: options.id,
      shopName: options.name,
      cusHeadIcon: app.globalData.userInfo.avatar,
    });
    websocket.connect(function(res) {
      console.log()
      let list = _this.data.msgList;
      list.push(JSON.parse(res.data))
      _this.setData({
        msgList: list,
        inputVal: ''
      })
      _this.setData({
        toView: 'msg-' + (list.length - 1)
      })
    })
    _this.pageScrollToBottom()
    //
  },
  open() {

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
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        let time = until.formatTime(new Date()).substring(until.formatTime(new Date()).length, 11);
        msgList.push({
          time: time,
          speaker: 'customer',
          contentType: 'img',
          content: res.tempFilePaths[0]
        })
        that.setData({
          msgList,
          inputVal
        });
        that.setData({
          scrollHeight: '100vh',
          inputBottom: 0
        })
        that.setData({
          toView: 'msg-' + (msgList.length - 1)
        })

        // wx.uploadFile({
        //   url: 'https://cardname.yunpaas.cn/phase/image', //仅为示例，非真实的接口地址
        //   filePath: res.tempFilePaths[0],
        //   name: 'file',
        //   header: {
        //     "Content-Type": "multipart/form-data",
        //   },
        //   formData: {
        //     file: res.tempFilePaths[0]
        //   },
        //   success: function(res) {
        //     that.setData({
        //       logoSrc: JSON.parse(res.data).data
        //     })
        //   },
        //   fail: function(e) {
        //     console.log(e)
        //   }
        // })

      }
    })
  },
  onUnload() {
    wx.closeSocket({
      success(res) {
        console.log('已关闭')
        console.log(res)
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
      ruid: 17,
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