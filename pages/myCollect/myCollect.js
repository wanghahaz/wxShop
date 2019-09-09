//index.js
//获取应用实例
const app = getApp();
import until from "../../utils/util.js";
import http from "../../common/js/http.js";
Page({
  data: {
    showMask: true,
    titleIndex: 0,
    startX: 0, //开始坐标
    startY: 0,
    isLoading: true,
    page: 1,
    list: [],
    collId: null,
    showObj: {},
    selectSku: {},
    skuObj: {},
    goods_num: 1
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
  // 商品加减
  addOdd(e) {
    if (this.data.skuObj.spec) {
      if (!this.data.selectSku.goods_price) {
        until.toast({
          title: '请您选择商品'
        })
        return false;
      }
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
  // 加入购物车
  addCard() {
    if (this.data.skuObj.spec) {
      if (!this.data.selectSku.goods_price) {
        until.toast({
          title: '请您选择商品'
        })
        return false;
      }
    }
    let data = {};
    data.goods_spec = this.data.selectSku.id || '';
    data.goods_id = this.data.goodsId;
    data.goods_num = this.data.goods_num;

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
  // 立即购买
  addBuy() {
    if (this.data.skuObj.spec) {
      if (!this.data.selectSku.goods_price) {
        until.toast({
          title: '请选择选择商品'
        })
        return false;
      }
    }
    console.log(this.data.showObj)
    let list = [{
      store: {
        store_name: this.data.showObj.store.store_name,
        store_id: this.data.showObj.store.id,
        check: true
      },
      goods: [{
        cart_id: 0,
        check: true,
        id: this.data.goodsId,
        goods_num: this.data.goods_num,
        goods_name: this.data.showObj.goods.goods_name,
        goods_thumb: this.data.goods_thumb,
        goods_price: this.data.goods_price,
        goods_storage: this.data.goods_storage,
        sku_id: this.data.selectSku.id || '',
        spec_name: this.data.selectSku.spec_name || ''
      }]
    }];
    app.globalData.goodsList = list;
    wx.navigateTo({
      url: '/pages/goodSettle/goodSettle'
    })
  },
  // 选择规格
  selectSku(e) {
    let list = JSON.parse(JSON.stringify(this.data.skuObj.spec));
    let obj = JSON.parse(JSON.stringify(this.data.skuObj));
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
          until.toast({
            title: '此商品暂无库存,请您重新选择'
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
  // 购物车
  showModel(e) {
    if (!e.currentTarget.dataset.obj) {
      this.setData({
        showMask: !this.data.showMask,
      })
    } else {
      http.getReq(`/goods/get_sku/${e.currentTarget.dataset.obj.goods.id}`, {}, true).then(res => {
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
        } else {
          this.setData({
            skuObj: {}
          })
        }
        this.setData({
          goodsId: e.currentTarget.dataset.obj.goods.id,
          showObj: e.currentTarget.dataset.obj,
          showMask: !this.data.showMask,
          goods_thumb: e.currentTarget.dataset.obj.goods.goods_thumb,
          goods_storage: e.currentTarget.dataset.obj.goods.goods_storage,
          goods_price: e.currentTarget.dataset.obj.goods.goods_price,
        })
      })
    }

    // console.log(this.data.showObj)
  },
  // 获取商品 0
  getGoodsColl() {
    let type = this.data.titleIndex;
    type = type == 0 ? 1 : 2;
    http.getReq('/collect/my', {
      page: this.data.page,
      type: type
    }, true).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          list: [...this.data.list, ...res.data.data],
        })
        if (this.data.page >= res.data.last_page) {
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
          list: [],
          isLoading: false
        })
      }

    }).catch(err => {})
  },
  // 切换title
  bindchange(e) {
    this.setData({
      titleIndex: e.currentTarget.dataset.index || e.detail.current,
      isLoading: true,
      list: [],
      page: 1
    })
    this.getGoodsColl()
  },
  onLoad: function() {
    console.log(wx.getStorageSync('userInfo'))
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.list.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: this.data.list
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    this.setData({
      collId: e.currentTarget.dataset.id
    })
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.list.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      list: that.data.list
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function(e) {
    let type = this.data.titleIndex;
    type = type == 0 ? 1 : 2;
    http.postReq('/collect', {
      id: this.data.collId,
      type: type
    }, true).then(res => {
      if (res.code == 200) {
        this.setData({
          isLoading: true,
          list: [],
          page: 1
        })
        this.getGoodsColl()
      } else {
        until.toast({
          title: '操作失败'
        })
      }
    })
  },
  onShow: function() {
    this.setData({
      list: []
    })
    this.getGoodsColl()
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
    if (this.data.isLoading) {
      this.getGoodsColl()
    }
  },
})