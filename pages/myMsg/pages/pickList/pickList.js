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
    hasOnShow: false,
    statusObj: {
      '-1': '全部',
      '0': '未付款',
      '1': '待发货',
      '2': '待收货',
      '3': '已完成',
      "4": "申请售后",
      '5': '拒绝售后',
      '6': '同意售后',
      '7': '完成售后',
      '8': '待评价',
      '9': '已取消',
      '10': '已关闭'
    },
    refund_type: {
      '1': '售后处理中',
      '2': '售后已完成',
      '3': '拒绝售后'
    },
    isLoading: true,
    page: 1,
    goodsList: [],
  },

  // 获取订单列表
  getMyOrder() {
    http.getReq('/order/delivery', {
      page: this.data.page,
    }, true).then(res => {
      if (res.code == 200) {
        let list = res.data.data;
        list.forEach(item => {
          item.orderdata.forEach(value => {
            value.type = `${value.refund_type}_${value.is_refund}`
          })
        })
        this.setData({
          goodsList: [...this.data.goodsList, ...list]
        })

        if (res.data.last_page == this.data.page) {
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
          isLoading: false
        })
      }

    })
  },
  toRouter(e) {
    if (e.currentTarget.dataset.path == '/pages/home/pages/goodSevaluation/goodSevaluation') {
      let list = this.data.goodsList.filter(item => item.id == e.currentTarget.dataset.id)
      app.globalData.commentList = list[0].orderdata;
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
  onLoad: function(options) {},


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.hasOnShow) {
      return
    }
    this.setData({
      isLoading: true,
      page: 1,
      goodsList: [],
      hasOnShow: true
    })
    this.getMyOrder()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      isLoading: true,
      page: 1,
      hasOnShow: false
    })
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
  onReachBottom: function(e) {
    if (this.data.isLoading) {
      this.getMyOrder()
    }
  },

  /**
   * 用户点击右上角分享
   */
})