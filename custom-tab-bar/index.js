const app = getApp()
Component({
  data: {
    goodsNumber: app.globalData.goodsNum,
    selected: 0,
    color: "#000",
    selectedColor: "#19d646",
    list: [{
      "pagePath": "/pages/index/index",
      "iconPath": "/image/index.png",
      "clas":"indexImg",
      "selectedIconPath": "/image/indexAc.png",
      "text": "首页"
    },
      {
        "pagePath": "/pages/classify/classify",
        "iconPath": "/image/classfiy.png",
        "clas": "classfy",
        "selectedIconPath": "/image/classfiyAc.png",
        "text": "分类"
      },
      {
        "pagePath": "/pages/advertising/advertising",
        "iconPath": "/image/banner.png",
        "clas": "banner",
        "selectedIconPath": "/image/bannerAc.png",
        "text": "广告"
      },
      {
        "pagePath": "/pages/shopCard/shopCard",
        "iconPath": "/image/cardt.png",
        "clas": "cardt",
        "selectedIconPath": "/image/cardAc.png",
        "text": "购物车"
      },
      {
        "pagePath": "/pages/mine/mine",
        "iconPath": "/image/mine.png",
        "clas": "minet",
        "selectedIconPath": "/image/mineAc.png",
        "text": "我的"
      }
    ]
  },
  attached() {},
  methods: {
    switchTab(e) {
      console.log()
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
      this.setData({
        selected: data.index
      })
    }
  }
})