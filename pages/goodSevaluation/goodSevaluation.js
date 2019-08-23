//index.js
//获取应用实例
const app = getApp()
import until from "../../utils/util.js";
import http from "../../common/js/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allCheck: 4,
    imgList: [],
  },
  submit() {
    until.toast({
      icon: 'success',
      title: '评论成功'
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
  changeStar(e) {
    this.setData({
      allCheck: e.currentTarget.dataset.index,
    })
  },
  // 删除图片
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(until)
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
  onShareAppMessage: function() {

  }
})