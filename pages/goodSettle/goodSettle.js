//index.js
//获取应用实例
const app = getApp();
import until from "../../utils/util.js";
import http from "../../common/js/http.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maskType: 0,
    address: {},
    goodsList: [],
    is_jifen: true,
    totalPrice: 0,
  },
  // 获取收货地址
  getAdress() {
    http.getReq('/address/get_my_default_address', {}, true).then(res => {
      if (res.code == 200) {
        this.setData({
          address: res.data
        })
      }
    })
  },
  // 代金券设置
  setShopCheck() {
    this.setData({
      is_jifen: !this.data.is_jifen
    })
  },
  bindinput(e) {
    let list = JSON.parse(JSON.stringify(this.data.goodsList))
    list[e.currentTarget.dataset.index].store.msg = e.detail.value;
    this.setData({
      goodsList: list
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
  // 显示make
  showMake(e) {
    this.setData({
      maskType: e.currentTarget.dataset.type / 1,
    })
  },
  // 结算
  submint() {
    let that = this;
    if (!this.data.address.name) {
      wx.showModal({
        title: '提示',
        content: '您还没有设置收货地址，请先添加收货地址！',
        success(res) {}
      })
    }
    let data = {
      address_id: this.data.address.id, //地址id
      payment: '1', //默认1 微信支付
      is_jifen: '0',
      jifen_num: '0',
      goods_info: [],
    }
    let list = JSON.parse(JSON.stringify(this.data.goodsList))
    list.forEach((item, index) => {
      data.goods_info.push({
        store_id: item.store.store_id,
        msg: item.store.msg,
        delivery: 1,
        goods: []
      })
      item.goods.forEach(value => {
        data.goods_info[index].goods.push({
          goods_id: value.id,
          sku_id: value.sku_id,
          goods_num: value.goods_num,
          cart_id: value.cart_id
        })
      })
    })
    let str = until.base64_encode(JSON.stringify(data));
    http.postReq('/order/submit', {
      order: str
    }, true).then(res => {
      if (res.code == 200) {

      } else if (res.code == 300) {
        wx.requestPayment({
          timeStamp: '',
          nonceStr: '',
          package: '',
          signType: '',
          paySign: '',
          success: (res) => {},
          fail: function(err) {}
        })
      } else {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let list = JSON.parse(JSON.stringify(app.globalData.goodsList));
    let totalPrice = 0;
    list.forEach(item => {
      item.store.msg = '';
      let check = item.goods.some(val => val.check);
      item.store.check = check;
      let sum = 0;
      item.goods.forEach(value => {
        sum += value.goods_num * value.goods_price;
      })
      item.sum = sum;
      totalPrice += item.sum;
    })
    this.setData({
      goodsList: list,
      totalPrice: totalPrice
    })
    this.getAdress()
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