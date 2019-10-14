// //index.js
// //获取应用实例
const app = getApp();
import until from "../../../../utils/util.js";
import http from "../../../../common/js/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    dialogShow: false,
    clientHeight: app.globalData.clientHeight / 2,
    scrollTop: 0,
    is_collect: 1,
    showMask: true,
    isPullDownRefresh: true,
    page: 1,
    shopList: [],
    commentList: [],
    dataObj: {},
    goodsData: {},
    skuObj: {},
    selectSku: {},
    goods_num: 1,
    goods_storage: 0,
    goods_price: 0,
    goods_body: '',
    goods_thumb: '',
    expressFee: ''
  },
  // 组件返回值
  tapDialogButton(e) {
    // console.log('dialog', e.detail)
    this.setData({
      dialogShow: false,
    })
  },
  // 吸顶
  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  suckTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  // 收藏商品
  collectGoods() {
    if (!wx.getStorageSync('token')) {
      this.setData({
        dialogShow: true
      })
      return false;
    }
    http.postReq('/collect', {
      id: this.data.dataObj.id,
      type: 1
    }, true).then(res => {
      let is_collect = res.msg == '收藏成功' ? 1 : 0
      this.setData({
        is_collect: is_collect
      })
    })
  },
  // 商品加减
  addOdd(e) {
    if (this.data.goods_storage == 0) {
      until.toast({
        title: '此商品暂无库存,请您重新选择'
      })
      return false;
    }
    if (e.currentTarget.dataset.type == 'add') {
      this.setData({
        goods_num: this.data.goods_num + 1 > this.data.goods_storage ? this.data.goods_storage : this.data.goods_num + 1
      })
    } else {
      let num = this.data.goods_num;
      num = num-- > 1 ? num : 1;
      this.setData({
        goods_num: num
      })
    }
  },
  // 获取好物推荐
  getGoods() {
    http.getReq('/index/goods', {
      page: this.data.page
    }, true).then(res => {
      this.setData({
        shopList: [...this.data.shopList, ...res.data.data]
      })
      if (res.data.last_page == this.data.page) {
        this.setData({
          isPullDownRefresh: false
        })
      } else {
        this.setData({
          page: this.data.page + 1
        })
      }
    })
  },
  showModel(e) {
    this.setData({
      showMask: !this.data.showMask,
      showType: e.currentTarget.dataset.type || 0
    })
  },
  toRouter(e) {
    if (e.currentTarget.dataset.path == '/pages/home/pages/evaluateList/evaluateList') {
      if (this.data.commentList.length == 0) {
        return;
      }
    }
    if (e.currentTarget.dataset.path == '/pages/home/pages/websocket/websocket') {
      let goods = {
        goods_name: this.data.goodsData.row.goods_name,
        goods_thumb: this.data.goodsData.row.goods_thumb,
        goods_price: this.data.goodsData.row.goods_price,
        goods_id: this.data.dataObj.id,
        sku_id: this.data.dataObj.sku_id,
      }
      app.globalData.webGoods = goods;
      if (!wx.getStorageSync('token')) {
        this.setData({
          dialogShow: true
        })
        return false;
      }
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
  switchTab(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.path,
    })
  },
  // 获取商品详情
  getGoodDealis() {
    http.getReq('/goods', this.data.dataObj, true).then(res => {
      if (res.code == 200) {
        this.setData({
          goodsData: res.data,
          goods_body: res.data.row.goods_body.replace(/\<img/g, '<img style="width:100%;height:auto;display:block;margin:10px 0 10px 0" '),
          is_collect: res.data.is_collect,
          goods_storage: res.data.row.goods_storage,
          goods_price: res.data.row.goods_price,
          goods_thumb: res.data.row.goods_images[0],
          goods_service: res.data.row.goods_service == null ? res.data.row.goods_service : res.data.row.goods_service.join(',')
        })
        // goodsData.row.store_tmpl_strategy.type == 2 ? '包邮'：
        // goodsData.row.store_tmpl_strategy.type == 3 ? '满' + goodsData.row.store_tmpl_strategy.money + '元包邮' : goodsData.row.tmpl_rule ? goodsData.row.tmpl_rule.tmpl_rule.default_money + '元' : '包邮'

        // expressFee: ''
        let expressFee = '';
        if (res.data.row.store_tmpl_strategy.type == 2) {
          expressFee = '包邮'
        } else if (res.data.row.store_tmpl_strategy.type == 3) {
          expressFee = '满' + res.data.row.store_tmpl_strategy.money + '元包邮'
        } else if (res.data.row.tmpl_rule) {
          expressFee = res.data.row.tmpl_rule.tmpl_rule.default_money + '元'
        } else {
          expressFee = res.data.row.freight_fee > '0.00' ? res.data.row.freight_fee + '元' : '包邮'
        }
        this.setData({
          expressFee: expressFee
        })
      } else {
        until.toast({
          title: '加载失败'
        })
      }
    })
  },
  // 立即购买
  addBuy() {
    if (!wx.getStorageSync('token')) {
      this.setData({
        dialogShow: true
      })
      return false;
    }
    if (this.data.goods_storage == 0) {
      until.toast({
        title: '此商品暂无库存,请您重新选择'
      })
      return false;
    }
    if (this.data.skuObj.spec) {
      if (!this.data.selectSku.goods_price) {
        until.toast({
          title: '请您选择商品'
        })
        return false;
      }
    }
    let list = [{
      store: {
        store_name: this.data.goodsData.store.store_name || '',
        store_id: this.data.goodsData.store.id,
        store_tmpl_strategy_type: this.data.goodsData.row.store_tmpl_strategy.type,
        store_tmpl_strategy_money: this.data.goodsData.row.store_tmpl_strategy.money,
        check: true
      },
      goods: [{
        cart_id: 0,
        check: true,
        id: this.data.goodsData.row.id,
        goods_num: this.data.goods_num,
        goods_name: this.data.goodsData.row.goods_name,
        goods_thumb: this.data.goods_thumb,
        goods_price: this.data.selectSku.goods_price || this.data.goodsData.row.goods_price,
        goods_storage: this.data.selectSku.goods_storage || this.data.goodsData.row.goods_storage,
        is_mult: this.data.goodsData.row.is_mult,
        sku_id: this.data.selectSku.id || this.data.dataObj.sku_id,
        spec_name: this.data.selectSku.spec_name || '',
        freight_fee: this.data.goodsData.row.freight_fee,
        tmpl_rule: this.data.goodsData.row.tmpl_rule
      }]
    }];
    app.globalData.goodsList = list;
    wx.navigateTo({
      url: '/pages/home/pages/goodSettle/goodSettle?type=1'
    })
  },
  // 加入购物车
  addCard() {
    if (!wx.getStorageSync('token')) {
      this.setData({
        dialogShow: true
      })
      return false;
    }
    if (this.data.skuObj.spec) {
      if (this.data.goods_storage == 0) {
        until.toast({
          title: '此商品暂无库存,请您重新选择'
        })
        return false;
      }
      if (!this.data.selectSku.goods_price) {
        until.toast({
          title: '请您选择商品'
        })
        return false;
      }
    }
    let data = JSON.parse(JSON.stringify(this.data.dataObj));
    data.goods_spec = this.data.selectSku.id || data.sku_id;
    data.goods_id = data.id;
    data.goods_num = this.data.goods_num;
    delete data.sku_id;
    delete data.id;
    delete data.user_id;
    http.postReq('/cart/add', data, true).then(res => {
      if (res.code == 200) {
        until.toast({
          title: '已加入购物车！'
        })
      } else {
        until.toast({
          title: '加入购物车失败！'
        })
      }
    })
  },
  // 选择规格
  selectSku(e) {
    let list = JSON.parse(JSON.stringify(this.data.skuObj.spec));
    let obj = JSON.parse(JSON.stringify(this.data.skuObj));
    // console.log(e)
    // console.log(list)
    // console.log(obj)
    list[e.currentTarget.dataset.index].sub.forEach((item, index) => {
      if (index == e.currentTarget.dataset.ind) {
        item.check = !item.check
      } else {
        item.check = false;
      }
    })
    obj.spec = list;
    this.setData({
      skuObj: obj,
      selectSku: {}
    })
    let specList = this.data.skuObj.spec;
    let skuList = this.data.skuObj.sku;
    let selectSpec = [];
    if (specList) {
      specList.forEach(item => {
        item.sub.forEach(value => {
          if (value.check) {
            selectSpec.push(value.id)
          }
        })
      })
      if (selectSpec.length == specList.length) {
        let str = selectSpec.join('_');
        if (!skuList.find(item => item.spec == str)) {
          this.setData({
            selectSku: {},
            goods_storage: 0,
            goods_price: this.data.goods_price,
            goods_thumb: this.data.goods_thumb,
            goods_num: 1
          })
          return false;
        }
        this.setData({
          selectSku: skuList.find(item => item.spec == str),
          goods_storage: skuList.find(item => item.spec == str).goods_storage,
          goods_price: skuList.find(item => item.spec == str).goods_price,
          goods_thumb: skuList.find(item => item.spec == str).goods_thumb,
          goods_num: 1
        })
      } else {
        this.setData({
          selectSku: {},
        })
      }
    }
  },
  // 商品评价好评率等计算
  getEval_top() {
    http.getReq(`/goods/get_eval_top/${this.data.dataObj.id}`, {}).then(res => {
      if (res.code == 200) {
        let data = res.data;
        data.percent = res.data.high_rate / 1 == 1 ? `${res.data.high_rate/1}00` : res.data.high_rate == 0 ? 0 : res.data.high_rate / 1 * 100;
        this.setData({
          eval_top: data
        })
      }
    })
  },
  // 商品评价
  getComment() {
    http.getReq(`/goods/get_eval_list/${this.data.dataObj.id}`, {
      page: 1,
      type: 0
    }).then(res => {
      if (res.code == 200) {
        this.setData({
          commentList: res.data.data
        })
      }
    })
  },
  // 获取商品规格
  getSku() {
    http.getReq(`/goods/get_sku/${this.data.dataObj.id}`, {}).then(res => {
      if (res.code == 200) {
        let obj = res.data;
        if (obj.spec.length > 0) {
          obj.spec.forEach(item => {
            item.sub.forEach(val => {
              val.check = false;
            })
          })
        }
        this.setData({
          skuObj: obj
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    if (!wx.getStorageSync('share_id')) {
      wx.setStorage({
        key: "share_id",
        data: options.share_id ? options.share_id : 0
      })
    }
    _this.setData({
      dataObj: {
        id: options.id,
        sku_id: options.skuid ? options.skuid : 0,
        user_id: app.globalData.userInfo.id ? app.globalData.userInfo.id : '0'
      }
    })
    _this.getGoods()
    _this.getComment()
    _this.getSku()
    _this.getGoodDealis()
    _this.getEval_top()
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
    this.setData({
      showMask: true
    })
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
    // if (this.data.isPullDownRefresh) {
    //   this.getGoods()
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let share_id = null;
    if (wx.getStorageSync('token')) {
      share_id = wx.getStorageSync('userInfo').id;
    } else {
      share_id = 0;
    }
    return {
      title: '您好，欢迎使用零元晋品',
      imageUrl: this.data.goodsData.row.goods_images[0],
      path: '/pages/home/pages/goodsDealis/goodsDealis?share_id=' + share_id,
    }
  }
})