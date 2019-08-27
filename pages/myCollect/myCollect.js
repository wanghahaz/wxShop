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
  showModel() {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  // 获取商品 0
  getGoodsColl() {
    let type = this.data.titleIndex;
    type = type == 0 ? 1 : 2;
    http.getReq('/collect/my', {
      page: this.data.page,
      type: type
    }, true).then(res => {
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
          goosList: [],
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
    this.getGoodsColl()
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
    if (this.data.isLoading) {
      this.getGoodsColl()
    }
  },
})