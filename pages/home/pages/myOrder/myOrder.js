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
      // '1_1': '退货中',
      // '1_2': '退货已拒绝',
      // '1_3': '已退货',
      // '3_1': '退款中',
      // '3_2': '退款已拒绝',
      // '3_3': '已退款',
    },
    isLoading: true,
    titleIndex: -1,
    height: 0,
    scrollLeft: 0,
    page: 1,
    goodsList: [],
    orderType: {},
  },
  setType() {
    let _this = this;
    let data = {
      type: this.data.orderType.type
    }
    if (this.data.orderType.type == 4) {
      data.use_jifen = this.data.orderType.jifen
    }
    http.postReq(`/order/deal/${this.data.orderType.id}`, data).then(res => {
      if (res.code == 300) {
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
            _this.getMyOrder()
          },
          fail: function(err) {
            console.log(err, 2)
          }
        })
      } else if (res.code == 200) {
        until.toast({
          icon: 'success',
          title: this.data.orderType.toast
        })

        setTimeout(() => {
          if (this.data.orderType.type == 1) {
            let list = this.data.goodsList.filter(item => item.id == this.data.orderType.id)
            app.globalData.commentList = list[0].orderdata;
            wx.redirectTo({
              url: `/pages/home/pages/sureGoods/sureGoods?id=${this.data.orderType.id}`,
            })
          } else {
            this.setData({
              isLoading: true,
              page: 1,
              goodsList: []
            })
            this.getMyOrder()
          }
        }, 1000)

      } else {
        until.toast({
          title: res.msg || '操作失败'
        })
      }
    })
  },
  // 操作订单
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
      if (e.currentTarget.dataset.jifen == 1) {
        let data = JSON.parse(JSON.stringify(this.data.orderType))
        data.jifen = 1;
        this.setData({
          orderType: data
        });
      }
      this.setType()
    }).catch(err => {
      if (e.currentTarget.dataset.jifen == 1) {
        let data = JSON.parse(JSON.stringify(this.data.orderType))
        data.jifen = 0;
        this.setData({
          orderType: data
        });
        this.setType()
      }
    })
  },
  // 获取订单列表
  getMyOrder() {
    http.getReq('/order/order_list', {
      page: this.data.page,
      type: this.data.titleIndex
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
  bindchange(e) {
    this.setData({
      titleIndex: e.currentTarget.dataset.index || e.detail.current,
      isLoading: true,
      page: 1,
      goodsList: []
    })
    this.getMyOrder()
    if (this.data.titleIndex == '-1' || this.data.titleIndex == 0) {
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
    if (options.index > 2) {
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
      goodsList: [],
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