Component({
  /**
   * 组件的属性列表
   */
  properties: {
    obj: {
      type: Object,
      value: {}
    },
    isInfo: {
      type: Boolean
    }
  },
  attached: function() {
    // 在组件实例进入页面节点树时执行
  },
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    cancel(e) {
      this.triggerEvent('myevent', {
        type: false
      })
    },
    getInfo() {
      this.triggerEvent('myevent', {
        type: false
      })
      wx.getUserInfo({
        success: function(res) {
          console.log(res.userInfo)
          // app.globalData.userInfo = res.userInfo
          // app.globalData.nick_name = res.userInfo.nickName
        },
        fail: function(res) {
          // console.log(res)
        }
      })
    },
  }
})