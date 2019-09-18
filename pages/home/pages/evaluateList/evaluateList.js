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
    typeList: [{
      id: 0,
      name: '全部'
    }, {
      id: 1,
      name: '满意'
    }, {
      id: 2,
      name: '一般'
    }, {
      id: 3,
      name: '差评'
    }],
    goodsId: 0,
    commentList: [],
    page: 1,
    isLoding: true,
    eval_top: {},
    type: 0
  },
  setType(e) {
    this.setData({
      type: e.currentTarget.dataset.type,
      isLoding: true,
      page: 1,
      commentList: []
    })
    this.getComment()
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
  // 商品评价好评率等计算
  getEval_top() {
    http.getReq(`/goods/get_eval_top/${this.data.goodsId}`, {}).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          eval_top: res.data
        })
      }
    })
  },
  // 商品评价
  getComment() {
    http.getReq(`/goods/get_eval_list/${this.data.goodsId}`, {
      page: this.data.page,
      type: this.data.type
    }, true).then(res => {
      if (res.code == 200) {
        this.setData({
          commentList: [...this.data.commentList, ...res.data.data]
        })
        if (res.data.last_page == this.data.page) {
          this.setData({
            isLoding: false
          })
        } else {
          this.setData({
            page: this.data.page + 1
          })
        }
      } else {
        this.setData({
          isLoding: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goodsId: options.id
    })
    this.getComment()
    this.getEval_top()
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
    if (this.data.isLoding) {
      this.getComment()
    }
  },

  /**
   * 用户点击右上角分享
   */
})