// 域名
let req_url = 'http://mall.com/api';
// get请求
let getReq = function(url, data, show) {
  if (show) {
    wx.showLoading({
      title: '加载中',
    })
  }
  return new Promise(function(resolve, reject) {
    wx.request({
      url: req_url + url,
      method: 'GET',
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token') ? wx.getStorageSync('token') : null
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '401') {
          wx.showModal({
            content: res.data.msg,
            showCancel: false
          })
          reject(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        reject(err)
      }
    })
  })
}
// post
let postReq = function(url, data, show) {
  if (show) {
    wx.showLoading({
      title: '加载中',
    })
  }
  return new Promise(function(resolve, reject) {
    wx.request({
      url: req_url + url,
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', // 默认值
        'Authorization': wx.getStorageSync('token') ? wx.getStorageSync('token') : null,
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '401') {
          wx.showModal({
            content: res.data.msg || '网络出错，请刷新重试',
            showCancel: false
          })
          reject(res.data)
        } else {
          resolve(res.data)
        }
      },
      fail: function(err) {
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        reject(err)
      }
    })
  })
};

module.exports = {
  req_url: req_url,
  getReq: getReq,
  postReq: postReq,
}