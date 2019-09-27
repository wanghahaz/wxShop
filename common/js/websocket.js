// var url = 'ws://192.168.0.108:9501'; //服务器地址
let url = 'wss://www.lyjp.shop/wss';
let socketOpen = false;

function connect(func) {
  wx.connectSocket({
    url: url,
    header: {
      'content-type': 'application/json'
    },
    success: function() {
      console.log('websocket连接成功~')
    },

    fail: function() {
      wx.hideLoading();
      wx.showToast({
        title: '网络连接失败，请检查！',
        icon: "none",
        duration: 2000
      })
    }
  })

  wx.onSocketOpen(function(res) {
    socketOpen = true;
    //接受服务器消息
    wx.onSocketMessage(func); //func回调可以拿到服务器返回的数据
  });

  wx.onSocketError(function(res) {
    wx.hideLoading();
    socketOpen = false;
    wx.showToast({
      title: 'websocket连接失败，请检查！',
      icon: "none",
      duration: 2000
    })
  })
}

//发送消息
function send(msg) {
  console.log(msg)
  if (socketOpen) {
    wx.sendSocketMessage({
      data: JSON.stringify(msg)
    }, function(res) {});
  } else {
    wx.showToast({
      title: '请您检查网络！',
      icon: "none",
      duration: 2000
    })
  }
}

module.exports = {
  connect: connect,
  send: send,
  socketOpen
}