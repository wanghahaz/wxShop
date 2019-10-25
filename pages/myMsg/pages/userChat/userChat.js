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
    type: 1,
    msgList: msgList,
    inputVal: '',
    shopName: null,
    shopId: null,
    scrollHeight: '100vh',
    inputBottom: 0,
    userObj: {},
    toUser: {},
    page: 1,
    isLoading: true
  },
  // 跳转最底部
  pageScrollToBottom() {
    let _this = this;
    wx.createSelectorQuery().select('#scrollMsg').boundingClientRect(function(rect) {
      _this.setData({
        toView: 'msg-' + (_this.data.msgList.length - 1)
      });
    }).exec();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  toRouter(e) {
    let data = until.cutShift(e.currentTarget.dataset);
    if (e.currentTarget.dataset.type == 2) {
      wx.navigateBack()
    } else {
      wx.navigateTo({
        url: `${e.currentTarget.dataset.path}?${data}`,
      })
    }
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    http.getReq(`/im_msg/info/${this.data.toUser.id}`, {
      page: this.data.page
    }).then(res => {
      console.log(res)
      if (res.code == 200) {
        let msgList = res.data.data;
        let list = [];
        msgList.forEach(item => {
          list.push({
            msg_type: item.msg_type,
            time: item.created_at,
            msg: item.content,
            is_my: item.user_id == this.data.userObj.id ? 1 : 0
          })
        })

        this.setData({
          msgList: [...list.reverse(), ...this.data.msgList],
        })
        if (this.data.type == 1) {
          this.setData({
            type: 0,
          })
          this.pageScrollToBottom()
        }
        if (this.data.page >= res.data.last_page) {
          this.setData({
            isLoading: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          isLoading: false,
        })
      }
      wx.hideLoading();
    })
  },
  // 发送商品
  sendGoods(e) {
    let data = {
      api_token: this.data.userObj.api_token,
      to_uid: this.data.bindUser,
      msg_type: 4,
      msg: this.data.goods.goods_id,
    }
    websocket.send(data)
  },
  // 分页加载
  bindscrolltoupper(e) {
    if (this.data.isLoading) {
      this.getList()
    } else {
      until.toast({
        title: '没有更多消息了'
      })
    }
    // console.log('触顶了')
  },
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: `${options.name}`
    })
    this.setData({
      toUser: options,
      thumb:options.avatar
    })
    let _this = this;
    let userObj = wx.getStorageSync('userInfo');
    _this.setData({
      userObj: userObj,
      cusHeadIcon: app.globalData.userInfo.avatar,
    });
    this.getList()
    websocket.connect(function(res) {
      let is = res.data.indexOf('{')
      if (is != '-1') {
        let obj = JSON.parse(res.data);
        if (obj.code == 0) {
          wx.showLoading({
            title: '您已断开连接，正在重新连接',
          })
          wx.closeSocket();
          websocket.connect(function(res) {
            wx.hideLoading();
            if (res.data == '连接websocket成功！') {
              until.toast({
                title: '连接成功'
              })
            } else {
              until.toast({
                title: '连接失败，请您重新连接'
              })
            }
          })
        } else {
          let list = _this.data.msgList;
          list.push(obj)
          _this.setData({
            msgList: list,
            inputVal: '',
            toView: `msg-${list.length-1}`
          })
        }
      } else if (res.data == '1312') {
        wx.showModal({
          content: '您已断开连接，请重新连接',
          showCancel: false,
          success: function(res) {
            wx.navigateBack({})
          }
        })
      } else if (res.data != '连接websocket成功！') {
        // until.toast({
        //   title: res.data || '网络出错'
        // })
      }
    })
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
  // 查看图片
  lookImg(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  // 发送图片
  addImg(e) {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // console.log(res)
        wx.uploadFile({
          // 
          // https://www.lyjp.shop/api
          url: `${http.img_url}/file/upload`, //仅为示例，非真实的接口地址
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
            // console.log(re)
            if (re.code == 200) {
              let data = {
                api_token: that.data.userObj.api_token,
                to_uid: that.data.toUser.id,
                msg_type: 3,
                msg: re.data,
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
  // 发送消息
  sendClick: function(e) {
    let data = {
      api_token: this.data.userObj.api_token,
      to_uid: this.data.toUser.id,
      msg_type: 1,
      msg: this.data.inputVal || e.detail.value,
    }
    websocket.send(data)
  },

  /**
   * 退回上一页
   */
  toBackClick: function() {
    wx.navigateBack({})
  }

})