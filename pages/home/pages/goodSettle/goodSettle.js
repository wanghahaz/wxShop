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
    maskType: 0,
    address: {},
    goodsList: [],
    is_jifen: false,
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
      is_jifen: this.data.is_jifen ? 1 : 0,
      jifen_num: this.data.is_jifen ? (this.data.totalPrice > this.data.money ? this.data.money : this.data.totalPrice) : 0,
      goods_info: [],
    }
    let list = JSON.parse(JSON.stringify(this.data.goodsList))
    list.forEach((item, index) => {
      data.goods_info.push({
        store_id: item.store.store_id,
        msg: `${item.store.msg}`,
        delivery: 1,
        goods: []
      })
      item.goods.forEach(value => {
        data.goods_info[index].goods.push({
          goods_id: value.goods_id || value.id,
          sku_id: value.sku_id || 0,
          goods_num: value.goods_num,
          cart_id: value.cart_id
        })
      })
    })
    console.log(until.base64_encode(JSON.stringify(data)))
    let str = until.base64_encode(encodeURI(JSON.stringify(data)));
    http.postReq('/order/submit', {
      order: str
    }, true).then(res => {
      console.log(res)
      if (res.code == 200) {
        until.toast({
          title: '支付成功'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000)
      } else if (res.code == 300) {
        wx.requestPayment({
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success: (res) => {
            console.log(res, 1)
            wx.navigateBack()
          },
          fail: function(err) {
            wx.redirectTo({
              url: `/pages/home/pages/myOrder/myOrder?index=${0}`
            })
          }
        })
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
  getChit() {
    http.getReq('/jifen/logs', {}, true).then(res => {
      if (res.code == 200) {
        this.setData({
          money: res.data.jifen
        })
      }
    })
  },
  onLoad: function(options) {
    let that = this;
    let list = JSON.parse(JSON.stringify(app.globalData.goodsList));
    let totalPrice = 0;
    let fee = '包邮';
    list.forEach(item => {
      item.store.msg = '';
      let check = item.goods.some(val => val.check);
      item.store.check = check;
      let sum = 0;
      let max = item.goods[0].tmpl_rule ? item.goods[0].tmpl_rule.tmpl_rule.default_money.split(".")[0] : item.goods[0].freight_fee.split(".")[0]
      item.goods.forEach((value, ind) => {
        if ((ind + 1) < item.goods.length) {
          console.log(ind)
          console.log(item.goods[ind + 1].tmpl_rule)
          max = max < item.goods[ind + 1].tmpl_rule ? item.goods[ind + 1].tmpl_rule.tmpl_rule.default_money.split(".")[0] : item.goods[ind + 1].freight_fee.split(".")[0] ? item.goods[ind + 1].tmpl_rule ? item.goods[ind + 1].tmpl_rule.tmpl_rule.default_money.split(".")[0] : item.goods[ind + 1].freight_fee.split(".")[0] : max
        }
        sum += value.goods_num * value.goods_price;
      })
      item.sum = sum.toFixed(2);
      totalPrice += item.sum / 1;
      let fee_money = item.store.store_tmpl_strategy_money || item.store_tmpl_strategy.money;
      if ((item.store.store_tmpl_strategy_type || item.store_tmpl_strategy.type) == 1) {
        item.fee = `${max}元`
      } else if ((item.store.store_tmpl_strategy_type || item.store_tmpl_strategy.type) == 2) {
        item.fee = "包邮"
      } else {
        item.fee = item.sum > fee_money.split(".")[0] ? `${max}元` : '包邮'
      }
    })
    console.log(list)
    that.setData({
      goodsList: list,
      totalPrice: options.type ? totalPrice.toFixed(2) : app.globalData.totalPrice
    })
    that.getAdress()
    that.getChit()
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