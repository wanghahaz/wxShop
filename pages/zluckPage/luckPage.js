// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },
//   myevent(e){
//     console.log(e)
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
// })
Page({
  data: {
    text: ['这是一条会滚动的文字滚来滚去的文字跑马灯', '这是一条会滚动的文字滚来滚去的文字跑马灯', '这是一条会滚动的文字滚来滚去的文字跑马灯', '哈哈哈哈哈哈哈哈'],
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin:10,
    size: 14,
    orientation: 'top', //滚动方向
    interval: 30 // 时间间隔
  },
  click(e) {
    console.log(e)
  },
  onShow: function() {
    // 页面显示
    var vm = this;
    var length = vm.data.text.length * 60; //文字长度
    console.log(length)
    vm.setData({
      length: length,
      windowWidth: 200,
      marquee2_margin: length < 180 ? 180 - length : vm.data.marquee2_margin //当文字长度小于屏幕长度时，需要增加补白
    });
    vm.run2(); // 第一个字消失后立即从右边出现
  },
  run2: function() {
    var vm = this;
    var interval = setInterval(function() {
      if (-vm.data.marqueeDistance2 < vm.data.length) {
        // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
        vm.setData({
          marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
          marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
        });
        clearInterval(interval);
        vm.run2();
      } else {
        if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
          vm.setData({
            marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
          });
          clearInterval(interval);
          vm.run2();
        } else {
          clearInterval(interval);
          vm.setData({
            marqueeDistance2: -vm.data.windowWidth
          });
          vm.run2();
        }
      }
    }, vm.data.interval);
  }
})