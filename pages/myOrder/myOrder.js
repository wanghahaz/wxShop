//index.js
//获取应用实例
const app = getApp();
import http from "../../common/js/http.js";
import until from "../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    titleIndex: 0,
    height: 0,
    scrollLeft: 0,
    page: 1,
    goodsList: []
  },
  lower(e) {},
  // 取消订单
  cancel(e) {
    until.modal({
      title: '取消订单',
      content: '订单还未付款，确定要取消吗？'
    }).then(res => {
      until.toast({
        icon: 'success',
        title: '取消订单成功'
      })
    }).catch(err => {})
  },
  // 提醒发货
  alertGoods(e){
    until.toast({
      icon: 'success',
      title: '已提醒卖家发货'
    })
  },
  // 删除订单
  delOrder(e){
    until.modal({
      title: '删除订单',
      content: '您确认删除订单吗？'
    }).then(res => {
      until.toast({
        icon: 'success',
        title: '已删除'
      })
    })
  },
  // 确认收货
  affirmGoods(e){
    console.log('确认收货')
  },
  // 合并付款
  sumSubmit(e){
    console.log('合并付款')
  },
  // 确认付款
  submitMoney(e){
    console.log('确认付款')
  },
  getMyOrder() {
    http.getReq('/order/order_list', {
      page: this.data.page,
      type: this.data.titleIndex/1-1
    }, true).then(res => {
      console.log(res)
      // this.setData({
      //   goodsList: [...this.data.goodsList, ...res.data.data]
      // })
      // if (res.data.last_page == this.data.page) {
      //   this.setData({
      //     isLoading: false
      //   })
      // } else {
      //   this.setData({
      //     page: this.data.page++
      //   })
      // }
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
  bindchange(e) {
    this.setData({
      titleIndex: e.currentTarget.dataset.index || e.detail.current,
      isLoading: true,
      page:1
    })
    this.getMyOrder()
    if (this.data.titleIndex == 0 || this.data.titleIndex == 1) {
      this.setData({
        scrollLeft: 0
      })
    } else {
      this.setData({
        scrollLeft: 100
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMyOrder()
    if (options.index > 3) {
      this.setData({
        scrollLeft: 100
      })
    }
    this.setData({
      titleIndex: options.index
    })
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
  onReachBottom: function(e) {
    if (!this.data.isLoading) {
      return false;
    } else {
      this.getMyOrder()
    }
    console.log(1)
    // this.setData({
    //   isLoading:false
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})