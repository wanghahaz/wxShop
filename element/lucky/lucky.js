let awardsConfig = {
  chance: true,
  awards: [{
      'index': 0,
      'name': '1元红包'
    },
    {
      'index': 1,
      'name': '5元话费'
    },
    {
      'index': 2,
      'name': '6元红包'
    },
    {
      'index': 3,
      'name': '8元红包'
    },
    {
      'index': 4,
      'name': '10元话费'
    },
    {
      'index': 5,
      'name': '10元红包'
    }
  ]
}
Component({
  /**
   * 组件的属性列表
   */
  //奖品配置
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
  },
  attached: function() {
    console.log(awardsConfig)
    this.drawAwardRoundel();
    // 在组件实例进入页面节点树时执行
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //画抽奖圆盘
    drawAwardRoundel: function() {
      var awards = awardsConfig.awards;
      var awardsList = [];
      var turnNum = 1 / awards.length; // 文字旋转 turn 值

      // 奖项列表
      for (var i = 0; i < awards.length; i++) {
        awardsList.push({
          turn: i * turnNum + 'turn',
          lineTurn: i * turnNum + turnNum / 2 + 'turn',
          award: awards[i].name
        });
      }

      this.setData({
        btnDisabled:awardsConfig.chance ? '' : 'disabled',
        awardsList: awardsList
      });
    },

    //发起抽奖
    playReward: function() {
      //中奖index
      var awardIndex = parseInt(Math.random() * 6);
      console.log(awardIndex)
      var runNum = 8; //旋转8周
      var duration = 4000; //时长

      // 旋转角度
      this.runDeg = this.runDeg || 0;
      this.runDeg = this.runDeg + (360 - this.runDeg % 360) + (360 * runNum - awardIndex * (360 / 6))
      //创建动画
      var animationRun = wx.createAnimation({
        duration: duration,
        timingFunction: 'ease'
      })
      animationRun.rotate(this.runDeg).step();
      this.setData({
        animationData: animationRun.export(),
        btnDisabled: 'disabled'
      });

      // 中奖提
      console.log(awardsConfig)
      setTimeout(function() {
        wx.showModal({
          title: '恭喜',
          content: '获得' + (awardsConfig.awards[awardIndex].name),
          showCancel: false
        });
        this.triggerEvent('myevent', awardsConfig.awards[awardIndex])
        this.setData({
          btnDisabled: ''
        });
      }.bind(this), duration);
    }
  }
})