//index.js
//获取应用实例
const app = getApp();
import until from "../../../utils/util.js";
import http from "../../../common/js/http.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttons: [{
      text: '确定'
    }],
    shopList: [],
    goodsList: [],
    totalPrice: 0,
    count: 0,
    allCheck: false,
    page: 1,
    isPullDownRefresh: true,
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false,
    })
    if (e.detail.item.token) {
      this.setData({
        token: false,
      })
    }
  },
  // 编辑购物车商品加减
  addOdd(e) {
    let num = e.currentTarget.dataset.num;
    if (e.currentTarget.dataset.type == 'add') {
      num = num + 1;
      if (num > e.currentTarget.dataset.storage) {
        return false;
      }
    } else {
      num = num-- > 1 ? num : 1;
    }
    if (e.currentTarget.dataset.type == 'odd' && e.currentTarget.dataset.num == 1) {
      return false;
    }
    http.postReq(`/cart/edit/${e.currentTarget.dataset.id}`, {
      goods_num: num,
      goods_spec: e.currentTarget.dataset.skuid
    }).then(res => {
      if (res.code == 200) {
        this.getCard()
      } else {
        until.toast({
          title: '编辑失败'
        })
      }
    })
  },
  // 获取购物车商品
  getCard() {
    http.getReq('/cart').then(res => {
      let list = res.data;
      if (res.code == 200) {
        list.forEach(item => {
          item.store.check = false;
          item.goods.forEach(value => {
            if (value.status == 1) {
              value.check = false
            } else {
              value.check = false;
            }
          })
        })
      } else {
        list = []
      }
      app.getPrice(list)
      this.setData({
        allCheck: false,
        goodsList: list,
        totalPrice: app.globalData.totalPrice,
        count: app.globalData.totalCount,
      })
    })
  },
  // 删除购物车
  delGoods(e) {
    http.postReq(`/cart/del/${e.currentTarget.dataset.id}`).then(res => {
      if (res.code == 200) {
        this.getCard()
      } else {
        until.toast({
          title: '删除失败'
        })
      }
    })
  },
  // 获取推荐商品
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
  // 设置选择
  setShopCheck(e) {
    let list = [];
    if (e.currentTarget.dataset.ind != undefined) {
      // goods选中
      this.data.goodsList[e.currentTarget.dataset.index].goods[e.currentTarget.dataset.ind].check = !e.currentTarget.dataset.check;
      list = this.data.goodsList;
      this.setData({
        goodsList: app.setCheck(list, '1').list,
        allCheck: app.setCheck(list, '1').allCheck,
        totalPrice: app.globalData.totalPrice,
        count: app.globalData.totalCount,
      })
    } else {
      // shop选择
      this.data.goodsList[e.currentTarget.dataset.index].store.check = !e.currentTarget.dataset.check;
      list = this.data.goodsList;
      this.setData({
        goodsList: app.setCheck(list, '2').list,
        allCheck: app.setCheck(list, '2').allCheck,
        totalPrice: app.globalData.totalPrice,
        count: app.globalData.totalCount,
      })
    }
  },
  // 全选切换
  selectAll() {
    this.setData({
      allCheck: !this.data.allCheck,
      goodsList: app.setCheck(this.data.goodsList, '', !this.data.allCheck).list,
      totalPrice: app.globalData.totalPrice,
      count: app.globalData.totalCount,
    })
  },
  toRouter(e) {
    if (e.currentTarget.dataset.path == '/pages/home/pages/goodSettle/goodSettle') {
      if (this.data.totalPrice / 1 <= 0) {
        return;
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.getGoods(); //好物推荐
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
    if (!wx.getStorageSync('token')) {
      this.setData({
        dialogShow: true
      })
    }
    if (wx.getStorageSync('token')) {
      this.getCard()
    } else {
      this.setData({
        goodsList: []
      })
    }
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    app.globalData.goodsList = this.data.goodsList;
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
    if (this.data.isPullDownRefresh && this.data.goodsList.length == 0) {
      this.getGoods()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})