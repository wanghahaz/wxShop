//index.js
//获取应用实例
import until from "../../../../utils/util.js";
import http from "../../../../common/js/http.js";
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusObj: {
      '0': '待付款',
      '1': '待发货',
      '2': '待收货',
      '3': '已收货',
      "4": "商家审核中",
      '5': '已拒绝',
      '6': '商家审核通过',
      '7': '退款成功',
      '8': '已完成',
      '9': '已取消',
      '10': '已关闭'
    },
    refund_type: {
      '1': '售后处理中',
      '2': '售后已完成',
      '3': '拒绝售后'
      // '1_1': '退货中',
      // '1_2': '退货已拒绝',
      // '1_3': '已退货',
      // '1_3': '退款中',
      // '2_3': '退款已拒绝',
      // '3_3': '已退款',
    },
    dealis: {},
    id: null,
    orderType: {}
  },
  call(e) {
    until.toast({
      title: "商家没有绑定电话！"
    })
  },
  toRouter(e) {
    let goods = JSON.parse(JSON.stringify(this.data.dealis.order_data))
    goods.forEach(item => {
      item.check = true;
      item.cart_id = 0;
    })
    // 
    if (e.currentTarget.dataset.path == '/pages/home/pages/goodSevaluation/goodSevaluation') {
      app.globalData.commentList = this.data.dealis.order_data
    }
    if (e.currentTarget.dataset.path == '/pages/home/pages/goodSettle/goodSettle') {
      let list = [{
        store: {
          store_name: this.data.dealis.store.store_name,
          store_id: this.data.dealis.store.id,
          store_thumb: this.data.dealis.store.store_thumb,
          check: true
        },
        goods: goods
      }];
      app.globalData.goodsList = list;
    }
    if (e.currentTarget.dataset.path === '/pages/home/pages/salesSub/salesSub') {
      let saleGoods = this.data.dealis.order_data.filter(item => item.id == e.currentTarget.dataset.goodid)[0]
      app.globalData.saleGoods = saleGoods;
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
  getDealis() {
    http.getReq(`/order/info/${this.data.id}`, {}, true).then(res => {
      // console.log(res)
      if (res.code == 200) {
        let data = res.data;
        data.order_data.forEach(item => {
          item.type = `${item.is_refund}_${item.refund_type}`
        })
        this.setData({
          dealis: data
        })
      } else {
        until.toast({
          title: "加载失败"
        })
      }
    })
  },
  setType() {
    let data = {
      type: this.data.orderType.type
    }
    if (this.data.orderType.type == 4) {
      data.use_jifen = this.data.orderType.jifen
    }
    http.postReq(`/order/deal/${this.data.orderType.id}`, data).then(res => {
      console.log(res)
      if (res.code == 200) {
        until.toast({
          icon: 'success',
          title: this.data.orderType.toast
        })
        if (this.data.orderType.toast == '已删除订单') {
          setTimeout(() => {
            wx.navigateBack({})
          }, 1000)
        } else {
          setTimeout(() => {
            this.getDealis()
          }, 1000)
        }

      } else if (res.code == 300) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: (re) => {
            _this.setData({
              isLoading: true,
              page: 1,
              goodsList: []
            })
            _this.getDealis()
          },
          fail: function(err) {
            console.log(err, 2)
          }
        })
      } else {
        until.toast({
          title: res.msg || '操作失败'
        })
      }
    })
  },
  editStatus(e) {
    // type 1:确认收货 2:取消订单 3:删除订单 4:立即付款  5:提醒发货
    this.setData({
      orderType: e.currentTarget.dataset
    });
    until.modal({
      content: e.currentTarget.dataset.model,
      confirmText: e.currentTarget.dataset.jifen ? '使用' : '',
      cancelText: e.currentTarget.dataset.jifen ? '不使用' : ''
    }).then(res => {
      if (e.currentTarget.dataset.jifen && e.currentTarget.dataset.jifen != '0.00') {
        let data = JSON.parse(JSON.stringify(this.data.orderType))
        data.jifen = 1;
        this.setData({
          orderType: data
        });
      }
      this.setType()
    }).catch(err => {
      let data = JSON.parse(JSON.stringify(this.data.orderType))
      data.jifen = 0;
      this.setData({
        orderType: data
      });
      console.log(111)
      if (e.currentTarget.dataset.jifen && e.currentTarget.dataset.jifen != '0.00') {
        this.setType()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
    })
  },
  setClip(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.content,
      success(res) {},
      fail(err) {}
    })
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
    this.getDealis()
  },

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