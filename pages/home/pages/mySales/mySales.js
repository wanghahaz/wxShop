//index.js
//获取应用实例
const app = getApp();
import until from "../../../../utils/util.js";
import http from "../../../../common/js/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleIndex: 1,
    imgList: [],
    address:{}
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
  changeTitle(e) {
    this.setData({
      titleIndex: e.currentTarget.dataset.index,
    })
  },
  delImg(e) {
    let list = this.data.imgList;
    list.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      imgList: list
    })
  },
  // 添加图片
  addImg(e) {
    let list = this.data.imgList;
    if (this.data.imgList.length >= 5) {
      until.toast({
        title: '最多上传五张图片',
        icon: 'none'
      })
      return false;
    }
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        list.push(res.tempFilePaths[0])
        that.setData({
          imgList: list
        })
        console.log(res.tempFilePaths[0])
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
  //获取位置
  changeAddress() {
    let that = this;
    wx.chooseAddress({
      success: function(res) {
        that.setData({
          address: res
        })
        console.log(res)
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  getAddress() {
    var _this = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          //未授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function(res) {
              if (res.cancel) {
                //取消授权
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                //确定授权，通过wx.openSetting发起授权请求
                wx.openSetting({
                  success: function(res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      _this.getLocation();

                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户首次进入页面,调用wx.getLocation的API
          _this.getLocation();
        } else {
          console.log('授权成功')
          //调用wx.getLocation的API
          _this.getLocation();
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
})