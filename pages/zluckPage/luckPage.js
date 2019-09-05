// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },
//   myevent(e){
//     console.log(e)
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })
import until from "../../utils/util.js";
import http from "../../common/js/http.js";
Page({
  data: {
    list: [],
    topNum: 0,
    isShow: false,
    bomNum: 240
  },
  click(e) {
    console.log(e)
  },
  onShow: function() {
    this.getList()
    // 页面显示
  },
  getList() {
    http.getReq('/advert/jifen_logs', {
      page: this.data.page,
    }).then(res => {
      this.setData({
        list: res.data,
      })
      let length = this.data.list.length * 60;
      this.setData({
        length: length - 240
      })
      this.setTime()
    })
  },
  setTime() {
    let timers = setInterval(() => {
      console.log(-this.data.length)
      if (!this.data.isShow) {
        this.setData({
          topNum: this.data.topNum - 1,
          bomNum: this.data.bomNum - 1,
        })
      }
      if (this.data.isShow) {
        this.setData({
          bomNum: this.data.bomNum - 1,
          topNum: this.data.topNum - 1,
        })
      }
      if (this.data.bomNum == (-this.data.length)) {
        console.log(1)
        this.setData({
          isShow: false,
          bomNum: 240
        })
      }
      if (this.data.topNum == (-this.data.length)) {
        this.setData({
          isShow: true,
          topNum: 240
        })
      }
    }, 20)
  },

})