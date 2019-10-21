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
    id: '',
    params: '',
    dealis: {}
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
  getDealis() {
    // order_id: 183,
    // params: 'e85f9dd6db520055'
    http.getReq('/store_tools/scan/info', {
      order_id: this.data.id,
      params: this.data.params
    }).then(res => {
      console.log(res)
      if (res.code == 200) {
        let sum = 0;
        res.data.orderdata.forEach(item => {
          sum += item.goods_num
        })
        this.setData({
          dealis: res.data,
          sums: sum
        })
      } else {
        wx.showModal({
          showCancel: false,
          content: res.msg || '请与买家核实订单信息',
          confirmText: '确定',
          success(res) {
            wx.navigateBack()
          }
        })
      }
    })
  },
  submit() {
    http.postReq(`/store_tools/scan/check_order/${this.data.id}`, {}).then(res => {
      if (res.code == 200) {
        until.toast({
          title: '您已核销订单'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        until.toast({
          title: res.msg || '操作失败'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this;
    let id = '',
      params = '';
    if (options.scene) {
      var scene = decodeURIComponent(options.scene)
      id = scene.split("&")[0].split('=')[1];
      params = scene.split('&')[1].split('=')[1];
    } else {
      id = options.id;
      params = options.params;
    }
    console.log(id)
    console.log(params)
    this.setData({
      id: id,
      params: params
    })
    this.getDealis()

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